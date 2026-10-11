// Intro: an ECG trace with three heartbeats about a second apart, the three mottos, then the page.
// playIntro(done) builds the overlay, plays it once and calls done() when it is gone.
// playIntro(done, true) is the replay: the curtain falls, the heartbeat loops and any click or key raises it.
(function () {
  function playIntro(done, hold) {
    var still = hold && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var root = document.createElement("div");
    root.className = "intro" + (hold && !still ? " exit" : "");
    root.innerHTML =
      '<div class="intro-mottos" aria-hidden="true">' +
      "<p><span>Semper</span> Verus</p><p><span>Semper</span> Fidus</p><p><span>Semper</span> Discens</p>" +
      '</div><canvas class="intro-ecg" aria-hidden="true"></canvas>' +
      '<button class="intro-skip" type="button">' + (hold ? "Close" : "Skip") + "</button>";
    document.body.appendChild(root);

    var canvas = root.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var lines = root.querySelectorAll(".intro-mottos p");
    var red = getComputedStyle(root).getPropertyValue("--intro-red").trim() || "#d7263d";
    var W = 0, H = 0;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener("resize", size);

    // One PQRST complex as a sum of Gaussian bumps, centred at c with width w (pixels)
    function g(x, c, s) { var d = (x - c) / s; return Math.exp(-d * d); }
    function beat(x, c, w) {
      return 0.10 * g(x, c - 0.30 * w, 0.05 * w)    // P wave
           - 0.10 * g(x, c - 0.045 * w, 0.014 * w)  // Q
           + 1.00 * g(x, c, 0.016 * w)              // R spike
           - 0.30 * g(x, c + 0.045 * w, 0.016 * w)  // S
           + 0.22 * g(x, c + 0.30 * w, 0.07 * w);   // T wave
    }
    function trace(x) {
      var w = Math.max(110, Math.min(W * 0.24, 300));
      return beat(x, W * 0.17, w) + beat(x, W * 0.5, w) + beat(x, W * 0.83, w);
    }

    // Timeline in seconds: the trace crosses the screen in DRAW, mottos appear at MOTTO, then EXIT.
    // The replay then wipes the trace away from left to right over FADE before sweeping again.
    var DRAW = 3.3, MOTTO = [0.95, 1.55, 2.15], EXIT = 3.45, FADE = 1.2;
    var start = null, raf = 0, leaving = false;

    // Show the mottos only once their font has arrived (or after 2 s at most), so they never swap fonts mid-fade
    var fontReady = !(document.fonts && document.fonts.load);
    if (!fontReady) {
      document.fonts.load('500 1.5rem "Alegreya SC"').then(function () { fontReady = true; }, function () { fontReady = true; });
      setTimeout(function () { fontReady = true; }, 2000);
    }

    function frame(ts) {
      if (start === null) start = still ? ts - EXIT * 1000 : ts;
      var t = (ts - start) / 1000;
      var head = Math.min(1, t / DRAW) * W, base = H * 0.72, amp = H * 0.62;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = red; ctx.fillStyle = red;
      ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.shadowColor = red; ctx.shadowBlur = 8;
      ctx.beginPath();
      for (var x = 0; x <= head; x += 1) {
        var y = base - amp * trace(x);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      if (t < DRAW) {
        ctx.shadowBlur = 18;
        ctx.beginPath(); ctx.arc(head, base - amp * trace(head), 3.5, 0, Math.PI * 2); ctx.fill();
      }
      if (hold && !still && t > EXIT) {
        var band = W * 0.3, front = (t - EXIT) / FADE * (W + band);
        var wipe = ctx.createLinearGradient(front - band, 0, front, 0);
        wipe.addColorStop(0, "#000"); wipe.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.globalCompositeOperation = "destination-out"; ctx.shadowBlur = 0;
        ctx.fillStyle = wipe; ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
      }
      for (var i = 0; i < lines.length; i++) if (fontReady && t >= MOTTO[i]) lines[i].classList.add("on");
      if (t >= EXIT) {
        if (!hold) { leave(false); return; }
        if (still) { if (fontReady) return; }  // reduced motion: one still frame once the mottos are shown
        else if (t >= EXIT + FADE) start = ts;  // sweep the trace again, like a monitor
      }
      raf = requestAnimationFrame(frame);
    }

    function leave(skipped) {
      if (leaving) return;
      leaving = true;
      cancelAnimationFrame(raf);
      root.classList.add(skipped || still ? "skip" : "exit");
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick, true);
      setTimeout(function () {
        window.removeEventListener("resize", size);
        root.remove();
        if (done) done();
      }, still ? 0 : skipped ? 260 : 650);
    }
    function onKey(e) { if (!e.repeat) leave(false); }
    function onClick(e) { e.preventDefault(); e.stopPropagation(); leave(false); }
    // Only the Skip button skips, so a stray click or key press cannot cut the intro short
    // The replay closes on any click or key, but listens only after the press that opened it has finished
    if (hold) {
      root.offsetWidth;  // commit the raised curtain so it animates down
      root.classList.remove("exit");
      root.querySelector(".intro-skip").focus({ preventScroll: true });
      setTimeout(function () {
        if (leaving) return;
        document.addEventListener("keydown", onKey);
        document.addEventListener("click", onClick, true);
      }, 0);
    } else {
      root.querySelector(".intro-skip").addEventListener("click", function () { leave(true); });
    }
    raf = requestAnimationFrame(frame);
  }
  window.playIntro = playIntro;
})();

// Play on the first page of each visit. The header script marks <html> with "intro-pending"
// (unless the visitor has seen it this session or asked for reduced motion), which also
// covers the page until the overlay is in place.
(function () {
  var html = document.documentElement;
  if (!html.classList.contains("intro-pending")) return;
  try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}
  html.classList.add("intro-playing");
  window.playIntro(function () { html.classList.remove("intro-playing"); });
  html.classList.remove("intro-pending");
})();

// The profile picture replays the intro
(function () {
  var btn = document.querySelector(".avatar-btn");
  if (!btn) return;
  var html = document.documentElement;
  btn.addEventListener("click", function () {
    if (html.classList.contains("intro-playing")) return;
    html.classList.add("intro-playing");
    window.playIntro(function () {
      html.classList.remove("intro-playing");
      btn.focus({ preventScroll: true });
    }, true);
  });
})();

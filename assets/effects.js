// Soft glow that follows the pointer, and small capillary-wave ripples on click or tap.
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var glow = document.createElement("div");
  glow.className = "fx-glow";
  document.body.appendChild(glow);

  var x = 0, y = 0, frame = 0, hideTimer = 0;
  function place() {
    frame = 0;
    glow.style.transform = "translate(" + x + "px," + y + "px)";
  }
  function show(px, py) {
    x = px; y = py;
    glow.classList.add("on");
    if (!frame) frame = requestAnimationFrame(place);
  }
  function hideSoon(ms) {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { glow.classList.remove("on"); }, ms);
  }

  // Mouse: glow only while the cursor moves, fade out shortly after it stops.
  // pointermove with pointerType "mouse" ignores the fake mouse events phones fire after a tap.
  document.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    show(e.clientX, e.clientY);
    hideSoon(250);
  });
  document.documentElement.addEventListener("mouseleave", function () { hideSoon(0); });

  // Touch: follow the finger while touching or scrolling, then fade out
  document.addEventListener("touchstart", function (e) {
    var t = e.touches[0]; show(t.clientX, t.clientY); clearTimeout(hideTimer);
  }, { passive: true });
  document.addEventListener("touchmove", function (e) {
    var t = e.touches[0]; show(t.clientX, t.clientY);
  }, { passive: true });
  document.addEventListener("touchend", function () { hideSoon(150); }, { passive: true });
  document.addEventListener("touchcancel", function () { hideSoon(0); }, { passive: true });

  // Ripple: three thin rings spreading out and fading, like a drop on water
  document.addEventListener("pointerdown", function (e) {
    if (e.button !== 0) return;
    var r = document.createElement("div");
    r.className = "fx-ripple";
    r.style.left = e.clientX + "px";
    r.style.top = e.clientY + "px";
    r.innerHTML = "<span></span><span></span><span></span>";
    document.body.appendChild(r);
    setTimeout(function () { r.remove(); }, 1100);
  });
})();

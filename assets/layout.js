// Home page layout: the header appears once the name has scrolled out of view,
// and each section fades in as it scrolls into view.
(function () {
  var html = document.documentElement;
  var hero = document.querySelector(".hero h1");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      html.classList.toggle("past-hero", !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe(hero);
  } else {
    html.classList.add("past-hero");
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  var sections = document.querySelectorAll("main section.level2");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  sections.forEach(function (s) { s.classList.add("reveal"); io.observe(s); });
})();

// Desktop snapping: when a scroll comes to rest close to the start of the hero, Projects, About or Contact,
// glide the rest of the way, in the direction the visitor was already scrolling (never back against them).
// Long sections scroll freely; off on narrow screens and with reduced motion.
(function () {
  var stops = document.querySelectorAll("body.home .hero, body.home #projects, body.home .about-wrap, body.home section.contact-footer");
  if (!stops.length) return;
  var REACH = 0.12;  // how close counts, as a share of the screen height (0.12 = 12%)
  var wide = window.matchMedia("(min-width: 992px)");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)");
  var timer = 0, busy = false, lastY = window.scrollY, dir = 0;
  function settle() {
    if (busy || !wide.matches || still.matches) return;
    var reach = window.innerHeight * REACH;
    for (var i = 0; i < stops.length; i++) {
      // where the browser would put this stop: below the header (its scroll margin), or the page top for the hero
      var css = getComputedStyle(stops[i]);
      var margin = (parseFloat(css.scrollMarginTop) || 0) * (parseFloat(css.zoom) || 1);  // sections are zoomed 1.2 on desktop
      var gap = stops[i].getBoundingClientRect().top - margin;
      if (Math.abs(gap) > 1 && Math.abs(gap) < reach && gap * dir > 0) {
        stops[i].scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
  }
  // Any wheel, touch or key press pauses snapping, so it never fights the visitor
  ["wheel", "touchstart", "keydown"].forEach(function (t) {
    window.addEventListener(t, function () { busy = true; clearTimeout(timer); timer = setTimeout(function () { busy = false; settle(); }, 220); }, { passive: true });
  });
  window.addEventListener("scroll", function () {
    if (window.scrollY !== lastY) { dir = window.scrollY > lastY ? 1 : -1; lastY = window.scrollY; }
    if (busy) return;
    clearTimeout(timer);
    timer = setTimeout(settle, 220);
  }, { passive: true });
})();

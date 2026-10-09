// Home page layout: the header appears once the pitch has scrolled out of view,
// and each section fades in as it scrolls into view.
(function () {
  var html = document.documentElement;
  var hero = document.querySelector(".hero");
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

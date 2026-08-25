(function () {
  "use strict";

  /* ---------- Nav scroll state ---------- */
  var nav = document.getElementById("siteNav");
  var scrollThreshold = 40;

  function onScroll() {
    if (window.scrollY > scrollThreshold) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav panel ---------- */
  var navToggle = document.getElementById("navToggle");
  var navPanel = document.getElementById("navPanel");

  function closePanel() {
    navPanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
  function togglePanel() {
    var open = navPanel.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  navToggle.addEventListener("click", togglePanel);
  navPanel.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closePanel);
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePanel();
  });

  /* ---------- Carousel ---------- */
  var track = document.getElementById("carouselTrack");
  var cards = Array.prototype.slice.call(track.children);
  var viewport = track.parentElement;
  var dotsWrap = document.getElementById("carouselDots");
  var prevArrow = document.getElementById("prevArrow");
  var nextArrow = document.getElementById("nextArrow");
  var activeIndex = 0;
  var projectsInView = false;

  cards.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Go to project " + (i + 1));
    dot.addEventListener("click", function () {
      activeIndex = i;
      update();
    });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function update() {
    cards.forEach(function (card, i) {
      card.classList.toggle("is-active", i === activeIndex);
      card.classList.toggle("is-adjacent", Math.abs(i - activeIndex) === 1);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === activeIndex);
      dot.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
    });
    center();
  }

  function center() {
    var card = cards[activeIndex];
    var offset = card.offsetLeft + card.offsetWidth / 2 - viewport.offsetWidth / 2;
    track.style.transform = "translateX(" + -offset + "px)";
  }

  function go(delta) {
    activeIndex = (activeIndex + delta + cards.length) % cards.length;
    update();
  }

  prevArrow.addEventListener("click", function () { go(-1); });
  nextArrow.addEventListener("click", function () { go(1); });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(center, 100);
  });

  window.addEventListener("keydown", function (e) {
    if (!projectsInView) return;
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });

  var touchStartX = null;
  viewport.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  viewport.addEventListener("touchend", function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStartX = null;
  });

  update();

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    ".section-head, .about__grid, .contact__title, .contact__sub, .contact__email, .contact__socials"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealTargets.forEach(function (el) { io.observe(el); });

  var projectsSection = document.getElementById("projects");
  var projectsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        projectsInView = entry.isIntersecting;
      });
    },
    { threshold: 0.3 }
  );
  projectsObserver.observe(projectsSection);
})();

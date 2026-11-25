/* ==========================================================================
   Vita Pure IV: homepage revamp mockup
   Vanilla JS, no dependencies. One init function per behavior; each one
   matches a section comment in index.html.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ------------------------------------------------------------------
     Header: shadow once scrolled. Keeps --header-h current so in-page
     scrolling and the sticky photo clear the sticky header.
     ------------------------------------------------------------------ */
  function initStickyHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    function setHeight() {
      document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
    }
    function onScroll() {
      var scrolled = window.scrollY > 40;
      if (scrolled !== header.classList.contains("is-scrolled")) {
        header.classList.toggle("is-scrolled", scrolled);
        setHeight();
      }
    }
    setHeight();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", setHeight);
  }

  /* ------------------------------------------------------------------
     Navigation: Wellness / Face / Body dropdowns plus the mobile menu.
     Dropdowns open on hover (CSS) and on click or keyboard (here).
     Esc or a click outside closes them.
     ------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.querySelector(".navbar__toggle");
    var nav = document.getElementById("site-nav");
    var subToggles = document.querySelectorAll(".site-nav__sub-toggle");

    function closeSubs(except) {
      subToggles.forEach(function (btn) {
        if (btn !== except) btn.setAttribute("aria-expanded", "false");
      });
    }

    subToggles.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        closeSubs(btn);
        btn.setAttribute("aria-expanded", String(!open));
      });
    });

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        nav.classList.toggle("is-open", !open);
        if (open) closeSubs();
      });
    }

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".has-sub")) closeSubs();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var openBtn = document.querySelector('.site-nav__sub-toggle[aria-expanded="true"]');
      closeSubs();
      if (openBtn) openBtn.focus();
      else if (toggle && nav && nav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        toggle.focus();
      }
    });

    // On the mobile menu, close it after following an in-page link
    if (nav) {
      nav.addEventListener("click", function (e) {
        var a = e.target.closest('a[href^="#"]');
        if (a && toggle) {
          toggle.setAttribute("aria-expanded", "false");
          nav.classList.remove("is-open");
        }
      });
    }
  }

  /* ------------------------------------------------------------------
     Smooth scroll for in-page links ("Find your treatment", concern rows).
     CSS scroll-behavior already handles the motion; this also moves
     focus to the target for keyboard and screen-reader users.
     ------------------------------------------------------------------ */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href").slice(1);
      var target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      history.replaceState(null, "", "#" + id);
    });
  }

  /* ------------------------------------------------------------------
     [REVAMP:ADDED] "What you're looking to improve"
     - Group buttons (All / Wellness / Face / Body) dim the concerns that don't match.
     - Hovering or focusing a concern swaps the photo and highlights its tile.
     - Clicking a concern scrolls to its tile (via the smooth-scroll handler)
       and briefly highlights it, so the list of treatments is visible.
     ------------------------------------------------------------------ */
  function initConcerns() {
    var concerns = Array.prototype.slice.call(document.querySelectorAll(".concern"));
    var filterBtns = document.querySelectorAll(".filter__btn");
    var img = document.querySelector(".improve__img");
    var tiles = document.querySelectorAll(".tile");
    if (!concerns.length) return;

    // Preload the swap images so the crossfade doesn't flash
    concerns.forEach(function (c) {
      var pre = new Image();
      pre.src = c.dataset.img;
    });

    var swapTimer;
    function showImage(c) {
      if (!img || img.getAttribute("src") === c.dataset.img) return;
      clearTimeout(swapTimer);
      img.classList.add("is-swapping");
      swapTimer = setTimeout(function () {
        img.src = c.dataset.img;
        img.style.objectPosition = c.dataset.pos || "50% 50%";
        img.classList.remove("is-swapping");
      }, reduceMotion.matches ? 0 : 180);
    }

    function setActive(c) {
      concerns.forEach(function (x) { x.classList.toggle("is-active", x === c); });
      showImage(c);
    }

    function highlightTile(group, ms) {
      tiles.forEach(function (t) { t.classList.toggle("is-highlight", t.dataset.group === group); });
      if (ms) {
        setTimeout(function () {
          tiles.forEach(function (t) { t.classList.remove("is-highlight"); });
        }, ms);
      }
    }

    concerns.forEach(function (c) {
      var link = c.querySelector(".concern__link");
      c.addEventListener("mouseenter", function () { setActive(c); });
      c.addEventListener("focusin", function () { setActive(c); });
      if (link) {
        link.addEventListener("click", function () {
          // Keep the tile open long enough to read after the scroll lands
          highlightTile(c.dataset.group, 3200);
        });
      }
    });

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.dataset.filter;
        filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        var first = null;
        concerns.forEach(function (c) {
          var match = f === "all" || c.dataset.group === f;
          c.classList.toggle("is-dimmed", !match);
          if (match && !first) first = c;
        });
        if (first) setActive(first);
      });
    });

    setActive(concerns[0]);
  }

  /* ------------------------------------------------------------------
     [REVAMP:CHANGED] Body map (index.html only)
     Hovering, focusing, or tapping a dot shows that area's panel.
     The selection stays when the pointer leaves, so the panel doesn't flicker.
     "See all … treatments" scrolls to the matching tile (smooth-scroll handler)
     and briefly highlights it.
     ------------------------------------------------------------------ */
  function initBodyMap() {
    var spots = document.querySelectorAll(".hotspot");
    if (!spots.length) return;
    var panels = document.querySelectorAll(".bodymap__panel");
    var tiles = document.querySelectorAll(".tile");

    function show(area) {
      spots.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.area === area)); });
      panels.forEach(function (p) { p.hidden = p.id !== "area-" + area; });
    }

    spots.forEach(function (b) {
      b.addEventListener("mouseenter", function () { show(b.dataset.area); });
      b.addEventListener("focus", function () { show(b.dataset.area); });
      b.addEventListener("click", function () {
        show(b.dataset.area);
        // On narrow screens the panel sits under the photo, so bring it into view after a tap
        if (window.innerWidth <= 860) {
          var panel = document.getElementById("area-" + b.dataset.area);
          if (panel) panel.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "nearest" });
        }
      });
    });

    document.querySelectorAll(".bodymap__more").forEach(function (a) {
      a.addEventListener("click", function () {
        var group = a.closest(".bodymap__panel").dataset.group;
        tiles.forEach(function (t) { t.classList.toggle("is-highlight", t.dataset.group === group); });
        setTimeout(function () {
          tiles.forEach(function (t) { t.classList.remove("is-highlight"); });
        }, 3200);
      });
    });
  }

  /* ------------------------------------------------------------------
     [REVAMP:CHANGED] Google reviews: two rows moving in opposite directions.
     Each track is filled until one copy is wider than the viewport, then
     the whole set is cloned once. The CSS animation moves -50%, so the loop
     is seamless. Clones are hidden from assistive tech. With reduced motion
     turned on, nothing is cloned and the rows are simply scrollable.
     ------------------------------------------------------------------ */
  function initMarquee() {
    var section = document.querySelector(".reviews");
    var marquees = document.querySelectorAll(".marquee");
    var toggle = document.querySelector(".marquee-toggle");
    if (!section || !marquees.length) return;

    function cloneInto(track, nodes) {
      nodes.forEach(function (n) {
        var copy = n.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        copy.setAttribute("data-clone", "");
        copy.querySelectorAll("a, button").forEach(function (el) { el.setAttribute("tabindex", "-1"); });
        track.appendChild(copy);
      });
    }

    function build() {
      marquees.forEach(function (m) {
        var track = m.querySelector(".marquee__track");
        track.querySelectorAll("[data-clone]").forEach(function (n) { n.remove(); });
        m.classList.remove("is-ready");
        if (reduceMotion.matches) return;

        var originals = Array.prototype.slice.call(track.children);
        // 1) Repeat the set until one "half" is wider than the viewport
        var guard = 0;
        while (track.scrollWidth < window.innerWidth * 1.1 && guard++ < 10) cloneInto(track, originals);
        // 2) Duplicate that whole half so translateX(-50%) loops cleanly
        var half = Array.prototype.slice.call(track.children);
        cloneInto(track, half);

        // About 40px per second, whatever the content width
        var seconds = Math.max(30, Math.round(track.scrollWidth / 2 / 40));
        m.style.setProperty("--duration", seconds + "s");
        m.classList.add("is-ready");
      });
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        var paused = section.classList.toggle("is-paused");
        toggle.setAttribute("aria-pressed", String(paused));
        toggle.textContent = paused ? "Play reviews" : "Pause reviews";
      });
    }

    // Rebuild only when the width changes (mobile URL bars fire height-only resizes)
    var resizeTimer;
    var lastWidth = window.innerWidth;
    window.addEventListener("resize", function () {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 250);
    });
    if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", build);

    // Measure after fonts load so the card widths are final
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
    else build();
  }

  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  function init() {
    initStickyHeader();
    initNav();
    initSmoothScroll();
    initConcerns();
    initBodyMap();
    initMarquee();
    initYear();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

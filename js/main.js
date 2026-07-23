(function () {
  "use strict";

  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function getStoredTheme() {
    try {
      return window.localStorage.getItem("anthropos-theme");
    } catch (e) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      window.localStorage.setItem("anthropos-theme", theme);
    } catch (e) {  }
  }

  var stored = getStoredTheme();
  var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  var initialTheme = stored || (prefersLight ? "light" : "dark");
  applyTheme(initialTheme);

  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) root.classList.add("reduced-motion");
  window.ANTHROPOS_REDUCED_MOTION = prefersReducedMotion;

  root.classList.remove("no-js");

  requestAnimationFrame(function () {
    root.classList.remove("theme-resolving");
  });

  document.addEventListener("DOMContentLoaded", function () {

    var themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      var isLight = root.getAttribute("data-theme") === "light";
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");

      themeToggle.addEventListener("click", function () {
        var nowLight = root.getAttribute("data-theme") !== "light";
        applyTheme(nowLight ? "light" : "dark");
        storeTheme(nowLight ? "light" : "dark");
        themeToggle.setAttribute("aria-pressed", String(nowLight));
        themeToggle.setAttribute("aria-label", nowLight ? "Switch to dark theme" : "Switch to light theme");
      });
    }

    var nav = document.getElementById("nav");
    if (nav) {
      var SCROLL_THRESHOLD = 24;
      var onScroll = function () {
        if (window.scrollY > SCROLL_THRESHOLD) {
          nav.classList.add("is-scrolled");
        } else {
          nav.classList.remove("is-scrolled");
        }
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    var burger = document.getElementById("navBurger");
    var mobilePanel = document.getElementById("mobilePanel");
    if (burger && mobilePanel) {
      var closeMenu = function () {
        burger.classList.remove("is-open");
        mobilePanel.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Open menu");
        document.body.style.overflow = "";
      };
      var openMenu = function () {
        burger.classList.add("is-open");
        mobilePanel.classList.add("is-open");
        burger.setAttribute("aria-expanded", "true");
        burger.setAttribute("aria-label", "Close menu");
        document.body.style.overflow = "hidden";
      };
      burger.addEventListener("click", function () {
        var isOpen = mobilePanel.classList.contains("is-open");
        if (isOpen) { closeMenu(); } else { openMenu(); }
      });
      mobilePanel.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });
    }

    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    var cursorDot = document.getElementById("cursorDot");
    var hasFinePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (cursorDot && hasFinePointer && !prefersReducedMotion) {
      var cx = 0, cy = 0, dx = 0, dy = 0;
      window.addEventListener("mousemove", function (e) {
        cx = e.clientX; cy = e.clientY;
        cursorDot.classList.remove("is-hidden");
      });
      (function raf() {
        dx += (cx - dx) * 0.2;
        dy += (cy - dy) * 0.2;
        cursorDot.style.transform = "translate(" + dx + "px," + dy + "px) translate(-50%,-50%)";
        requestAnimationFrame(raf);
      })();
      document.addEventListener("mouseleave", function () { cursorDot.classList.add("is-hidden"); });

      var hoverTargets = "a, button, .card, .work-card, input, textarea, select";
      document.addEventListener("mouseover", function (e) {
        if (e.target.closest && e.target.closest(hoverTargets)) {
          cursorDot.classList.add("is-hover");
        }
      });
      document.addEventListener("mouseout", function (e) {
        if (e.target.closest && e.target.closest(hoverTargets)) {
          cursorDot.classList.remove("is-hover");
        }
      });
    } else if (cursorDot) {
      cursorDot.style.display = "none";
    }

    if (hasFinePointer && !prefersReducedMotion) {
      document.querySelectorAll(".magnetic").forEach(function (el) {
        var strength = 16;
        el.addEventListener("mousemove", function (e) {
          var rect = el.getBoundingClientRect();
          var relX = e.clientX - rect.left - rect.width / 2;
          var relY = e.clientY - rect.top - rect.height / 2;
          el.style.transform = "translate(" + (relX / rect.width) * strength + "px," + (relY / rect.height) * strength + "px)";
        });
        el.addEventListener("mouseleave", function () {
          el.style.transform = "translate(0,0)";
        });
      });
    }

    var accordion = document.getElementById("accordion");
    if (accordion) {
      var items = accordion.querySelectorAll(".accordion__item");
      items.forEach(function (item) {
        var trigger = item.querySelector(".accordion__trigger");
        var panel = item.querySelector(".accordion__panel");
        var inner = item.querySelector(".accordion__panel-inner");

        trigger.addEventListener("click", function () {
          var isOpen = item.classList.contains("is-open");

          items.forEach(function (other) {
            if (other !== item) {
              other.classList.remove("is-open");
              other.querySelector(".accordion__trigger").setAttribute("aria-expanded", "false");
              if (window.gsap) {
                gsap.to(other.querySelector(".accordion__panel"), { height: 0, duration: 0.35, ease: "power2.inOut" });
              } else {
                other.querySelector(".accordion__panel").style.height = "0px";
              }
            }
          });

          if (isOpen) {
            item.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
            if (window.gsap) {
              gsap.to(panel, { height: 0, duration: 0.35, ease: "power2.inOut" });
            } else {
              panel.style.height = "0px";
            }
          } else {
            item.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");
            var target = inner.getBoundingClientRect().height;
            if (window.gsap) {
              gsap.to(panel, { height: target, duration: 0.4, ease: "power2.inOut" });
            } else {
              panel.style.height = target + "px";
            }
          }
        });
      });

      var accordionResizeTimer;
      window.addEventListener("resize", function () {
        clearTimeout(accordionResizeTimer);
        accordionResizeTimer = setTimeout(function () {
          items.forEach(function (item) {
            if (!item.classList.contains("is-open")) return;
            var panel = item.querySelector(".accordion__panel");
            var inner = item.querySelector(".accordion__panel-inner");
            var target = inner.getBoundingClientRect().height;
            if (window.gsap) {
              gsap.set(panel, { height: target });
            } else {
              panel.style.height = target + "px";
            }
          });
        }, 200);
      });
    }

  });
})();

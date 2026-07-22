/* ==========================================================================
   ANTHROPOS — ANIMATIONS
   All GSAP/ScrollTrigger work lives here. Degrades gracefully: if the CDN
   didn't load, or the user prefers reduced motion, content is simply shown
   with no motion rather than staying hidden.
   ========================================================================== */
(function () {
  "use strict";

  var reduced = !!window.ANTHROPOS_REDUCED_MOTION;

  function showAllStatically() {
    document.querySelectorAll(".js-reveal, .js-reveal-up, .js-reveal-scale").forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    document.querySelectorAll(".stat__num").forEach(function (el) {
      var to = el.getAttribute("data-count-to");
      var suffix = el.getAttribute("data-suffix") || "";
      if (to) el.textContent = to + suffix;
    });
    var fill = document.getElementById("pipelineFill");
    if (fill) fill.style.width = "100%";
  }

  if (typeof window.gsap === "undefined" || reduced) {
    document.addEventListener("DOMContentLoaded", showAllStatically);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener("DOMContentLoaded", function () {

    /* ---- 1. Hero load sequence -------------------------------------------- */
    var heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl
      .from("#heroCircleBg", { scale: 0.7, opacity: 0, duration: 0.9, transformOrigin: "50% 50%" })
      .from("#heroCardBig", { y: 40, opacity: 0, duration: 0.7 }, "-=0.5")
      .from("#heroBars rect", { scaleY: 0, transformOrigin: "50% 100%", stagger: 0.08, duration: 0.5 }, "-=0.3")
      .from("#heroCardBigLabel", { opacity: 0, duration: 0.4 }, "-=0.3")
      .from("#heroCoralCircle", { scale: 0, opacity: 0, duration: 0.6, transformOrigin: "50% 50%" }, "-=0.6")
      .from("#heroSmallCard", { x: 40, opacity: 0, rotation: -6, duration: 0.7, transformOrigin: "50% 50%" }, "-=0.5")
      .from("#heroSmallCardBadge", { scale: 0, opacity: 0, duration: 0.5, transformOrigin: "50% 50%" }, "-=0.3")
      .from("#heroSmallCardMark", { opacity: 0, y: 8, duration: 0.4 }, "-=0.2")
      .from(["#heroOrbitCard", "#heroOrbitSmall"], { opacity: 0, scale: 0.5, stagger: 0.1, duration: 0.5, transformOrigin: "50% 50%" }, "-=0.4")
      .from("#heroDashed path", { opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.6")
      .from(".hero__eyebrow", { opacity: 0, y: 12, duration: 0.5 }, "-=0.9")
      .from(".hero h1", { opacity: 0, y: 20, duration: 0.6 }, "-=0.7")
      .from(".hero__sub", { opacity: 0, y: 16, duration: 0.5 }, "-=0.5")
      .from(".hero__ctas", { opacity: 0, y: 16, duration: 0.5 }, "-=0.4")
      .from(".hero__proof", { opacity: 0, y: 16, duration: 0.5 }, "-=0.3");

    // Ambient float once the load sequence settles
    gsap.to("#heroCircleBg", { y: -16, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to("#heroCoralCircle", { y: 10, duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.3 });
    gsap.to("#heroSmallCardBadge", { scale: 1.08, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "50% 50%" });
    gsap.to("#heroOrbitSmall", { scale: 1.3, opacity: 0.6, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "50% 50%" });

    /* ---- 2. Hero mouse parallax -------------------------------------------- */
    var heroStage = document.querySelector(".hero__stage");
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (heroStage && fine) {
      var layers = [
        { sel: "#heroCircleBg", depth: 10 },
        { sel: "#heroCardBig", depth: 16 },
        { sel: "#heroCoralCircle", depth: 26 },
        { sel: "#heroSmallCard", depth: 20 },
        { sel: "#heroOrbitCard, #heroOrbitSmall", depth: 34 }
      ];
      heroStage.addEventListener("mousemove", function (e) {
        var rect = heroStage.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        layers.forEach(function (l) {
          gsap.to(l.sel, { x: px * l.depth, y: py * l.depth, duration: 0.6, ease: "power2.out", overwrite: "auto" });
        });
      });
      heroStage.addEventListener("mouseleave", function () {
        layers.forEach(function (l) {
          gsap.to(l.sel, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
        });
      });
    }

    /* ---- 3. Generic scroll reveals ----------------------------------------- */
    gsap.utils.toArray(".js-reveal-up").forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
        delay: (i % 3) * 0.06
      });
    });
    gsap.utils.toArray(".js-reveal").forEach(function (el) {
      gsap.to(el, {
        opacity: 1, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%" }
      });
    });

    /* ---- 4. Services cards: individual stagger + subtle scale-in ---------- */
    gsap.utils.toArray(".services__grid .card").forEach(function (card, i) {
      gsap.from(card, {
        opacity: 0, y: 32, scale: 0.97,
        duration: 0.6, ease: "power3.out",
        delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: card, start: "top 90%" }
      });
    });

    /* ---- 5. Animated stat counters ----------------------------------------- */
    gsap.utils.toArray(".stat__num").forEach(function (el) {
      var to = parseFloat(el.getAttribute("data-count-to"));
      var suffix = el.getAttribute("data-suffix") || "";
      if (isNaN(to)) return;
      var counter = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: function () {
          gsap.to(counter, {
            val: to, duration: 1.6, ease: "power2.out",
            onUpdate: function () { el.textContent = Math.round(counter.val) + suffix; }
          });
        }
      });
    });

    /* ---- 6. Process pipeline: fill bar + step activation ------------------- */
    var pipelineSection = document.querySelector(".pipeline");
    var pipelineFill = document.getElementById("pipelineFill");
    var steps = gsap.utils.toArray(".pipeline__step");
    if (pipelineSection && pipelineFill && steps.length) {
      ScrollTrigger.create({
        trigger: pipelineSection,
        start: "top 70%",
        end: "bottom 60%",
        scrub: 0.6,
        onUpdate: function (self) {
          var pct = self.progress * 100;
          pipelineFill.style.width = pct + "%";
          var activeIndex = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          steps.forEach(function (step, i) {
            step.classList.toggle("is-active", i <= activeIndex && self.progress > 0.02);
          });
        }
      });
    }

    /* ---- 7. Portfolio cards reveal ------------------------------------------ */
    gsap.utils.toArray(".work-card").forEach(function (card, i) {
      gsap.from(card, {
        opacity: 0, y: 36,
        duration: 0.7, ease: "power3.out",
        delay: (i % 3) * 0.07,
        scrollTrigger: { trigger: card, start: "top 90%" }
      });
    });

    /* ---- 8. Testimonials marquee -------------------------------------------- */
    var track = document.getElementById("testimonialTrack");
    if (track) {
      var loopWidth = track.scrollWidth / 2;
      var marqueeTween = gsap.to(track, {
        x: -loopWidth,
        duration: 32,
        ease: "none",
        repeat: -1
      });
      track.addEventListener("mouseenter", function () { marqueeTween.timeScale(0.15); });
      track.addEventListener("mouseleave", function () { marqueeTween.timeScale(1); });
    }

  });
})();

/* ==========================================================================
   ANTHROPOS — CONTACT FORM
   Posts to Formspree (no backend required). Replace FORMSPREE_ENDPOINT
   below with your own form endpoint from https://formspree.io before
   deploying — the placeholder below will not deliver submissions.
   ========================================================================== */
(function () {
  "use strict";

  // TODO: replace with your real Formspree endpoint, e.g. https://formspree.io/f/abcdwxyz
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contactForm");
    var status = document.getElementById("formStatus");
    var modal = document.getElementById("confirmModal");
    var modalClose = document.getElementById("confirmClose");

    if (!form) return;

    function setStatus(message, kind) {
      if (!status) return;
      status.textContent = message;
      status.className = "form-status is-visible" + (kind ? " form-status--" + kind : "");
    }

    function openModal() {
      if (!modal) return;
      modal.classList.add("is-visible");
      document.body.style.overflow = "hidden";
      modalClose && modalClose.focus();
    }
    function closeModal() {
      if (!modal) return;
      modal.classList.remove("is-visible");
      document.body.style.overflow = "";
    }
    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("is-visible")) closeModal();
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var label = submitBtn ? submitBtn.querySelector(".btn-label") : null;
      var originalLabel = label ? label.textContent : null;
      if (submitBtn) submitBtn.disabled = true;
      if (label) label.textContent = "Sending…";
      setStatus("", null);

      var data = new FormData(form);

      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            openModal();
            setStatus("Thanks — we'll be in touch within one business day.", "success");
          } else {
            return response.json().then(function (body) {
              var msg = (body && body.errors && body.errors.length)
                ? body.errors.map(function (err) { return err.message; }).join(", ")
                : "Something went wrong. Please email hello@anthropos.studio directly.";
              throw new Error(msg);
            });
          }
        })
        .catch(function (err) {
          setStatus(err.message || "Something went wrong. Please email hello@anthropos.studio directly.", "error");
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
          if (label && originalLabel) label.textContent = originalLabel;
        });
    });
  });
})();

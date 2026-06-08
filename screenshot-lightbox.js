(function () {
  var triggerSelector = ".screenshot img, .project-card-media img";
  var previousFocus = null;
  var lightbox = null;
  var lightboxImage = null;
  var lightboxCaption = null;
  var closeButton = null;

  function getCaption(trigger) {
    var card = trigger.closest(".screenshot, .project-card");
    if (!card) {
      return trigger.alt || "Screenshot";
    }

    var heading = card.querySelector("h3");
    var copy = card.querySelector(".screenshot-caption p, p");
    var parts = [];

    if (heading && heading.textContent.trim()) {
      parts.push(heading.textContent.trim());
    }

    if (copy && copy.textContent.trim()) {
      parts.push(copy.textContent.trim());
    }

    return parts.length ? parts.join(": ") : trigger.alt || "Screenshot";
  }

  function createLightbox() {
    lightbox = document.createElement("div");
    lightbox.className = "screenshot-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Large screenshot preview");
    lightbox.hidden = true;

    closeButton = document.createElement("button");
    closeButton.className = "screenshot-lightbox-close";
    closeButton.type = "button";
    closeButton.innerHTML = '<span aria-hidden="true">&larr;</span><span>Back</span>';
    closeButton.addEventListener("click", closeLightbox);

    var frame = document.createElement("figure");
    frame.className = "screenshot-lightbox-frame";

    lightboxImage = document.createElement("img");
    lightboxImage.className = "screenshot-lightbox-image";
    lightboxImage.alt = "";
    lightboxImage.addEventListener("click", closeLightbox);

    lightboxCaption = document.createElement("figcaption");
    lightboxCaption.className = "screenshot-lightbox-caption";

    frame.appendChild(lightboxImage);
    frame.appendChild(lightboxCaption);
    lightbox.appendChild(closeButton);
    lightbox.appendChild(frame);

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox || event.target === frame) {
        closeLightbox();
      }
    });

    document.body.appendChild(lightbox);
  }

  function openLightbox(trigger) {
    if (!lightbox) {
      createLightbox();
    }

    previousFocus = document.activeElement;
    lightboxImage.src = trigger.currentSrc || trigger.src;
    lightboxImage.alt = trigger.alt || "";
    lightboxCaption.textContent = getCaption(trigger);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) {
      return;
    }

    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
    document.body.classList.remove("lightbox-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  function prepareTrigger(trigger) {
    trigger.classList.add("lightbox-trigger");
    trigger.setAttribute("role", "button");
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("aria-label", "Open larger screenshot: " + (trigger.alt || "Screenshot"));
    trigger.title = "Open larger screenshot";

    trigger.addEventListener("click", function () {
      openLightbox(trigger);
    });

    trigger.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(trigger);
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });

  function initLightboxTriggers() {
    Array.prototype.forEach.call(document.querySelectorAll(triggerSelector), prepareTrigger);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLightboxTriggers);
  } else {
    initLightboxTriggers();
  }
}());

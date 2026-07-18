const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("[data-nav-links]");
const siteHeader = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (navToggle && navLinks) {
  const setNavigationOpen = (isOpen) => {
    navLinks.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Menu sluiten" : "Menu openen");
    document.body.classList.toggle("nav-open", isOpen);
  };

  navToggle.addEventListener("click", () => {
    setNavigationOpen(!navLinks.classList.contains("is-open"));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setNavigationOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
      setNavigationOpen(false);
      navToggle.focus();
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (!siteHeader?.contains(event.target) && navLinks.classList.contains("is-open")) {
      setNavigationOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 940) setNavigationOpen(false);
  });
}

const updateHeader = () => {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 18);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

document.getElementById("year").textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll(".reveal");

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -5% 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta)')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && observedSections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      sectionLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${visibleEntry.target.id}`;

        if (isCurrent) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.2, 0.5] }
  );

  observedSections.forEach((section) => navObserver.observe(section));
}

if (hero && finePointer.matches && !reducedMotion.matches) {
  let frameId = 0;
  let rippleTimer = 0;

  hero.addEventListener("pointerenter", () => {
    hero.classList.add("cursor-active");
  });

  hero.addEventListener("pointerleave", () => {
    hero.classList.remove("cursor-active", "is-rippling");
  });

  hero.addEventListener("pointermove", (event) => {
    if (frameId) return;

    frameId = window.requestAnimationFrame(() => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;

      hero.style.setProperty("--cursor-x", `${x.toFixed(2)}%`);
      hero.style.setProperty("--cursor-y", `${y.toFixed(2)}%`);
      frameId = 0;
    });

    const now = performance.now();

    if (now - rippleTimer > 1250) {
      rippleTimer = now;
      hero.classList.remove("is-rippling");
      window.requestAnimationFrame(() => hero.classList.add("is-rippling"));
    }
  });
}

const progressBar = document.querySelector(".scroll-progress span");
const backToTop = document.querySelector("[data-back-to-top]");

const updateScrollUtilities = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? Math.min(1, window.scrollY / scrollableHeight) : 0;

  progressBar?.style.setProperty("--scroll-progress", progress.toFixed(4));
  backToTop?.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.8);
};

updateScrollUtilities();
window.addEventListener("scroll", updateScrollUtilities, { passive: true });
window.addEventListener("resize", updateScrollUtilities);

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
});

const heroCard = document.querySelector(".hero-card");

if (heroCard && finePointer.matches && !reducedMotion.matches) {
  let tiltFrame = 0;

  heroCard.addEventListener("pointerenter", () => heroCard.classList.add("is-tilting"));

  heroCard.addEventListener("pointermove", (event) => {
    if (tiltFrame) return;

    tiltFrame = window.requestAnimationFrame(() => {
      const bounds = heroCard.getBoundingClientRect();
      const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

      heroCard.style.setProperty("--tilt-x", `${(-relativeY * 2.4).toFixed(2)}deg`);
      heroCard.style.setProperty("--tilt-y", `${(relativeX * 2.4).toFixed(2)}deg`);
      tiltFrame = 0;
    });
  });

  heroCard.addEventListener("pointerleave", () => {
    heroCard.classList.remove("is-tilting");
    heroCard.style.setProperty("--tilt-x", "0deg");
    heroCard.style.setProperty("--tilt-y", "0deg");
  });
}

const contactDialog = document.getElementById("contact-dialog");
const contactOpeners = document.querySelectorAll("[data-contact-open]");
const contactCloser = document.querySelector("[data-contact-close]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

if (contactDialog && typeof contactDialog.showModal === "function") {
  contactOpeners.forEach((opener) => {
    opener.addEventListener("click", (event) => {
      event.preventDefault();
      contactDialog.showModal();
      contactDialog.querySelector("input")?.focus();
    });
  });

  contactCloser?.addEventListener("click", () => contactDialog.close());

  contactDialog.addEventListener("click", (event) => {
    const bounds = contactDialog.getBoundingClientRect();
    const clickedBackdrop =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (clickedBackdrop) contactDialog.close();
  });
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const subject = encodeURIComponent(`Kennismaking MeterWise – ${name}`);
  const body = encodeURIComponent(`${message}\n\nNaam: ${name}\nE-mail: ${email}`);

  if (formStatus) formStatus.textContent = "Je e-mailprogramma wordt geopend.";
  window.location.href = `mailto:info@meterwise.nl?subject=${subject}&body=${body}`;
});

const landingIntro = document.querySelector("[data-landing-intro]");
const landingStage = document.querySelector("[data-landing-stage]");

if (landingIntro && landingStage) {
  let landingFrame = 0;

  const updateLandingProgress = () => {
    const transitionDistance = Math.max(1, landingIntro.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / transitionDistance));

    landingStage.style.setProperty("--landing-progress", progress.toFixed(4));
    landingFrame = 0;
  };

  const requestLandingUpdate = () => {
    if (landingFrame) return;
    landingFrame = window.requestAnimationFrame(updateLandingProgress);
  };

  updateLandingProgress();
  window.addEventListener("scroll", requestLandingUpdate, { passive: true });
  window.addEventListener("resize", requestLandingUpdate);

  if (finePointer.matches && !reducedMotion.matches) {
    landingStage.addEventListener("pointermove", (event) => {
      const bounds = landingStage.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

      landingStage.style.setProperty("--landing-pointer-x", pointerX.toFixed(3));
      landingStage.style.setProperty("--landing-pointer-y", pointerY.toFixed(3));
    });

    landingStage.addEventListener("pointerleave", () => {
      landingStage.style.setProperty("--landing-pointer-x", "0");
      landingStage.style.setProperty("--landing-pointer-y", "0");
    });
  }
}

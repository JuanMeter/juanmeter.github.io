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

const brandPanel = document.querySelector("[data-brand-panel]");
const brandSwatches = document.querySelectorAll("[data-brand-swatch]");

if (finePointer.matches && !reducedMotion.matches) {
  const bindPointerSurface = (surface, options = {}) => {
    if (!surface) return;

    const maxTilt = options.maxTilt ?? 2.8;
    const prefix = options.prefix ?? "surface";
    let surfaceFrame = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;

    const renderSurface = () => {
      const relativeX = pointerX - 0.5;
      const relativeY = pointerY - 0.5;

      surface.style.setProperty(`--${prefix}-pointer-x`, `${(pointerX * 100).toFixed(2)}%`);
      surface.style.setProperty(`--${prefix}-pointer-y`, `${(pointerY * 100).toFixed(2)}%`);
      surface.style.setProperty(`--${prefix}-rotate-x`, `${(-relativeY * maxTilt).toFixed(2)}deg`);
      surface.style.setProperty(`--${prefix}-rotate-y`, `${(relativeX * maxTilt).toFixed(2)}deg`);
      surfaceFrame = 0;
    };

    surface.addEventListener("pointerenter", () => surface.classList.add("is-interacting"));

    surface.addEventListener("pointermove", (event) => {
      const bounds = surface.getBoundingClientRect();
      pointerX = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      pointerY = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));

      if (!surfaceFrame) surfaceFrame = window.requestAnimationFrame(renderSurface);
    });

    surface.addEventListener("pointerleave", () => {
      pointerX = 0.5;
      pointerY = 0.5;
      surface.classList.remove("is-interacting");
      renderSurface();
    });
  };

  bindPointerSurface(brandPanel, { prefix: "brand", maxTilt: 3.2 });
  brandSwatches.forEach((swatch) => bindPointerSurface(swatch, { prefix: "swatch", maxTilt: 7 }));
}

const landingIntro = document.querySelector("[data-landing-intro]");
const landingStage = document.querySelector("[data-landing-stage]");

if (landingIntro && landingStage) {
  const landingCopy = landingStage.querySelector(".landing-copy");
  const landingMark = landingStage.querySelector("[data-landing-mark]");
  const landingTitle = landingStage.querySelector("[data-landing-title]");
  let landingFrame = 0;
  let landingPointerX = 0;
  let landingPointerY = 0;
  let markPointerResponse = 0;

  const updateLandingPointer = () => {
    landingStage.style.setProperty("--landing-pointer-x", landingPointerX.toFixed(3));
    landingStage.style.setProperty("--landing-pointer-y", landingPointerY.toFixed(3));
    landingStage.style.setProperty("--mark-pointer-x", (landingPointerX * markPointerResponse).toFixed(3));
    landingStage.style.setProperty("--mark-pointer-y", (landingPointerY * markPointerResponse).toFixed(3));
  };

  const updateLandingGeometry = () => {
    if (!landingCopy || !landingMark) return;

    const copyBounds = landingCopy.getBoundingClientRect();
    const markBounds = landingMark.getBoundingClientRect();
    const gap = window.innerWidth <= 640 ? 10 : 18;
    const startX = copyBounds.left - markBounds.left;
    const topY = copyBounds.top - gap - markBounds.height * 0.5 - markBounds.top;
    const bottomY = copyBounds.bottom + gap - (markBounds.top + markBounds.height * 0.5);

    landingStage.style.setProperty("--mark-start-x", `${startX.toFixed(2)}px`);
    landingStage.style.setProperty("--mark-top-y", `${topY.toFixed(2)}px`);
    landingStage.style.setProperty("--mark-bottom-y", `${bottomY.toFixed(2)}px`);
  };

  const updateLandingProgress = () => {
    const transitionDistance = Math.max(1, landingIntro.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / transitionDistance));
    const assemblyRaw = Math.min(1, Math.max(0, (progress - 0.04) / 0.68));
    const assembly = assemblyRaw * assemblyRaw * (3 - 2 * assemblyRaw);
    const revealRaw = Math.min(1, Math.max(0, (progress - 0.59) / 0.15));
    const reveal = revealRaw * revealRaw * (3 - 2 * revealRaw);
    const exit = Math.min(1, Math.max(0, (progress - 0.84) / 0.16));
    const lock = Math.max(0, 1 - Math.abs(progress - 0.72) / 0.085);
    const pointerResponseRaw = Math.min(1, Math.max(0, (progress - 0.7) / 0.08));
    markPointerResponse = pointerResponseRaw * pointerResponseRaw * (3 - 2 * pointerResponseRaw);

    landingStage.style.setProperty("--landing-progress", progress.toFixed(4));
    landingStage.style.setProperty("--landing-exit", exit.toFixed(4));
    landingStage.style.setProperty("--mark-assembly", assembly.toFixed(4));
    landingStage.style.setProperty("--mark-reveal", reveal.toFixed(4));
    landingStage.style.setProperty("--mark-lock", lock.toFixed(4));
    updateLandingPointer();
    landingFrame = 0;
  };

  const requestLandingUpdate = () => {
    if (landingFrame) return;
    landingFrame = window.requestAnimationFrame(updateLandingProgress);
  };

  updateLandingProgress();
  updateLandingGeometry();
  window.addEventListener("scroll", requestLandingUpdate, { passive: true });
  window.addEventListener("resize", () => {
    updateLandingGeometry();
    requestLandingUpdate();
  });

  window.addEventListener("load", updateLandingGeometry, { once: true });
  document.fonts?.ready.then(updateLandingGeometry);

  if (finePointer.matches && !reducedMotion.matches) {
    if (landingTitle) {
      let titleFrame = 0;

      const resetLandingTitle = () => {
        if (titleFrame) window.cancelAnimationFrame(titleFrame);
        titleFrame = 0;
        landingTitle.classList.remove("is-interacting");
        landingTitle.style.setProperty("--title-pointer-x", "50%");
        landingTitle.style.setProperty("--title-pointer-y", "50%");
        landingTitle.style.setProperty("--title-rotate-x", "0deg");
        landingTitle.style.setProperty("--title-rotate-y", "0deg");
        landingTitle.style.setProperty("--title-line-one-x", "0px");
        landingTitle.style.setProperty("--title-line-one-y", "0px");
        landingTitle.style.setProperty("--title-line-two-x", "0px");
        landingTitle.style.setProperty("--title-line-two-y", "0px");
      };

      landingTitle.addEventListener("pointerenter", () => landingTitle.classList.add("is-interacting"));

      landingTitle.addEventListener("pointermove", (event) => {
        if (titleFrame) return;

        titleFrame = window.requestAnimationFrame(() => {
          const bounds = landingTitle.getBoundingClientRect();
          const pointerX = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
          const pointerY = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
          const relativeX = pointerX - 0.5;
          const relativeY = pointerY - 0.5;

          landingTitle.style.setProperty("--title-pointer-x", `${(pointerX * 100).toFixed(2)}%`);
          landingTitle.style.setProperty("--title-pointer-y", `${(pointerY * 100).toFixed(2)}%`);
          landingTitle.style.setProperty("--title-rotate-x", `${(-relativeY * 2.2).toFixed(2)}deg`);
          landingTitle.style.setProperty("--title-rotate-y", `${(relativeX * 2.8).toFixed(2)}deg`);
          landingTitle.style.setProperty("--title-line-one-x", `${(relativeX * 5).toFixed(2)}px`);
          landingTitle.style.setProperty("--title-line-one-y", `${(relativeY * 3).toFixed(2)}px`);
          landingTitle.style.setProperty("--title-line-two-x", `${(-relativeX * 4).toFixed(2)}px`);
          landingTitle.style.setProperty("--title-line-two-y", `${(-relativeY * 2).toFixed(2)}px`);
          titleFrame = 0;
        });
      });

      landingTitle.addEventListener("pointerleave", resetLandingTitle);
    }

    landingStage.addEventListener("pointermove", (event) => {
      const bounds = landingStage.getBoundingClientRect();
      landingPointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      landingPointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      updateLandingPointer();
    });

    landingStage.addEventListener("pointerleave", () => {
      landingPointerX = 0;
      landingPointerY = 0;
      updateLandingPointer();
    });
  }
}

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

const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

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

const cosmicAssembly = document.querySelector("[data-cosmic-assembly]");

if (cosmicAssembly) {
  const cosmicRocks = [...cosmicAssembly.querySelectorAll(".cosmic-rock")];
  let cosmicFrame = 0;

  const updateCosmicAssembly = () => {
    const bounds = cosmicAssembly.getBoundingClientRect();
    const start = window.innerHeight * 0.96;
    const finish = window.innerHeight * 0.18;
    const scrollProgress = Math.min(1, Math.max(0, (start - bounds.top) / Math.max(1, start - finish)));
    const progress = reducedMotion.matches ? 1 : scrollProgress;
    const easedProgress = progress * progress * (3 - 2 * progress);
    const travelScale = Math.min(1, Math.max(0.46, window.innerWidth / 920));

    cosmicAssembly.style.setProperty("--cosmic-progress", easedProgress.toFixed(4));
    cosmicAssembly.classList.toggle("is-aligned", progress > 0.9);

    cosmicRocks.forEach((rock) => {
      const fromX = Number(rock.dataset.fromX || 0) * travelScale;
      const fromY = Number(rock.dataset.fromY || 0) * travelScale;
      const fromRotation = Number(rock.dataset.fromR || 0);
      const toRotation = Number(rock.dataset.toR || 0);
      const fromScale = Number(rock.dataset.fromScale || 1);
      const remaining = 1 - easedProgress;
      const x = fromX * remaining;
      const y = fromY * remaining;
      const rotation = fromRotation + (toRotation - fromRotation) * easedProgress;
      const scale = fromScale + (1 - fromScale) * easedProgress;

      rock.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    });

    cosmicFrame = 0;
  };

  const requestCosmicUpdate = () => {
    if (cosmicFrame) return;
    cosmicFrame = window.requestAnimationFrame(updateCosmicAssembly);
  };

  updateCosmicAssembly();
  window.addEventListener("scroll", requestCosmicUpdate, { passive: true });
  window.addEventListener("resize", requestCosmicUpdate);
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

const landingIntro = document.querySelector("[data-landing-intro]");
const landingStage = document.querySelector("[data-landing-stage]");

if (landingIntro && landingStage) {
  const landingTitle = landingStage.querySelector(".landing-title");
  const landingWaveCanvas = landingStage.querySelector("[data-landing-wave]");
  let landingWaveProgress = 0;
  let landingFrame = 0;

  const updateLandingProgress = () => {
    const transitionDistance = Math.max(1, landingIntro.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / transitionDistance));
    const exit = Math.min(1, Math.max(0, (progress - 0.84) / 0.16));
    landingWaveProgress = progress;

    landingStage.style.setProperty("--landing-progress", progress.toFixed(4));
    landingStage.style.setProperty("--landing-exit", exit.toFixed(4));
    landingStage.style.setProperty("--wave-energy", Math.min(1, progress * 1.35).toFixed(4));
    landingFrame = 0;
  };

  const requestLandingUpdate = () => {
    if (landingFrame) return;
    landingFrame = window.requestAnimationFrame(updateLandingProgress);
  };

  updateLandingProgress();
  window.addEventListener("scroll", requestLandingUpdate, { passive: true });
  window.addEventListener("resize", requestLandingUpdate);

  if (landingTitle && finePointer.matches && !reducedMotion.matches) {
    landingTitle.addEventListener("pointermove", (event) => {
      const bounds = landingTitle.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

      landingStage.style.setProperty("--landing-pointer-x", pointerX.toFixed(3));
      landingStage.style.setProperty("--landing-pointer-y", pointerY.toFixed(3));
    });

    landingTitle.addEventListener("pointerleave", () => {
      landingStage.style.setProperty("--landing-pointer-x", "0");
      landingStage.style.setProperty("--landing-pointer-y", "0");
    });
  }

  if (landingWaveCanvas) {
    const waveContext = landingWaveCanvas.getContext("2d", { alpha: true });

    if (waveContext) {
      const waveState = {
        width: 0,
        height: 0,
        dpr: 1,
        travel: 0,
        lastTime: 0,
        visible: true,
      };

      const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

      const resizeLandingWave = () => {
        const bounds = landingStage.getBoundingClientRect();
        const compact = bounds.width < 680;
        const nextDpr = Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.7);
        const nextWidth = Math.max(1, Math.round(bounds.width));
        const nextHeight = Math.max(1, Math.round(bounds.height));

        if (waveState.width === nextWidth && waveState.height === nextHeight && waveState.dpr === nextDpr) return;

        waveState.width = nextWidth;
        waveState.height = nextHeight;
        waveState.dpr = nextDpr;
        landingWaveCanvas.width = Math.round(nextWidth * nextDpr);
        landingWaveCanvas.height = Math.round(nextHeight * nextDpr);
        waveContext.setTransform(nextDpr, 0, 0, nextDpr, 0, 0);
      };

      const waveColor = (worldX, worldHalf, alpha) => {
        const orangeField = Math.exp(-Math.pow((worldX - worldHalf * 0.34) / (worldHalf * 0.55), 2));
        const blueField = Math.exp(-Math.pow((worldX + worldHalf * 0.56) / (worldHalf * 0.64), 2));
        const red = Math.round(210 + orangeField * 45 - blueField * 36);
        const green = Math.round(222 - orangeField * 112 - blueField * 46);
        const blue = Math.round(232 - orangeField * 148 + blueField * 23);
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      };

      const drawLandingWave = (timestamp = 0) => {
        resizeLandingWave();

        const width = waveState.width;
        const height = waveState.height;
        const compact = width < 680;
        const delta = waveState.lastTime ? Math.min(0.05, (timestamp - waveState.lastTime) / 1000) : 0;
        waveState.lastTime = timestamp;

        const near = compact ? 1.1 : 0.95;
        const far = compact ? 21 : 24;
        const range = far - near;
        const progress = landingWaveProgress;
        const motionSpeed = compact ? 1.15 : 1.55;
        waveState.travel = (waveState.travel + delta * motionSpeed * (1 + progress * 1.7)) % range;

        waveContext.clearRect(0, 0, width, height);
        waveContext.save();
        waveContext.globalCompositeOperation = "lighter";

        const columns = compact ? 31 : clamp(Math.round(width / 19), 46, 72);
        const rows = compact ? 40 : 58;
        const focal = Math.min(width, height) * (compact ? 0.88 : 0.96);
        const horizon = height * (compact ? 0.405 : 0.375) - progress * height * 0.025;
        const cameraHeight = compact ? 1.47 : 1.58;
        const worldHalf = (width * far) / (focal * 2) * 1.18;
        const rowSpacing = range / (rows - 1);
        const time = timestamp * 0.001;
        const projectedRows = [];

        for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
          const baseDepth = near + rowIndex * rowSpacing;
          const depth = near + ((baseDepth - near - waveState.travel + range) % range);
          const depthFade = clamp((far - depth) / (far - near), 0, 1);
          const points = [];

          for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
            const columnRatio = columnIndex / (columns - 1);
            const worldX = -worldHalf + columnRatio * worldHalf * 2;
            const primaryWave = Math.sin(worldX * 0.7 + depth * 0.58 - time * 1.15) * 0.28;
            const crossWave = Math.cos(worldX * 0.31 - depth * 0.92 + time * 0.72) * 0.14;
            const signalField = Math.exp(-Math.pow((worldX - worldHalf * 0.3) / (worldHalf * 0.2), 2));
            const signalRipple = signalField * Math.sin(depth * 1.24 - time * 2.05) * (0.16 + progress * 0.08);
            const waveY = primaryWave + crossWave + signalRipple;
            const scale = focal / depth;
            const screenX = width * 0.5 + worldX * scale;
            const screenY = horizon + (cameraHeight - waveY) * scale;

            points.push({
              x: screenX,
              y: screenY,
              worldX,
              depth,
              fade: depthFade,
            });
          }

          projectedRows.push({ depth, points });
        }

        projectedRows.sort((a, b) => b.depth - a.depth);

        projectedRows.forEach((row) => {
          for (let index = 0; index < row.points.length - 1; index += 1) {
            const start = row.points[index];
            const end = row.points[index + 1];
            if ((start.x < -80 && end.x < -80) || (start.x > width + 80 && end.x > width + 80)) continue;

            const alpha = 0.035 + Math.pow(start.fade, 1.8) * 0.17;
            waveContext.beginPath();
            waveContext.moveTo(start.x, start.y);
            waveContext.lineTo(end.x, end.y);
            waveContext.strokeStyle = waveColor((start.worldX + end.worldX) * 0.5, worldHalf, alpha);
            waveContext.lineWidth = 0.55 + start.fade * 0.4;
            waveContext.stroke();
          }
        });

        for (let rowIndex = 0; rowIndex < projectedRows.length - 1; rowIndex += 1) {
          const farRow = projectedRows[rowIndex];
          const nearRow = projectedRows[rowIndex + 1];
          if (Math.abs(farRow.depth - nearRow.depth) > rowSpacing * 1.65) continue;

          for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
            const start = farRow.points[columnIndex];
            const end = nearRow.points[columnIndex];
            if ((start.x < -80 && end.x < -80) || (start.x > width + 80 && end.x > width + 80)) continue;

            const alpha = 0.025 + Math.pow(end.fade, 2) * 0.095;
            waveContext.beginPath();
            waveContext.moveTo(start.x, start.y);
            waveContext.lineTo(end.x, end.y);
            waveContext.strokeStyle = waveColor(end.worldX, worldHalf, alpha);
            waveContext.lineWidth = 0.45 + end.fade * 0.32;
            waveContext.stroke();
          }
        }

        projectedRows.forEach((row) => {
          row.points.forEach((point) => {
            if (point.x < -18 || point.x > width + 18 || point.y < horizon - 24 || point.y > height + 22) return;

            const radius = 0.55 + Math.pow(point.fade, 2.15) * (compact ? 2.15 : 2.75);
            const alpha = 0.2 + Math.pow(point.fade, 1.45) * 0.72;
            waveContext.beginPath();
            waveContext.arc(point.x, point.y, radius, 0, Math.PI * 2);
            waveContext.fillStyle = waveColor(point.worldX, worldHalf, alpha);
            waveContext.fill();
          });
        });

        waveContext.restore();
      };

      const animateLandingWave = (timestamp) => {
        if (waveState.visible && !document.hidden) drawLandingWave(timestamp);
        window.requestAnimationFrame(animateLandingWave);
      };

      const waveObserver = new IntersectionObserver(([entry]) => {
        waveState.visible = entry.isIntersecting;
        if (entry.isIntersecting) waveState.lastTime = 0;
      }, { rootMargin: "100px" });

      waveObserver.observe(landingIntro);
      window.addEventListener("resize", () => {
        resizeLandingWave();
        if (reducedMotion.matches) drawLandingWave(0);
      });

      if (reducedMotion.matches) {
        drawLandingWave(0);
      } else {
        window.requestAnimationFrame(animateLandingWave);
      }
    }
  }
}

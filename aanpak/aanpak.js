(() => {
  const page = document.querySelector(".approach-journey-page");
  if (!page) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const hero = document.querySelector(".approach-hero");
  const orbit = document.querySelector("[data-approach-orbit]");
  const sections = [...document.querySelectorAll("[data-approach-section]")];
  const sectionLinks = [...document.querySelectorAll("[data-approach-link]")];
  const processVisual = document.querySelector("[data-process-visual]");
  const processChapters = [...document.querySelectorAll("[data-process-stage]")];
  const processLabel = document.querySelector("[data-process-label]");
  const processCount = document.querySelector("[data-process-count]");
  const processOutput = document.querySelector("[data-process-output]");
  const evidenceStory = document.querySelector("[data-evidence-story]");
  const evidenceLevels = [...document.querySelectorAll("[data-evidence-level]")];
  const roadmapStage = document.querySelector("[data-roadmap-stage]");
  const domainMap = document.querySelector("[data-domain-map]");
  const domainNodes = [...document.querySelectorAll(".domain-node")];

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  let currentProcessStage = -1;
  let currentEvidenceLevel = -1;
  let ticking = false;

  const setProcessStage = (index) => {
    if (!processVisual || !processChapters.length) return;
    const next = clamp(index, 0, processChapters.length - 1);
    if (next === currentProcessStage) return;
    currentProcessStage = next;

    const chapter = processChapters[next];
    const progressStops = [0.08, 0.37, 0.68, 1];
    processVisual.dataset.stage = String(next);
    processVisual.style.setProperty("--process-dash", progressStops[next] ?? 1);
    if (processLabel) processLabel.textContent = chapter.dataset.label || "Richting";
    if (processCount) processCount.textContent = `${String(next + 1).padStart(2, "0")} / ${String(processChapters.length).padStart(2, "0")}`;
    if (processOutput) processOutput.textContent = chapter.dataset.output || "Heldere scope";
    processChapters.forEach((item, itemIndex) => item.classList.toggle("is-current", itemIndex === next));
  };

  const setEvidenceLevel = (index) => {
    if (!evidenceStory || !evidenceLevels.length) return;
    const next = clamp(index, 0, evidenceLevels.length - 1);
    if (next === currentEvidenceLevel) return;
    currentEvidenceLevel = next;
    evidenceStory.style.setProperty("--evidence-progress", `${(next + 1) * 25}%`);
    evidenceLevels.forEach((level, levelIndex) => level.classList.toggle("is-current", levelIndex === next));
  };

  const updatePage = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const marker = viewportHeight * 0.52;

    if (hero) {
      const heroBounds = hero.getBoundingClientRect();
      const heroProgress = clamp(-heroBounds.top / Math.max(1, heroBounds.height - viewportHeight * 0.2));
      hero.style.setProperty("--hero-scroll", heroProgress.toFixed(4));
    }

    if (sections.length && sectionLinks.length) {
      let currentSection = sections[0];
      sections.forEach((section) => {
        const bounds = section.getBoundingClientRect();
        if (bounds.top <= marker) currentSection = section;
      });
      sectionLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${currentSection.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }

    if (processChapters.length) {
      let nextProcessStage = 0;
      processChapters.forEach((chapter, index) => {
        if (chapter.getBoundingClientRect().top <= marker) nextProcessStage = index;
      });
      setProcessStage(nextProcessStage);
    }

    if (evidenceLevels.length) {
      let nextEvidenceLevel = 0;
      evidenceLevels.forEach((level, index) => {
        if (level.getBoundingClientRect().top <= marker) nextEvidenceLevel = index;
      });
      setEvidenceLevel(nextEvidenceLevel);
    }

    if (roadmapStage) {
      const bounds = roadmapStage.getBoundingClientRect();
      const travel = Math.max(1, bounds.height + viewportHeight * 0.35);
      const progress = clamp((viewportHeight * 0.82 - bounds.top) / travel);
      roadmapStage.style.setProperty("--roadmap-progress", `${(progress * 100).toFixed(2)}%`);
    }

    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updatePage);
  };

  if (orbit && finePointer.matches && !reducedMotion.matches) {
    orbit.addEventListener("pointermove", (event) => {
      const bounds = orbit.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;
      orbit.style.setProperty("--orbit-x", `${x.toFixed(2)}deg`);
      orbit.style.setProperty("--orbit-y", `${y.toFixed(2)}deg`);
    });

    orbit.addEventListener("pointerleave", () => {
      orbit.style.setProperty("--orbit-x", "0deg");
      orbit.style.setProperty("--orbit-y", "0deg");
    });
  }

  if (domainMap && finePointer.matches && !reducedMotion.matches) {
    domainMap.addEventListener("pointermove", (event) => {
      const bounds = domainMap.getBoundingClientRect();
      const x = clamp((event.clientX - bounds.left) / bounds.width) * 100;
      const y = clamp((event.clientY - bounds.top) / bounds.height) * 100;
      domainMap.style.setProperty("--domain-x", `${x.toFixed(1)}%`);
      domainMap.style.setProperty("--domain-y", `${y.toFixed(1)}%`);
    });

    domainMap.addEventListener("pointerleave", () => {
      domainMap.style.setProperty("--domain-x", "50%");
      domainMap.style.setProperty("--domain-y", "50%");
    });
  }

  domainNodes.forEach((node) => {
    node.addEventListener("mouseenter", () => node.classList.add("is-focused"));
    node.addEventListener("mouseleave", () => node.classList.remove("is-focused"));
    node.addEventListener("focusin", () => node.classList.add("is-focused"));
    node.addEventListener("focusout", () => node.classList.remove("is-focused"));
  });

  setProcessStage(0);
  setEvidenceLevel(0);
  updatePage();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
})();

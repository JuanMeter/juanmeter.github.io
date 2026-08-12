(() => {
  const section = document.querySelector("[data-recognition-orbit]");
  const moons = [...(section?.querySelectorAll("[data-recognition-moon]") || [])];
  const cards = [...(section?.querySelectorAll(".recognition-item") || [])];

  if (!section || !moons.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let orbitVisible = true;
  let moonSizes = moons.map((moon) => moon.offsetWidth);

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

  const updateOrbit = () => {
    const sectionBounds = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const start = viewportHeight * 1.04;
    const travelDistance = viewportHeight + sectionBounds.height;
    const rawProgress = clamp((start - sectionBounds.top) / Math.max(1, travelDistance), 0, 1);
    const progress = reducedMotion.matches ? 0.52 : rawProgress;

    moons.forEach((moon, index) => {
      const moonSize = moonSizes[index] || 1;
      const speed = Number(moon.dataset.speed || 1);
      const verticalPosition = Number(moon.dataset.y || 0.5);
      const phase = Number(moon.dataset.phase || index);
      const travelProgress = clamp(progress * speed + (1 - speed) * 0.48, 0, 1);
      const startX = -moonSize * 1.45;
      const endX = sectionBounds.width + moonSize * 0.55;
      const x = startX + (endX - startX) * travelProgress;
      const verticalDrift = reducedMotion.matches ? 0 : Math.sin(progress * Math.PI * 2.3 + phase) * Math.min(34, sectionBounds.height * 0.035);
      const y = sectionBounds.height * verticalPosition - moonSize * 0.5 + verticalDrift;
      const rotation = phase * 12 + progress * 210 * (0.72 + speed * 0.28);

      moon.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg)`;
    });

    cards.forEach((card, index) => {
      const column = index % 3;
      const passagePoint = 0.23 + column * 0.27;
      const light = clamp(1 - Math.abs(progress - passagePoint) / 0.15, 0, 1);
      card.style.setProperty("--moon-light", light.toFixed(3));
    });

    frame = 0;
  };

  const requestOrbitUpdate = () => {
    if (frame || !orbitVisible) return;
    frame = window.requestAnimationFrame(updateOrbit);
  };

  updateOrbit();

  if (!reducedMotion.matches) {
    window.addEventListener("scroll", requestOrbitUpdate, { passive: true });
    window.addEventListener("resize", () => {
      moonSizes = moons.map((moon) => moon.offsetWidth);
      requestOrbitUpdate();
    });

    if ("IntersectionObserver" in window) {
      const orbitObserver = new IntersectionObserver((entries) => {
        orbitVisible = entries[0]?.isIntersecting ?? true;
        if (orbitVisible) requestOrbitUpdate();
      }, { rootMargin: "20% 0px" });
      orbitObserver.observe(section);
    }
  }
})();

(() => {
  const section = document.querySelector("[data-services-spiral]");
  const canvas = section?.querySelector("[data-services-spiral-canvas]");
  const context = canvas?.getContext("2d", { alpha: true });

  if (!section || !canvas || !context) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
  const ease = (value) => value * value * (3 - 2 * value);
  const TAU = Math.PI * 2;

  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let frame = 0;
  let visible = true;

  const resize = () => {
    const bounds = section.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.round(bounds.width));
    const nextHeight = Math.max(1, Math.round(bounds.height));
    const nextPixelRatio = Math.min(window.devicePixelRatio || 1, nextWidth < 680 ? 1.15 : 1.4);

    if (nextWidth === width && nextHeight === height && nextPixelRatio === pixelRatio) return false;

    width = nextWidth;
    height = nextHeight;
    pixelRatio = nextPixelRatio;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    return true;
  };

  const getProgress = () => {
    if (reducedMotion.matches) return 0.54;

    const bounds = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const start = viewportHeight * 0.92;
    const finish = -bounds.height * 0.28;
    return ease(clamp((start - bounds.top) / Math.max(1, start - finish), 0, 1));
  };

  const getGeometry = (progress) => {
    const scale = Math.min(width, height);
    const travel = (progress - 0.5) * scale * 0.3;
    const start = {
      x: -width * 0.12 + travel,
      y: height * 1.08 - travel * 0.78,
    };
    const end = {
      x: width * 1.12 + travel,
      y: -height * 0.08 - travel * 0.78,
    };
    const vectorX = end.x - start.x;
    const vectorY = end.y - start.y;
    const length = Math.hypot(vectorX, vectorY) || 1;

    return {
      start,
      directionX: vectorX / length,
      directionY: vectorY / length,
      normalX: -vectorY / length,
      normalY: vectorX / length,
      length,
      scale,
      phase: progress * TAU * 1.65,
    };
  };

  const pointOnTunnel = (geometry, progress, t, angle) => {
    const bell = Math.pow(Math.sin(Math.PI * clamp(t, 0, 1)), 0.72);
    const radius = geometry.scale * (0.055 + bell * 0.22);
    const spiral = angle + t * TAU * 2.15 + geometry.phase;
    const depth = Math.cos(spiral);
    const lateral = Math.sin(spiral);
    const centerWave = Math.sin(t * TAU * 1.25 + geometry.phase * 0.35) * geometry.scale * 0.018;
    const along = t * geometry.length + depth * radius * 0.17;
    const across = centerWave + lateral * radius;

    return {
      x: geometry.start.x + geometry.directionX * along + geometry.normalX * across,
      y: geometry.start.y + geometry.directionY * along + geometry.normalY * across,
      depth,
      fade: Math.min(1, t * 7, (1 - t) * 7),
      progress,
    };
  };

  const drawLongitudes = (geometry, progress) => {
    const strandCount = width < 680 ? 11 : 15;
    const segmentCount = width < 680 ? 38 : 54;

    for (let strand = 0; strand < strandCount; strand += 1) {
      const angle = (strand / strandCount) * TAU;

      for (let segment = 0; segment < segmentCount; segment += 1) {
        const tA = segment / segmentCount;
        const tB = (segment + 1) / segmentCount;
        const pointA = pointOnTunnel(geometry, progress, tA, angle);
        const pointB = pointOnTunnel(geometry, progress, tB, angle);
        const depth = (pointA.depth + pointB.depth) * 0.5;
        const fade = Math.min(pointA.fade, pointB.fade);
        const front = 0.5 + depth * 0.5;
        const accent = strand % 5 === 0;
        const alpha = fade * (0.09 + front * (accent ? 0.25 : 0.17));

        context.beginPath();
        context.moveTo(pointA.x, pointA.y);
        context.lineTo(pointB.x, pointB.y);
        context.lineWidth = accent ? 1.15 + front * 0.55 : 0.62 + front * 0.48;
        context.strokeStyle = accent
          ? `rgba(29, 97, 158, ${alpha.toFixed(3)})`
          : `rgba(0, 42, 75, ${alpha.toFixed(3)})`;
        context.stroke();
      }
    }
  };

  const drawCrossSections = (geometry, progress) => {
    const ringCount = width < 680 ? 14 : 20;
    const steps = width < 680 ? 28 : 38;

    for (let ring = 1; ring < ringCount; ring += 1) {
      const baseT = ring / ringCount;
      const spacingWave = Math.sin(baseT * TAU + geometry.phase * 0.42) * 0.007;
      const t = clamp(baseT + spacingWave, 0.01, 0.99);
      const ringAlpha = 0.1 + Math.sin(Math.PI * t) * 0.11;

      context.beginPath();
      for (let step = 0; step <= steps; step += 1) {
        const angle = (step / steps) * TAU;
        const ripple = Math.sin(angle * 3 + geometry.phase + t * TAU * 4) * 0.008;
        const point = pointOnTunnel(geometry, progress, clamp(t + ripple, 0, 1), angle - t * TAU * 2.15 - geometry.phase);
        if (step === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
      context.closePath();
      context.lineWidth = ring % 4 === 0 ? 1.15 : 0.72;
      context.strokeStyle = ring % 4 === 0
        ? `rgba(34, 104, 166, ${(ringAlpha + 0.05).toFixed(3)})`
        : `rgba(0, 42, 75, ${ringAlpha.toFixed(3)})`;
      context.stroke();
    }
  };

  const draw = () => {
    resize();
    const progress = getProgress();
    const geometry = getGeometry(progress);

    context.clearRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";
    drawCrossSections(geometry, progress);
    drawLongitudes(geometry, progress);
    frame = 0;
  };

  const requestDraw = () => {
    if (frame || !visible) return;
    frame = window.requestAnimationFrame(draw);
  };

  draw();

  if (!reducedMotion.matches) {
    window.addEventListener("scroll", requestDraw, { passive: true });
  }
  window.addEventListener("resize", requestDraw, { passive: true });

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(requestDraw);
    resizeObserver.observe(section);
  }

  if ("IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (visible) requestDraw();
    }, { rootMargin: "25% 0px" });
    visibilityObserver.observe(section);
  }
})();

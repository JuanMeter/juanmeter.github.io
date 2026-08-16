(() => {
  const canvas = document.querySelector("[data-audience-fluid]");
  if (!canvas) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const chapters = [...document.querySelectorAll("[data-fluid-stage]")];
  const railLinks = [...document.querySelectorAll("[data-rail-link]")];
  const stagePositions = [
    { x: 0.5, y: 0.84, scale: 0.58 },
    { x: 0.74, y: 0.56, scale: 0.43 },
    { x: 0.28, y: 0.52, scale: 0.39 },
    { x: 0.72, y: 0.5, scale: 0.42 },
    { x: 0.34, y: 0.53, scale: 0.36 },
    { x: 0.52, y: 0.7, scale: 0.5 }
  ];
  const palettes = [
    { hot: [255, 151, 83], warm: [255, 76, 22], cool: [50, 103, 224] },
    { hot: [255, 190, 111], warm: [255, 82, 26], cool: [47, 88, 188] },
    { hot: [184, 171, 255], warm: [255, 92, 38], cool: [73, 88, 222] },
    { hot: [255, 177, 104], warm: [255, 72, 18], cool: [40, 131, 213] },
    { hot: [193, 226, 255], warm: [255, 98, 46], cool: [67, 115, 219] },
    { hot: [255, 183, 109], warm: [255, 75, 21], cool: [44, 95, 201] }
  ];

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let stars = [];
  let targetStage = 0;
  let renderedStage = 0;
  let frame = 0;
  let lastTime = 0;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const mix = (a, b, amount) => a + (b - a) * amount;
  const color = (rgb, alpha = 1) => `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${alpha})`;
  const mixColor = (from, to, amount) => from.map((channel, index) => mix(channel, to[index], amount));

  function seededRandom(seed) {
    const value = Math.sin(seed * 999.91) * 43758.5453;
    return value - Math.floor(value);
  }

  function createStars() {
    const amount = clamp(Math.round((width * height) / 12500), 44, 150);
    stars = Array.from({ length: amount }, (_, index) => ({
      x: seededRandom(index + 1.1),
      y: seededRandom(index + 7.8),
      radius: 0.4 + seededRandom(index + 13.2) * 1.25,
      alpha: 0.12 + seededRandom(index + 21.7) * 0.46,
      warm: seededRandom(index + 41.4) > 0.82
    }));
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.65);
    canvas.width = Math.max(1, Math.round(width * pixelRatio));
    canvas.height = Math.max(1, Math.round(height * pixelRatio));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    createStars();
    if (reducedMotion.matches) draw(0);
  }

  function updateStage() {
    const marker = height * 0.52;
    let nextStage = 0;

    chapters.forEach((chapter, index) => {
      const box = chapter.getBoundingClientRect();
      if (box.top <= marker) nextStage = index;
    });

    targetStage = clamp(nextStage, 0, stagePositions.length - 1);
    railLinks.forEach((link, index) => {
      const active = index === Math.min(targetStage, railLinks.length - 1);
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });

    if (reducedMotion.matches) {
      renderedStage = targetStage;
      draw(0);
    }
  }

  function makeBlobPath(cx, cy, radiusX, radiusY, time, progress) {
    const points = [];
    const count = 112;
    const stageWave = progress * 0.7;

    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2;
      const wave =
        Math.sin(angle * 3 + time * 0.64 + stageWave) * 0.058 +
        Math.sin(angle * 5 - time * 0.43 + stageWave * 1.8) * 0.032 +
        Math.cos(angle * 2 + time * 0.25) * 0.022;
      const verticalWave = Math.sin(angle * 4 - time * 0.31) * 0.018;
      points.push({
        x: cx + Math.cos(angle) * radiusX * (1 + wave),
        y: cy + Math.sin(angle) * radiusY * (1 + wave + verticalWave)
      });
    }

    const path = new Path2D();
    const first = points[0];
    const last = points[points.length - 1];
    path.moveTo((last.x + first.x) / 2, (last.y + first.y) / 2);

    points.forEach((point, index) => {
      const next = points[(index + 1) % points.length];
      path.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
    });
    path.closePath();
    return path;
  }

  function drawStars(time) {
    context.save();
    stars.forEach((star, index) => {
      const drift = Math.sin(time * 0.08 + index) * 4;
      context.beginPath();
      context.arc(star.x * width + drift, star.y * height, star.radius, 0, Math.PI * 2);
      context.fillStyle = star.warm
        ? `rgba(255, 116, 63, ${star.alpha})`
        : `rgba(224, 235, 245, ${star.alpha})`;
      context.fill();
    });
    context.restore();
  }

  function drawContours(path, cx, cy, radiusX, radiusY, time, palette) {
    context.save();
    context.clip(path);
    context.globalCompositeOperation = "screen";

    for (let index = 0; index < 7; index += 1) {
      const offset = (index - 3) * radiusY * 0.13;
      const amplitude = radiusY * (0.07 + index * 0.005);
      context.beginPath();
      context.moveTo(cx - radiusX * 1.1, cy + offset);
      context.bezierCurveTo(
        cx - radiusX * 0.52,
        cy + offset - amplitude + Math.sin(time * 0.5 + index) * 18,
        cx + radiusX * 0.38,
        cy + offset + amplitude + Math.cos(time * 0.42 + index) * 15,
        cx + radiusX * 1.1,
        cy + offset - amplitude * 0.3
      );
      context.strokeStyle = index % 2
        ? color(palette.cool, 0.08)
        : color(palette.warm, 0.075);
      context.lineWidth = 1.2;
      context.stroke();
    }
    context.restore();
  }

  function drawBlob(time) {
    const lowerStage = Math.floor(renderedStage);
    const upperStage = Math.min(lowerStage + 1, stagePositions.length - 1);
    const stageAmount = renderedStage - lowerStage;
    const fromPosition = stagePositions[lowerStage];
    const toPosition = stagePositions[upperStage];
    const fromPalette = palettes[lowerStage];
    const toPalette = palettes[upperStage];
    const palette = {
      hot: mixColor(fromPalette.hot, toPalette.hot, stageAmount),
      warm: mixColor(fromPalette.warm, toPalette.warm, stageAmount),
      cool: mixColor(fromPalette.cool, toPalette.cool, stageAmount)
    };
    const position = {
      x: mix(fromPosition.x, toPosition.x, stageAmount),
      y: mix(fromPosition.y, toPosition.y, stageAmount),
      scale: mix(fromPosition.scale, toPosition.scale, stageAmount)
    };

    const smallestSide = Math.min(width, height);
    const mobileScale = width < 680 ? 1.06 : 1;
    const radius = smallestSide * position.scale * mobileScale;
    const breathing = reducedMotion.matches ? 1 : 1 + Math.sin(time * 0.34) * 0.022;
    const cx = width * position.x + Math.sin(time * 0.19 + renderedStage) * Math.min(22, width * 0.02);
    const cy = height * position.y + Math.cos(time * 0.17 + renderedStage) * Math.min(16, height * 0.018);
    const radiusX = radius * breathing;
    const radiusY = radius * (0.78 + Math.sin(renderedStage * 0.7) * 0.055) * breathing;
    const path = makeBlobPath(cx, cy, radiusX, radiusY, time, renderedStage);

    context.save();
    context.filter = `blur(${Math.max(18, radius * 0.065)}px)`;
    context.shadowColor = color(palette.warm, 0.52);
    context.shadowBlur = radius * 0.18;
    context.fillStyle = color(palette.warm, 0.11);
    context.fill(path);
    context.restore();

    context.save();
    context.clip(path);

    const base = context.createRadialGradient(
      cx - radiusX * 0.34,
      cy - radiusY * 0.43,
      radius * 0.025,
      cx,
      cy,
      radiusX * 1.08
    );
    base.addColorStop(0, color(palette.hot, 0.98));
    base.addColorStop(0.1, color(palette.warm, 0.88));
    base.addColorStop(0.28, color(palette.warm, 0.28));
    base.addColorStop(0.48, "rgba(30, 38, 61, 0.96)");
    base.addColorStop(0.72, "rgba(6, 10, 20, 0.99)");
    base.addColorStop(1, "rgba(1, 3, 8, 1)");
    context.fillStyle = base;
    context.fillRect(cx - radiusX * 1.2, cy - radiusY * 1.2, radiusX * 2.4, radiusY * 2.4);

    context.globalCompositeOperation = "screen";
    const coolLight = context.createRadialGradient(
      cx + radiusX * 0.2,
      cy + radiusY * 0.18,
      0,
      cx + radiusX * 0.18,
      cy + radiusY * 0.18,
      radiusX * 0.7
    );
    coolLight.addColorStop(0, color(palette.cool, 0.52));
    coolLight.addColorStop(0.36, color(palette.cool, 0.16));
    coolLight.addColorStop(1, color(palette.cool, 0));
    context.fillStyle = coolLight;
    context.fillRect(cx - radiusX, cy - radiusY, radiusX * 2, radiusY * 2);

    const warmRibbon = context.createLinearGradient(cx - radiusX, cy - radiusY, cx + radiusX, cy + radiusY);
    warmRibbon.addColorStop(0, color(palette.hot, 0.26));
    warmRibbon.addColorStop(0.28, color(palette.warm, 0));
    warmRibbon.addColorStop(0.58, color(palette.cool, 0.14));
    warmRibbon.addColorStop(1, color(palette.warm, 0.12));
    context.fillStyle = warmRibbon;
    context.fillRect(cx - radiusX, cy - radiusY, radiusX * 2, radiusY * 2);
    context.restore();

    drawContours(path, cx, cy, radiusX, radiusY, time, palette);

    context.save();
    context.strokeStyle = color(palette.hot, 0.5);
    context.lineWidth = Math.max(1.1, radius * 0.006);
    context.shadowColor = color(palette.warm, 0.62);
    context.shadowBlur = radius * 0.08;
    context.stroke(path);
    context.restore();

    context.save();
    context.globalCompositeOperation = "screen";
    const highlight = context.createRadialGradient(
      cx - radiusX * 0.38,
      cy - radiusY * 0.48,
      0,
      cx - radiusX * 0.34,
      cy - radiusY * 0.42,
      radiusX * 0.22
    );
    highlight.addColorStop(0, "rgba(255, 255, 255, 0.94)");
    highlight.addColorStop(0.16, color(palette.hot, 0.7));
    highlight.addColorStop(1, color(palette.hot, 0));
    context.fillStyle = highlight;
    context.fillRect(cx - radiusX, cy - radiusY, radiusX * 2, radiusY * 2);
    context.restore();
  }

  function draw(timestamp) {
    const time = reducedMotion.matches ? 0 : timestamp * 0.001;
    renderedStage += (targetStage - renderedStage) * (reducedMotion.matches ? 1 : 0.035);

    context.clearRect(0, 0, width, height);
    drawStars(time);
    drawBlob(time);
    lastTime = timestamp;
  }

  function animate(timestamp) {
    draw(timestamp);
    frame = requestAnimationFrame(animate);
  }

  function handleMotionPreference() {
    cancelAnimationFrame(frame);
    if (reducedMotion.matches) draw(lastTime);
    else frame = requestAnimationFrame(animate);
  }

  resizeCanvas();
  updateStage();
  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("scroll", updateStage, { passive: true });
  reducedMotion.addEventListener?.("change", handleMotionPreference);
  handleMotionPreference();

  window.addEventListener("pagehide", () => cancelAnimationFrame(frame), { once: true });
})();

(() => {
  const panel = document.querySelector("[data-act-grid]");
  const canvas = panel?.querySelector("[data-act-grid-canvas]");
  const context = canvas?.getContext("2d", { alpha: true });

  if (!panel || !canvas || !context) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const dataStreams = Array.from({ length: 18 }, (_, index) => ({
    lane: (index * 0.173 + 0.08) % 1,
    phase: (index * 0.277) % 1,
    speed: 0.035 + (index % 5) * 0.009,
    size: 0.85 + (index % 4) * 0.23,
  }));
  const pointer = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    velocityX: 0,
    velocityY: 0,
    strength: 0,
    targetStrength: 0,
  };
  const pulses = [];
  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let frame = 0;
  let previousTime = performance.now();
  let visible = true;
  let scrollEnergy = 0;
  let previousScrollY = window.scrollY;

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

  const resize = () => {
    const bounds = panel.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.round(bounds.width));
    const nextHeight = Math.max(1, Math.round(bounds.height));
    const nextPixelRatio = Math.min(window.devicePixelRatio || 1, nextWidth < 520 ? 1.25 : 1.5);

    if (nextWidth === width && nextHeight === height && nextPixelRatio === pixelRatio) return;

    width = nextWidth;
    height = nextHeight;
    pixelRatio = nextPixelRatio;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    if (!pointer.x && !pointer.y) {
      pointer.x = width * 0.56;
      pointer.y = height * 0.5;
      pointer.targetX = pointer.x;
      pointer.targetY = pointer.y;
    }
  };

  const updatePointer = (step) => {
    const previousX = pointer.x;
    const previousY = pointer.y;
    const easing = 1 - Math.pow(0.78, step);
    pointer.x += (pointer.targetX - pointer.x) * easing;
    pointer.y += (pointer.targetY - pointer.y) * easing;
    pointer.velocityX += ((pointer.x - previousX) - pointer.velocityX) * 0.22;
    pointer.velocityY += ((pointer.y - previousY) - pointer.velocityY) * 0.22;
    pointer.strength += (pointer.targetStrength - pointer.strength) * (1 - Math.pow(0.84, step));
    pointer.velocityX *= Math.pow(0.88, step);
    pointer.velocityY *= Math.pow(0.88, step);
    scrollEnergy *= Math.pow(0.92, step);
  };

  const updatePulses = (step) => {
    for (let index = pulses.length - 1; index >= 0; index -= 1) {
      pulses[index].radius += 3.4 * step;
      pulses[index].life -= 0.019 * step;
      if (pulses[index].life <= 0) pulses.splice(index, 1);
    }
  };

  const distortPoint = (x, y, time) => {
    const normalX = x / width;
    const normalY = y / height;
    const motion = reducedMotion.matches ? 0 : time;
    const ambientX =
      Math.sin(normalY * Math.PI * 3.35 + motion * 0.00062 + Math.cos(normalX * Math.PI * 2.1 - motion * 0.00018)) * 10.5
      + Math.sin((normalX + normalY) * Math.PI * 2.2 - motion * 0.00039) * 4.2;
    const ambientY =
      Math.sin(normalX * Math.PI * 3.05 - motion * 0.00053 + Math.sin(normalY * Math.PI * 2.4 + motion * 0.00016)) * 9.4
      + Math.cos((normalX - normalY) * Math.PI * 2.7 + motion * 0.00035) * 3.8;
    const dx = x - pointer.x;
    const dy = y - pointer.y;
    const distanceSquared = dx * dx + dy * dy;
    const distance = Math.sqrt(distanceSquared) || 1;
    const radius = Math.min(190, Math.max(125, width * 0.28));
    const pointerFalloff = Math.exp(-distanceSquared / (radius * radius * 0.68)) * pointer.strength;
    const pointerPush = pointerFalloff * (13 + Math.min(13, Math.hypot(pointer.velocityX, pointer.velocityY) * 3));
    const swirl = pointerFalloff * 7.5;
    let offsetX = ambientX + (dx / distance) * pointerPush - (dy / distance) * swirl;
    let offsetY = ambientY + (dy / distance) * pointerPush + (dx / distance) * swirl;

    offsetX += Math.sin(normalY * Math.PI) * scrollEnergy * (normalY - 0.5) * 13;
    offsetY += Math.sin(normalX * Math.PI) * scrollEnergy * (normalX - 0.5) * -11;

    pulses.forEach((pulse) => {
      const pulseX = x - pulse.x;
      const pulseY = y - pulse.y;
      const pulseDistance = Math.hypot(pulseX, pulseY) || 1;
      const ringDistance = pulseDistance - pulse.radius;
      const ring = Math.exp(-(ringDistance * ringDistance) / 330) * pulse.life * 12;
      offsetX += (pulseX / pulseDistance) * ring;
      offsetY += (pulseY / pulseDistance) * ring;
    });

    return { x: x + offsetX, y: y + offsetY };
  };

  const drawLine = (points, strokeStyle, lineWidth) => {
    if (!points.length) return;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let index = 1; index < points.length - 1; index += 1) {
      const current = points[index];
      const next = points[index + 1];
      context.quadraticCurveTo(current.x, current.y, (current.x + next.x) * 0.5, (current.y + next.y) * 0.5);
    }

    const last = points[points.length - 1];
    context.lineTo(last.x, last.y);
    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.stroke();
  };

  const drawGrid = (time) => {
    context.clearRect(0, 0, width, height);
    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";

    const compact = width < 520;
    const spacing = compact ? 27 : 31;
    const cylinderRadius = width * 0.57;
    const cylinderCenterX = width * 0.5;
    const cylinderCenterY = height * 0.5;
    const columns = Math.ceil(width / spacing) + 4;
    const rows = Math.ceil(height / spacing) + 2;
    const rotation = reducedMotion.matches ? 0.18 : (time * 0.000045) % 1;
    const projectCylinderPoint = (angle, sourceY) => {
      const depth = Math.max(0, Math.cos(angle));
      const projectedX = cylinderCenterX + Math.sin(angle) * cylinderRadius;
      const verticalScale = 0.81 + depth * 0.19;
      const projectedY = cylinderCenterY + (sourceY - cylinderCenterY) * verticalScale;
      const surfaceDrift = Math.sin((sourceY / height) * Math.PI * 2.2 + angle * 1.4 + time * 0.00034) * depth * 2.8;
      return distortPoint(projectedX + surfaceDrift, projectedY, time);
    };
    const horizontalGradient = context.createLinearGradient(0, 0, width, 0);
    horizontalGradient.addColorStop(0, "rgba(92, 181, 224, 0.07)");
    horizontalGradient.addColorStop(0.22, "rgba(123, 205, 238, 0.18)");
    horizontalGradient.addColorStop(0.5, "rgba(205, 241, 252, 0.34)");
    horizontalGradient.addColorStop(0.78, "rgba(108, 195, 232, 0.17)");
    horizontalGradient.addColorStop(1, "rgba(79, 160, 207, 0.06)");

    const volumeGlow = context.createLinearGradient(0, 0, width, 0);
    volumeGlow.addColorStop(0, "rgba(79, 177, 223, 0)");
    volumeGlow.addColorStop(0.28, "rgba(90, 190, 232, 0.015)");
    volumeGlow.addColorStop(0.5, "rgba(194, 235, 250, 0.055)");
    volumeGlow.addColorStop(0.72, "rgba(78, 176, 223, 0.012)");
    volumeGlow.addColorStop(1, "rgba(48, 141, 197, 0)");
    context.fillStyle = volumeGlow;
    context.fillRect(0, 0, width, height);

    for (let row = -1; row <= rows; row += 1) {
      const points = [];
      const y = row * spacing;
      const samples = compact ? 46 : 62;

      for (let sample = 0; sample <= samples; sample += 1) {
        const angle = -Math.PI * 0.5 + (sample / samples) * Math.PI;
        points.push(projectCylinderPoint(angle, y));
      }

      const major = ((row + 1) % 4) === 0;
      drawLine(points, horizontalGradient, major ? 1.05 : 0.72);
    }

    for (let column = 0; column < columns; column += 1) {
      const points = [];
      const phase = (column / columns + rotation) % 1;
      const angle = -Math.PI * 0.5 + phase * Math.PI;
      const depth = Math.max(0, Math.cos(angle));
      const samples = Math.ceil(height / 13) + 2;

      for (let sample = -1; sample <= samples; sample += 1) {
        points.push(projectCylinderPoint(angle, (sample / samples) * height));
      }

      const major = ((column + 1) % 4) === 0;
      const opacity = (major ? 0.12 : 0.075) + depth * (major ? 0.25 : 0.18);
      const lineColor = `rgba(177, 229, 248, ${opacity.toFixed(3)})`;
      drawLine(points, lineColor, (major ? 0.72 : 0.48) + depth * 0.42);
    }

    context.save();
    context.globalCompositeOperation = "screen";
    context.lineCap = "round";

    dataStreams.forEach((stream) => {
      const flowTime = reducedMotion.matches ? stream.phase : (stream.phase + time * stream.speed * 0.001) % 1;
      const angle = -Math.PI * 0.5 + flowTime * Math.PI;
      const trailAngle = -Math.PI * 0.5 + Math.max(0, flowTime - 0.026) * Math.PI;
      const depth = Math.max(0, Math.cos(angle));
      const sourceY = stream.lane * height;
      const point = projectCylinderPoint(angle, sourceY);
      const trail = projectCylinderPoint(trailAngle, sourceY);

      const streak = context.createLinearGradient(trail.x, trail.y, point.x, point.y);
      streak.addColorStop(0, "rgba(188, 237, 252, 0)");
      streak.addColorStop(1, `rgba(219, 248, 255, ${(0.18 + depth * 0.45).toFixed(3)})`);
      context.strokeStyle = streak;
      context.lineWidth = stream.size;
      context.beginPath();
      context.moveTo(trail.x, trail.y);
      context.lineTo(point.x, point.y);
      context.stroke();

      context.fillStyle = `rgba(229, 250, 255, ${(0.16 + depth * 0.5).toFixed(3)})`;
      context.beginPath();
      context.arc(point.x, point.y, stream.size * 0.72, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();

    if (pointer.strength > 0.025) {
      const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 120);
      glow.addColorStop(0, `rgba(165, 225, 249, ${0.07 * pointer.strength})`);
      glow.addColorStop(1, "rgba(73, 171, 221, 0)");
      context.globalCompositeOperation = "screen";
      context.fillStyle = glow;
      context.fillRect(pointer.x - 120, pointer.y - 120, 240, 240);
    }

    context.restore();
  };

  const draw = (time) => {
    resize();
    const elapsed = clamp(time - previousTime, 1, 34);
    previousTime = time;
    const step = elapsed / 16.67;
    updatePointer(step);
    updatePulses(step);
    drawGrid(time);

    if (visible && !reducedMotion.matches) {
      frame = window.requestAnimationFrame(draw);
    } else {
      frame = 0;
    }
  };

  const ensureAnimation = () => {
    if (frame || !visible) return;
    previousTime = performance.now();
    frame = window.requestAnimationFrame(draw);
  };

  const reactToScroll = () => {
    const scrollDifference = window.scrollY - previousScrollY;
    previousScrollY = window.scrollY;
    scrollEnergy = clamp(scrollEnergy + scrollDifference * 0.025, -1.4, 1.4);
    ensureAnimation();
  };

  if (finePointer.matches && !reducedMotion.matches) {
    panel.addEventListener("pointerenter", (event) => {
      const bounds = panel.getBoundingClientRect();
      pointer.targetX = event.clientX - bounds.left;
      pointer.targetY = event.clientY - bounds.top;
      pointer.x = pointer.targetX;
      pointer.y = pointer.targetY;
      pointer.targetStrength = 0.72;
      ensureAnimation();
    });

    panel.addEventListener("pointermove", (event) => {
      const bounds = panel.getBoundingClientRect();
      pointer.targetX = clamp(event.clientX - bounds.left, 0, bounds.width);
      pointer.targetY = clamp(event.clientY - bounds.top, 0, bounds.height);
      pointer.targetStrength = 0.82;
      ensureAnimation();
    });

    panel.addEventListener("pointerleave", () => {
      pointer.targetStrength = 0;
    });

    panel.addEventListener("pointerdown", (event) => {
      const bounds = panel.getBoundingClientRect();
      pulses.push({
        x: clamp(event.clientX - bounds.left, 0, bounds.width),
        y: clamp(event.clientY - bounds.top, 0, bounds.height),
        radius: 0,
        life: 1,
      });
      if (pulses.length > 4) pulses.shift();
      ensureAnimation();
    });
  }

  resize();

  if (reducedMotion.matches) {
    pointer.strength = 0;
    drawGrid(0);
  } else {
    window.addEventListener("scroll", reactToScroll, { passive: true });
    window.addEventListener("resize", ensureAnimation);

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(() => {
        resize();
        ensureAnimation();
      });
      resizeObserver.observe(panel);
    }

    if ("IntersectionObserver" in window) {
      const visibilityObserver = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) ensureAnimation();
      }, { rootMargin: "18% 0px" });
      visibilityObserver.observe(panel);
    }

    ensureAnimation();
  }
})();

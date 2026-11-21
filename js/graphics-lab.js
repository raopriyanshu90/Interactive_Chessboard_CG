/* MEMBER 4: algorithms coded from scratch for the CG demonstration panel */
function dda(x0, y0, x1, y1) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)),
    out = [];
  for (let i = 0; i <= n; i++)
    out.push([
      Math.round(x0 + ((x1 - x0) * i) / n),
      Math.round(y0 + ((y1 - y0) * i) / n),
    ]);
  return out;
}
function bresenham(x0, y0, x1, y1) {
  const out = [],
    dx = Math.abs(x1 - x0),
    dy = Math.abs(y1 - y0),
    sx = x0 < x1 ? 1 : -1,
    sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  while (true) {
    out.push([x0, y0]);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
  return out;
}
function midpointCircle(cx, cy, r) {
  const out = [];
  let x = 0,
    y = r,
    d = 1 - r;
  while (x <= y) {
    for (const [a, b] of [
      [x, y],
      [y, x],
      [-x, y],
      [-y, x],
      [x, -y],
      [y, -x],
      [-x, -y],
      [-y, -x],
    ])
      out.push([cx + a, cy + b]);
    x++;
    if (d < 0) d += 2 * x + 1;
    else {
      y--;
      d += 2 * (x - y) + 1;
    }
  }
  return out;
}
function renderLab() {
  const canvas = document.getElementById("lab"),
    ctx = canvas.getContext("2d"),
    type = document.getElementById("demo").value;
  ctx.clearRect(0, 0, 320, 240);
  const size = 8;
  ctx.strokeStyle = "#263c50";
  ctx.lineWidth = 0.5;
  for (let x = 0; x < 320; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 240);
    ctx.stroke();
  }
  for (let y = 0; y < 240; y += size) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(320, y);
    ctx.stroke();
  }
  let pts = [],
    message = "";
  if (type === "dda") {
    pts = dda(3, 25, 34, 6);
    message =
      "DDA: increments x and y in equal steps, then rounds to raster pixels.";
  } else if (type === "bresenham") {
    pts = bresenham(3, 25, 34, 6);
    message =
      "Bresenham: uses an integer decision error to choose the next pixel.";
  } else if (type === "circle") {
    pts = midpointCircle(20, 15, 10);
    message =
      "Midpoint circle: uses eight-way symmetry and a decision parameter.";
  } else {
    const base = [
        [0, -7],
        [7, 7],
        [-7, 7],
      ],
      angle = Math.PI / 5,
      scale = 1.4,
      cx = 20,
      cy = 15;
    pts = base.map(([x, y]) => [
      Math.round(cx + scale * (x * Math.cos(angle) - y * Math.sin(angle))),
      Math.round(cy + scale * (x * Math.sin(angle) + y * Math.cos(angle))),
    ]);
    message =
      "2D transform: scale + rotate + translate triangle vertices using matrix equations.";
    ctx.strokeStyle = "#ffe5a1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.forEach(([x, y], i) =>
      i ? ctx.lineTo(x * size, y * size) : ctx.moveTo(x * size, y * size),
    );
    ctx.closePath();
    ctx.stroke();
  }
  ctx.fillStyle = "#5be4b4";
  for (const [x, y] of pts)
    ctx.fillRect(x * size, y * size, size - 1, size - 1);
  document.getElementById("explain").textContent = message;
}

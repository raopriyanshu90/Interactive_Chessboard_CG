/* MEMBER 1: board rendering, 2D primitives, Cartesian-to-canvas coordinate mapping */
const BOARD_SIZE = 640,
  CELL = BOARD_SIZE / 8;
function cellCenter(row, col) {
  return { x: (col + 0.5) * CELL, y: (row + 0.5) * CELL };
}
function pointerToCell(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const col = Math.floor(
    ((event.clientX - rect.left) * canvas.width) / rect.width / CELL,
  );
  const row = Math.floor(
    ((event.clientY - rect.top) * canvas.height) / rect.height / CELL,
  );
  return row >= 0 && row < 8 && col >= 0 && col < 8 ? { row, col } : null;
}
function drawBoard(ctx, showCoordinates = true) {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f1dfbc" : "#8aaf90";
      ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
      if (showCoordinates) {
        ctx.fillStyle = (r + c) % 2 === 0 ? "#52775d" : "#f9e9c8";
        ctx.font = "bold 13px Arial";
        if (c === 0) ctx.fillText(String(8 - r), c * CELL + 5, r * CELL + 16);
        if (r === 7)
          ctx.fillText(
            "abcdefgh"[c],
            c * CELL + CELL - 15,
            r * CELL + CELL - 7,
          );
      }
    }
}
function drawHighlights(ctx, selected, moves, last) {
  if (last)
    for (const p of last) {
      ctx.fillStyle = "#e6c54d55";
      ctx.fillRect(p.col * CELL, p.row * CELL, CELL, CELL);
    }
  if (selected) {
    ctx.fillStyle = "#ffe86d99";
    ctx.fillRect(selected.col * CELL, selected.row * CELL, CELL, CELL);
  }
  for (const m of moves) {
    const p = cellCenter(m.row, m.col);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#23744a99";
    ctx.fill();
  }
}

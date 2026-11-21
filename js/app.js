/* MEMBER 3: mouse interaction, animation, canvas frame redraw */
const canvas = document.getElementById("board"),
  ctx = canvas.getContext("2d");
let board = initialBoard(),
  turn = "w",
  selected = null,
  moves = [],
  last = null,
  history = [],
  animating = false,
  gameOver = false;
function draw(skip = null) {
  drawBoard(ctx, document.getElementById("coords").checked);
  drawHighlights(ctx, selected, moves, last);
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      if (skip && skip.row === r && skip.col === c) continue;
      const p = board[r][c];
      if (p) {
        const xy = cellCenter(r, c);
        drawPiece(ctx, p, xy.x, xy.y);
      }
    }
}
function updateStatus() {
  const side = turn === "w" ? "White" : "Black",
    check = inCheck(board, turn),
    hasMoves = allLegalMoves(board, turn);
  gameOver = !hasMoves;
  document.getElementById("status").textContent = !hasMoves
    ? check
      ? `Checkmate — ${turn === "w" ? "Black" : "White"} wins`
      : "Stalemate — draw"
    : `${side} to move${check ? " — CHECK!" : ""}`;
  document.getElementById("history").textContent = `Moves: ${history.length}`;
  document.getElementById("selection").textContent = selected
    ? `Selected ${board[selected.row][selected.col]?.type} at ${"abcdefgh"[selected.col]}${8 - selected.row} • ${moves.length} legal moves`
    : "Click a piece to see valid moves.";
}
function animateMove(piece, from, to, done) {
  if (!document.getElementById("animate").checked) {
    done();
    return;
  }
  animating = true;
  const start = performance.now(),
    duration = 220;
  function frame(now) {
    const t = Math.min(1, (now - start) / duration),
      ease = t * t * (3 - 2 * t),
      a = cellCenter(from.row, from.col),
      b = cellCenter(to.row, to.col);
    draw(from);
    drawPiece(
      ctx,
      piece,
      a.x + (b.x - a.x) * ease,
      a.y + (b.y - a.y) * ease,
      1 + Math.sin(t * Math.PI) * 0.1,
    );
    if (t < 1) requestAnimationFrame(frame);
    else {
      animating = false;
      done();
    }
  }
  requestAnimationFrame(frame);
}
canvas.addEventListener("click", (e) => {
  if (animating || gameOver) return;
  const cell = pointerToCell(canvas, e);
  if (!cell) return;
  const p = board[cell.row][cell.col];
  if (selected && moves.some((m) => m.row === cell.row && m.col === cell.col)) {
    const from = selected,
      to = cell,
      moving = { ...board[from.row][from.col] };
    history.push({ board: cloneBoard(board), turn, last });
    selected = null;
    moves = [];
    animateMove(moving, from, to, () => {
      board[to.row][to.col] = moving;
      board[from.row][from.col] = null;
      if (moving.type === "P" && (to.row === 0 || to.row === 7))
        moving.type = "Q";
      last = [from, to];
      turn = turn === "w" ? "b" : "w";
      draw();
      updateStatus();
    });
    return;
  }
  if (p && p.color === turn) {
    selected = cell;
    moves = legalMoves(board, cell.row, cell.col);
  } else {
    selected = null;
    moves = [];
  }
  draw();
  updateStatus();
});
document.getElementById("reset").addEventListener("click", () => {
  if (animating) return;
  board = initialBoard();
  turn = "w";
  selected = null;
  moves = [];
  last = null;
  history = [];
  gameOver = false;
  draw();
  updateStatus();
});
document.getElementById("undo").addEventListener("click", () => {
  if (animating || !history.length) return;
  const h = history.pop();
  board = h.board;
  turn = h.turn;
  last = h.last;
  selected = null;
  moves = [];
  gameOver = false;
  draw();
  updateStatus();
});
document.getElementById("coords").addEventListener("change", () => draw());
document.getElementById("demo").addEventListener("change", renderLab);
draw();
updateStatus();
renderLab();

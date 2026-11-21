/* MEMBER 2: chess piece rendering via canvas glyphs, translation and scaling */
const SYMBOLS = {
  w: { K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙" },
  b: { K: "♚", Q: "♛", R: "♜", B: "♝", N: "♞", P: "♟" },
};
function drawPiece(ctx, piece, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '66px "DejaVu Sans","Segoe UI Symbol","Arial Unicode MS",serif';
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = piece.color === "w" ? "#26352e" : "#e4e7e2";
  ctx.fillStyle = piece.color === "w" ? "#fffdf4" : "#182a2a";
  const symbol = SYMBOLS[piece.color][piece.type];
  ctx.strokeText(symbol, 0, 2);
  ctx.fillText(symbol, 0, 2);
  ctx.restore();
}

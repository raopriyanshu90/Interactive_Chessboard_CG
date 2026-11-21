/* MEMBER 4: chess state, legal movement, turn logic and undo */
function initialBoard() {
  const back = ["R", "N", "B", "Q", "K", "B", "N", "R"];
  return Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 8 }, (_, c) =>
      r === 0
        ? { color: "b", type: back[c] }
        : r === 1
          ? { color: "b", type: "P" }
          : r === 6
            ? { color: "w", type: "P" }
            : r === 7
              ? { color: "w", type: back[c] }
              : null,
    ),
  );
}
function cloneBoard(b) {
  return b.map((row) => row.map((p) => (p ? { ...p } : null)));
}
function inside(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}
function pseudoMoves(board, r, c, attackOnly = false) {
  const p = board[r]?.[c];
  if (!p) return [];
  const moves = [];
  const add = (rr, cc) => {
    if (!inside(rr, cc)) return false;
    const target = board[rr][cc];
    if (!target || target.color !== p.color) {
      if (target?.type !== "K") moves.push({ row: rr, col: cc });
    }
    return !target;
  };
  const ray = (dr, dc) => {
    let rr = r + dr,
      cc = c + dc;
    while (inside(rr, cc)) {
      if (!add(rr, cc)) break;
      rr += dr;
      cc += dc;
    }
  };
  if (p.type === "P") {
    const d = p.color === "w" ? -1 : 1;
    if (attackOnly) {
      for (const dc of [-1, 1])
        if (inside(r + d, c + dc)) moves.push({ row: r + d, col: c + dc });
    } else {
      if (inside(r + d, c) && !board[r + d][c]) {
        moves.push({ row: r + d, col: c });
        const start = p.color === "w" ? 6 : 1;
        if (r === start && !board[r + 2 * d][c])
          moves.push({ row: r + 2 * d, col: c });
      }
      for (const dc of [-1, 1])
        if (
          inside(r + d, c + dc) &&
          board[r + d][c + dc] &&
          board[r + d][c + dc].color !== p.color &&
          board[r + d][c + dc].type !== "K"
        )
          moves.push({ row: r + d, col: c + dc });
    }
    return moves;
  }
  if (p.type === "N") {
    for (const [dr, dc] of [
      [1, 2],
      [2, 1],
      [-1, 2],
      [-2, 1],
      [1, -2],
      [2, -1],
      [-1, -2],
      [-2, -1],
    ])
      add(r + dr, c + dc);
  } else if (p.type === "K") {
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) if (dr || dc) add(r + dr, c + dc);
  } else {
    const dirs = [];
    if (["R", "Q"].includes(p.type))
      dirs.push([1, 0], [-1, 0], [0, 1], [0, -1]);
    if (["B", "Q"].includes(p.type))
      dirs.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
    for (const [dr, dc] of dirs) ray(dr, dc);
  }
  return moves;
}
function attacked(board, row, col, byColor) {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (
        board[r][c]?.color === byColor &&
        pseudoMoves(board, r, c, true).some(
          (m) => m.row === row && m.col === col,
        )
      )
        return true;
  return false;
}
function inCheck(board, color) {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c]?.color === color && board[r][c].type === "K")
        return attacked(board, r, c, color === "w" ? "b" : "w");
  return true;
}
function legalMoves(board, r, c) {
  const p = board[r]?.[c];
  if (!p) return [];
  return pseudoMoves(board, r, c).filter((m) => {
    const copy = cloneBoard(board);
    copy[m.row][m.col] = copy[r][c];
    copy[r][c] = null;
    return !inCheck(copy, p.color);
  });
}
function allLegalMoves(board, color) {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c]?.color === color && legalMoves(board, r, c).length)
        return true;
  return false;
}

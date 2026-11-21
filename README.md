# Interactive Chessboard Graphic System

## Quick start
1. Extract ZIP.
2. Open `index.html` in Chrome, Edge, or Firefox. Internet and installation are not required.
3. Click a white piece, then a green highlighted square. Alternate turns.
4. Try Reset, Undo, Coordinates, Animation, and all four Computer Graphics Lab demonstrations.

## Technology
HTML5 Canvas 2D API, CSS, vanilla JavaScript. No external libraries.

## Scope
Chess movement includes piece-specific moves, captures, alternating turns, king safety (check), checkmate/stalemate detection, and automatic queen promotion. Castling, en passant, promotion choice, threefold repetition and 50-move rule are not implemented. This is an educational CG project, not a tournament chess engine.

## Four-member contribution breakdown
| Member | Responsibility | Code to present | Demo |
|---|---|---|---|
| 1 | Chessboard geometry, coordinates, drawing | `js/board.js`, board section in `css/style.css` | Explain 8x8 grid, square coordinates, color filling |
| 2 | Chess piece design and transformations | `js/pieces.js` | Explain glyph drawing, translate/scale transforms |
| 3 | Interactivity and visual feedback | `js/app.js` | Select piece, highlight moves, show animated movement |
| 4 | Chess rules and CG algorithms | `js/logic.js`, `js/graphics-lab.js` | Explain legal moves and DDA/Bresenham/midpoint algorithms |

These are proposed assignments. Each person should understand and implement or customize their module before claiming personal contribution.

## Coordinate mapping
Cell size = canvas width / 8 = 80 px. Column = floor(mouseX / 80); row = floor(mouseY / 80). Pixel center = ((column + 0.5)*80, (row + 0.5)*80). Row 0 is top (rank 8), column 0 is left (file a).

## Graphics algorithms
- DDA: incremental line rasterization with floating-point steps and rounding.
- Bresenham: integer error-term line rasterization.
- Midpoint circle: eight-way symmetry, integer decision variable.
- Translation, scaling, rotation: transformations on chess piece drawing and triangle demonstration.

## Demo checklist
1. Show board and explain `fillRect` squares.
2. Select a white pawn, observe valid moves.
3. Move a piece and observe animation.
4. Undo and reset.
5. Toggle coordinate labels.
6. Switch through all four graphics demonstrations.

## Testing
Open browser DevTools console; it should show no errors. Run `tests.html` for automated core algorithm checks.

import { useState } from "react";
import { Chessboard } from "react-chessboard";
import {
    Chess,
    // SQUARES,
    // BLACK,
    // WHITE,
    PAWN,
    KNIGHT,
    BISHOP,
    ROOK,
    QUEEN,
    KING,
} from "chess.js";

export function PlayChess() {
    const [game, setGame] = useState(new Chess());
    const [colorLegalMoveSquares, setColorLegalMoveSquares] = useState({});
    const [colorSelectedPieceSquare, setColorSelectedPieceSquare] = useState({});
    const [colorHoveredSquare, setColorHoveredSquare] = useState({});
    const [animationDuration, setAnimationDuration] = useState(0);
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [isDragging, setIsDragging] = useState(false); // Track dragging state
    const [isPieceSelected, setIsPieceSelected] = useState(false);
    const pieceConverter = {
        wP: PAWN, // White Pawn
        wN: KNIGHT, // White Knight
        wB: BISHOP, // White Bishop
        wR: ROOK, // White Rook
        wQ: QUEEN, // White Queen
        wK: KING, // White King
        bP: PAWN, // Black Pawn
        bN: KNIGHT, // Black Knight
        bB: BISHOP, // Black Bishop
        bR: ROOK, // Black Rook
        bQ: QUEEN, // Black Queen
        bK: KING, // Black King
    };

    function isLegalMove(sourceSquare, targetSquare) {
        const legalMoves = getLegalMoves(sourceSquare);
        const move = legalMoves.find((m) => m.to === targetSquare);
        return Boolean(move);
    }

    function makeMove(sourceSquare, targetSquare, promotion = null) {
        const legalMoves = getLegalMoves(sourceSquare);
        const move = legalMoves.find((m) => m.to === targetSquare && (m.promotion || null) === promotion);
        if (!move) {
            return;
        }

        if (isDragging) {
            setAnimationDuration(0);
        } else {
            setAnimationDuration(300);
        }

        game.move(move);
        console.log(game.fen());
    }

    function getLegalMoves(sourceSquare) {
        const legalMoves = game.moves({
            verbose: true,
            square: sourceSquare,
        });
        return legalMoves;
    }

    function dehighlightSquares() {
        setColorLegalMoveSquares({});
        setColorSelectedPieceSquare({});
        setColorHoveredSquare({});
        setSelectedSquare(null);
        setIsPieceSelected(false);
    }

    function selectPieceSquare(square) {
        const newHighlights = {};
        newHighlights[square] = {
            backgroundColor: "rgba(255, 255, 0, 1)",
        };
        setSelectedSquare(square);
        setIsPieceSelected(true);
        setColorSelectedPieceSquare(newHighlights);
    }

    function highlightLegalMoves(sourceSquare) {
        const newHighlights = {};

        const legalMoves = getLegalMoves(sourceSquare);

        legalMoves.forEach((move) => {
            newHighlights[move.to] = {
                background:
                    game.get(move.to) && game.get(move.to).color !== game.get(sourceSquare).color
                        ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
                        : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
                borderRadius: "50%",
            };
            return move;
        });
        setColorLegalMoveSquares(newHighlights);
    }

    function onMouseOverSquare(square, overrideState = false) {
        const newHighlights = {};
        if (isPieceSelected || game.get(square)) {
            // Always add white inset box
            newHighlights[square] = {
                boxShadow: "inset 0 0 1px 6px rgba(255, 255, 255, .75)",
            };

            const legalMoves = getLegalMoves(selectedSquare);
            if (legalMoves.find((m) => m.to === square)) {
                // Separate handling for hovering on squares that are legal moves for the selected piece
                newHighlights[square] = {
                    background:
                        game.get(square) && game.get(square).color !== game.get(selectedSquare).color
                            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
                            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
                    ...newHighlights[square],
                };
            } else if (square === selectedSquare) {
                // Separate handling for hovering on a selected piece
                newHighlights[square] = {
                    ...colorSelectedPieceSquare[square],
                    ...newHighlights[square],
                };
            } else if (overrideState) {
                // If override is specified we are manually rendering for a newly selected piece
                // This avoids a race condition with state updates that messes up square highlighting
                // when the prior condition's logic is used
                newHighlights[square] = {
                    ...newHighlights[square],
                    backgroundColor: "rgba(255, 255, 0, 1)",
                };
            }
        }

        setColorHoveredSquare(newHighlights);
    }

    function onPieceClick(piece, square) {
        selectPieceSquare(square);
        highlightLegalMoves(square);
        // Update the current mouse over to account for variable updates
        // Use the optional overrideState variable to bypass a slow state update
        onMouseOverSquare(square, true);
    }

    function onSquareClick(square) {
        if (isLegalMove(selectedSquare, square)) {
            // if (game.get(selectedSquare).type === PAWN && (square.endsWith("8") || square.endsWith("1"))) {
            // }
            makeMove(selectedSquare, square);
            dehighlightSquares();
        } else if (!game.get(square) || game.get(square).color != game.turn()) {
            // if the square has no piece on it or the wrong player color is selected
            dehighlightSquares();
        }
    }

    function onDrop(sourceSquare, targetSquare) {
        if (isLegalMove(sourceSquare, targetSquare)) {
            makeMove(sourceSquare, targetSquare);
            dehighlightSquares();
        }
    }

    function onPieceDragStart(piece, square) {
        setIsDragging(true);
        if (game.get(square).color == game.turn()) {
            highlightLegalMoves(square);
            selectPieceSquare(square);
            // Update the current mouse over to account for variable updates
            // Use the optional overrideState variable to bypass a slow state update
            onMouseOverSquare(square, true);
        }
    }

    function onPieceDragEnd() {
        setIsDragging(false);
    }

    return (
        <div
            style={{
                width: "calc(100vmin - 40vmin)", // Subtract a margin from both sides, maintaining square aspect ratio
                height: "calc(100vmin - 40vmin)", // vmin ensures responsiveness to both width and height
                margin: "20vmin auto", // Even margins (10vmin) on top/bottom and left/right
                display: "block", // Ensures block-level behavior for centering
            }}
        >
            <Chessboard
                id="BasicBoard"
                position={game.fen()}
                style={{
                    width: "100%", // Fill the container width
                    height: "100%", // Fill the container height
                }}
                onPieceDrop={onDrop}
                onPieceClick={onPieceClick}
                onSquareClick={onSquareClick}
                onPieceDragBegin={onPieceDragStart}
                onPieceDragEnd={onPieceDragEnd}
                onMouseOverSquare={onMouseOverSquare}
                animationDuration={animationDuration}
                customSquareStyles={{
                    ...colorLegalMoveSquares,
                    ...colorSelectedPieceSquare,
                    ...colorHoveredSquare,
                }}
            />
        </div>
    );
}

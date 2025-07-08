import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={"square" + (highlight ? " highlight" : "")}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {
  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : null;
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every((sq) => sq !== null)) {
    status = "Draw! No one wins.";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  function handleClick(i) {
    if (squares[i]||winner) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  // Generate board using two loops
  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const squaresInRow = [];
    for (let col = 0; col < 3; col++) {
      const idx = row * 3 + col;
      const isHighlight = winningLine && winningLine.includes(idx);
      squaresInRow.push(
        <Square key={idx} value={squares[idx]} onSquareClick={() => handleClick(idx)} highlight={isHighlight} />
      );
    }
    boardRows.push(
      <div className="board-row" key={row}>
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status"> {status}</div>
      {boardRows}
    </>
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  }
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) {
    console.log("jump to move", nextMove);
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move) => {
    let description;
    if(currentMove == move){
      description = "You are at move #" + move
      return (
        <li key={move}>{description}</li>
      )
    } else {
      if(move > 0) {
        description = "Go to move #" + move;
      } else {
        description = "Go to game start";
      }
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending((prev) => !prev)}>
          Sort {isAscending ? "Descending" : "Ascending"}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}
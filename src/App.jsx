import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let winner=null;

function Square({ value, onSquareClick }) {
  return (
    <button className="float-left text-white font-semibold text-7xl h-[104px] mr-[-1px] mt-[-1px] p-0 text-center w-[104px] border-2 border-black" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function HandlePlay(i) {
    const currentSquares = squares.slice();

    if (calculateWinner(currentSquares) || currentSquares[i]) {
      return;
    }

    const nextSquares = currentSquares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  winner = calculateWinner(squares);
  let status;

  if (winner) {
    toast.success(`🦄 Winner is ${winner} `, {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="mb-[10px]">{status}</div>
      <div className="flex flex-col gap-1">
        <div className="clear-both content-[''] flex gap-1">
          <Square value={squares[0]} onSquareClick={() => HandlePlay(0)} />
          <Square value={squares[1]} onSquareClick={() => HandlePlay(1)} />
          <Square value={squares[2]} onSquareClick={() => HandlePlay(2)} />
        </div>
        <div className="clear-both content-[''] flex gap-1">
          <Square value={squares[3]} onSquareClick={() => HandlePlay(3)} />
          <Square value={squares[4]} onSquareClick={() => HandlePlay(4)} />
          <Square value={squares[5]} onSquareClick={() => HandlePlay(5)} />
        </div>
        <div className="clear-both content-[''] flex gap-1">
          <Square value={squares[6]} onSquareClick={() => HandlePlay(6)} />
          <Square value={squares[7]} onSquareClick={() => HandlePlay(7)} />
          <Square value={squares[8]} onSquareClick={() => HandlePlay(8)} />
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      if (move == 9 && !winner) {
        toast.success('Match is Draw', {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
    } else {
      description = 'Restart game';
      return (
        <li key={move}>
          <button className="absolute top-2 right-4 rounded-md p-1 border-2 text-white bg-blue-500 border-white shadow-lg" onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  return (
    <div className="flex flex-row">
       <div className='absolute left-0'>
            <ToastContainer />
        </div>
      <div className="game-board ">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="ml-[20px]">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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
      return squares[a];
    }
  }
  return null;
}

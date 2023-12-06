import { useState, createContext, useContext, useEffect } from "react";
import styled from "@emotion/styled";
import cross from "./cross.png";
import circle from "./circle.png";

/* Creating a Context to store the current state of the Board and the move number. */
export const SqsContext = createContext();

/*------Demonstrating usage of emotion's styled components------*/

/* Commented out styling of time-travel button */

/*
const Jump = styled.button`
  height: 60px;
  width: 300px;
  color: white;
  border: none;
  outline: none;
  font-size: larger;
  font-weight: light;
  text-align: center;
  border-radius: 10px;
  background-color: #212529;
`;
*/

const Message = styled.div`
  font-weight: bold;
  text-align: center;
  padding-bottom: 3%;
  font-size: larger;
`;

const Button = styled.button`
  color: #edf5e1;
  image-rendering: crisp-edges;
  align-items: center;
  image-rendering: pixelated;
  text-align: center;
  aspect-ratio: 1;
  border: 2.5px solid #6c6d7c;
  float: left;
  height: 180px; /* Adjusted height to be 6% of the viewport width */
  margin: -1px -1px 0 0;
  width: 180px;
  background-color: #212529;
  border-radius: 7.5px;
`;

const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 90%; /* Adjusted max-width to be 90% of the viewport */
  margin: 0 auto;
  padding: 0 5vw;
`;

const Box = styled.div`
  align-self: center;
  background: #6c757c;
  color: #fff;
  border-radius: 10px;
  margin: 2vh 1vw; /* Adjusted margin to be 2% of the viewport height and 1% of the viewport width */
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.6);
  padding: 2vh 2vw; /* Adjusted padding to be 2% of the viewport height and 2% of the viewport width */
`;

function Square({ value, onSquareClick }) {
  let sauce;

  if (value === "X") {
    sauce = cross;
  } else if (value === "O") {
    sauce = circle;
  }

  return (
    <>
      <Button onClick={onSquareClick}>{<img src={sauce}></img>}</Button>
    </>
  );
}

function Board({ onPlay }) {
  const { history, currentMove } = useContext(SqsContext);
  const squares = history[currentMove];
  const winner = calculateWinner(squares);
  let message;

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    autoPlay(nextSquares);
    onPlay(nextSquares);
  }

  // Function to randomly choose an empty position.
  function autoPlay(sqs) {
    let empties = [];
    for (let x = 0; x < sqs.length; x++) {
      if (sqs[x] === null) {
        empties.push(x);
      }
    }
    let n = empties[Math.floor(Math.random() * empties.length)];
    sqs[n] = "O";
  }

  // Added tie functionality using the currentMove variable.
  if (winner) {
    if (winner === "X") {
      message = "You Win!";
    } else if (winner === "O") {
      message = "Oops, You lost. Better luck next time!";
    }
  } else if (currentMove === 5) {
    message = "Not bad, it's a Tie!";
  }

  return (
    <>
      <Message>{message}</Message>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  function onPlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Commented out functionality to time-travel

  /*
  function jumpTo(currentMove) {
    setCurrentMove(currentMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <Jump onClick={() => jumpTo(move)}>{description}</Jump>
      </li>
    );
  });
*/

  useEffect(() => {
    console.log("UseEffect ran.");
  });

  return (
    /* Using the context here for the Board component to use. */
    <SqsContext.Provider value={{ history, currentMove }}>
      <Container>
        <Box>
          <Board onPlay={onPlay} />
        </Box>
      </Container>
    </SqsContext.Provider>
  );
}

/* Function to calculate winner with hardcoded possibilites */
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

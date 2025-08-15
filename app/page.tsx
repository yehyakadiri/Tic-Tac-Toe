"use client"
import { useEffect, useState } from "react";
import Cell from "./Components/cell";

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

export default function Home() {
  const [cells, setCells] = useState(Array(9).fill(""));
  const [go, setGo] = useState("circle");
  const [winnigMessage, setWinnigMessage] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [startingPlayer, setStartingPlayer] = useState("circle");

  useEffect(() => {
    let winnerFound = false;
    winningCombos.forEach((combo) => {
      const circleWins = combo.every((cell) => cells[cell] === "circle");
      const crossWins = combo.every((cell) => cells[cell] === "cross");

      if (circleWins) {
        setWinnigMessage(`${player1} (O) wins!`);
        setPlayer1Score((prev) => prev + 1);
        winnerFound = true;
      } else if (crossWins) {
        setWinnigMessage(`${player2} (X) wins!`);
        setPlayer2Score((prev) => prev + 1);
        winnerFound = true;
      }
    });

    if (!winnerFound && cells.every((cell) => cell !== "")) {
      setWinnigMessage("Draw!");
    }
  }, [cells]);

  const startGame = () => {
    if (player1.trim() && player2.trim()) {
      const randomStart = Math.random() < 0.5 ? "circle" : "cross";
      setGo(randomStart);
      setStartingPlayer(randomStart);
      setCells(Array(9).fill(""));
      setWinnigMessage("");
      setGameStarted(true);
    }
  };

  const resetGame = () => {
    const randomStart = Math.random() < 0.5 ? "circle" : "cross";
    setGo(randomStart);
    setStartingPlayer(randomStart);
    setCells(Array(9).fill(""));
    setWinnigMessage("");
  };

  return (
    <div className="container">
      {!gameStarted ? (
        <div className="start-screen">
          <h1>Tic-Tac-Toe</h1>
          <input
            type="text"
            placeholder="Player 1 name (O)"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          />
          <input
            type="text"
            placeholder="Player 2 name (X)"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          />
          <button onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <>
          <div className="scoreboard">
            <p>{player1} (O): {player1Score}</p>
            <p>{player2} (X): {player2Score}</p>
          </div>
          <div className="gameboard">
            {cells.map((cell, index) => (
              <Cell
                key={index}
                id={index}
                go={go}
                setGo={setGo}
                cells={cells}
                setCells={setCells}
                cell={cell}
                winnigMessage={winnigMessage}
              />
            ))}
          </div>
          <div className="status">
            {winnigMessage ? (
              <h2>{winnigMessage}</h2>
            ) : (
              <h2>It's {go === "circle" ? `${player1}` : `${player2}`}'s turn!</h2>
            )}
          </div>
          <button onClick={resetGame} className="reset-btn">Play Again</button>
        </>
      )}
    </div>
  );
}

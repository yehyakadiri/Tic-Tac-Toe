"use client";
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
  [2, 4, 6],
];

export default function Home() {
  const [cells, setCells] = useState(Array(9).fill(""));
  const [go, setGo] = useState("circle");
  const [winningMessage, setWinningMessage] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<"pvp" | "ai" | null>(null);

  useEffect(() => {
    let winnerFound = false;

    winningCombos.forEach((combo) => {
      const circleWins = combo.every((cell) => cells[cell] === "circle");
      const crossWins = combo.every((cell) => cells[cell] === "cross");

      if (circleWins) {
        setWinningMessage(`${player1} (O) wins!`);
        setPlayer1Score((prev) => prev + 1);
        winnerFound = true;
      } else if (crossWins) {
        setWinningMessage(`${player2} (X) wins!`);
        setPlayer2Score((prev) => prev + 1);
        winnerFound = true;
      }
    });

    if (!winnerFound && cells.every((cell) => cell !== "")) {
      setWinningMessage("Draw!");
    }

    // Smarter AI move
    if (!winnerFound && gameMode === "ai" && go === "cross" && !winningMessage) {
      setTimeout(() => {
        const emptyCells = cells
          .map((cell, i) => (cell === "" ? i : null))
          .filter((i) => i !== null) as number[];

        if (emptyCells.length === 0) return;
        const newCells = [...cells];

        // 1. Check if AI can win
        for (const combo of winningCombos) {
          const [a, b, c] = combo;
          const values = [newCells[a], newCells[b], newCells[c]];
          if (values.filter((v) => v === "cross").length === 2 && values.includes("")) {
            const idx = combo[values.indexOf("")];
            newCells[idx] = "cross";
            setCells(newCells);
            setGo("circle");
            return;
          }
        }

        // 2. Block player from winning
        for (const combo of winningCombos) {
          const [a, b, c] = combo;
          const values = [newCells[a], newCells[b], newCells[c]];
          if (values.filter((v) => v === "circle").length === 2 && values.includes("")) {
            const idx = combo[values.indexOf("")];
            newCells[idx] = "cross";
            setCells(newCells);
            setGo("circle");
            return;
          }
        }

        // 3. Take center if free
        if (newCells[4] === "") {
          newCells[4] = "cross";
          setCells(newCells);
          setGo("circle");
          return;
        }

        // 4. Take a corner if free
        const corners = [0, 2, 6, 8];
        const freeCorners = corners.filter((i) => newCells[i] === "");
        if (freeCorners.length > 0) {
          const move = freeCorners[Math.floor(Math.random() * freeCorners.length)];
          newCells[move] = "cross";
          setCells(newCells);
          setGo("circle");
          return;
        }

        // 5. Otherwise, pick random
        const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        newCells[randomMove] = "cross";
        setCells(newCells);
        setGo("circle");
      }, 500); // delay for realism
    }
  }, [cells, player1, player2, go, gameMode, winningMessage]);

  const startGame = () => {
    if (gameMode === "pvp" && (!player1.trim() || !player2.trim())) return;
    if (gameMode === "ai" && !player1.trim()) return;

    const randomStart = Math.random() < 0.5 ? "circle" : "cross";
    setGo(randomStart);
    setCells(Array(9).fill(""));
    setWinningMessage("");
    setGameStarted(true);

    if (gameMode === "ai") {
      setPlayer2("Computer");
    }
  };

  const resetGame = () => {
    const randomStart = Math.random() < 0.5 ? "circle" : "cross";
    setGo(randomStart);
    setCells(Array(9).fill(""));
    setWinningMessage("");
  };

  return (
    <div className="container">
      {!gameStarted ? (
        <div className="start-screen">
          <h1>Tic-Tac-Toe</h1>

          {!gameMode && (
            <>
              <button onClick={() => setGameMode("pvp")}>2 Players</button>
              <button
                onClick={() => {
                  setGameMode("ai");
                  setPlayer2("Computer");
                }}
              >
                Play vs Computer
              </button>
            </>
          )}

          {gameMode === "pvp" && (
            <>
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
            </>
          )}

          {gameMode === "ai" && (
            <>
              <input
                type="text"
                placeholder="Your Name (O)"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
              />
              <button onClick={startGame}>Start Game</button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="scoreboard">
            <p>
              {player1} (O): {player1Score}
            </p>
            <p>
              {player2} (X): {player2Score}
            </p>
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
                winningMessage={winningMessage}
              />
            ))}
          </div>

          <div className="status">
            {winningMessage ? (
              <h2>{winningMessage}</h2>
            ) : (
              <h2>{`It's ${go === "circle" ? player1 : player2}'s turn!`}</h2>
            )}
          </div>

          <button onClick={resetGame} className="reset-btn">
            Play Again
          </button>
        </>
      )}
    </div>
  );
}

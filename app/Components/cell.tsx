import { Dispatch, SetStateAction } from "react";

type CellProps = {
  id: number;
  go: string;
  setGo: Dispatch<SetStateAction<string>>;
  cells: string[];
  setCells: Dispatch<SetStateAction<string[]>>;
  cell: string;
  winnigMessage: string;
};

const Cell = ({ id, go, setGo, cells, setCells, cell, winnigMessage }: CellProps) => {
  const handleClick = () => {
    if (winnigMessage || cells[id]) return;

    const newCells = [...cells];
    newCells[id] = go;
    setCells(newCells);

    setGo(go === "circle" ? "cross" : "circle");
  };

  return (
    <div className="square" onClick={handleClick}>
      {cell && <span className={cell}>{cell === "circle" ? "O" : "X"}</span>}
    </div>
  );
};

export default Cell;


import React, { useState, useEffect, useCallback } from 'react';
import { AgletIcon } from './components/AgletIcon';
import { 
  Board, 
  Position, 
  AgletItem 
} from './types';
import { 
  createBoard, 
  checkMatches, 
  applyGravity, 
  refillBoard, 
  GRID_SIZE 
} from './services/gameLogic';

const App: React.FC = () => {
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<Position | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(25);

  // Initialize game
  useEffect(() => {
    setBoard(createBoard());
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (isProcessing || moves <= 0) return;

    if (!selected) {
      setSelected({ row, col });
    } else {
      const distance = Math.abs(selected.row - row) + Math.abs(selected.col - col);
      if (distance === 1) {
        swapAndProcess(selected, { row, col });
      } else {
        setSelected({ row, col });
      }
    }
  };

  const swapAndProcess = async (pos1: Position, pos2: Position) => {
    setIsProcessing(true);
    setSelected(null);

    // Swap
    const newBoard = board.map(r => [...r]);
    const temp = newBoard[pos1.row][pos1.col];
    newBoard[pos1.row][pos1.col] = newBoard[pos2.row][pos2.col];
    newBoard[pos2.row][pos2.col] = temp;
    setBoard(newBoard);

    // Wait for animation
    await new Promise(r => setTimeout(r, 300));

    const matches = checkMatches(newBoard);
    if (matches.length > 0) {
      setMoves(m => m - 1);
      processMatches(newBoard);
    } else {
      // Swap back if no matches
      const revertedBoard = board.map(r => [...r]);
      const temp2 = revertedBoard[pos1.row][pos1.col];
      revertedBoard[pos1.row][pos1.col] = revertedBoard[pos2.row][pos2.col];
      revertedBoard[pos2.row][pos2.col] = temp2;
      setBoard(revertedBoard);
      setIsProcessing(false);
    }
  };

  const processMatches = async (currentBoard: Board) => {
    let boardToProcess = currentBoard;
    let totalScoreGain = 0;

    while (true) {
      const matches = checkMatches(boardToProcess);
      if (matches.length === 0) break;

      totalScoreGain += matches.length * 10;
      
      // Clear matches
      const clearedBoard = boardToProcess.map((rowArr, r) => 
        rowArr.map((cell, c) => 
          matches.some(m => m.row === r && m.col === c) ? null : cell
        )
      );
      setBoard(clearedBoard);
      await new Promise(r => setTimeout(r, 400));

      // Gravity
      const gravityBoard = applyGravity(clearedBoard);
      setBoard(gravityBoard);
      await new Promise(r => setTimeout(r, 400));

      // Refill
      boardToProcess = refillBoard(gravityBoard);
      setBoard(boardToProcess);
      await new Promise(r => setTimeout(r, 400));
    }

    setScore(s => s + totalScoreGain);
    setIsProcessing(false);

    if (moves <= 0) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setBoard(createBoard());
    setScore(0);
    setMoves(25);
    setGameOver(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
      {/* Header Info */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-700">
        <div className="flex flex-col">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Score</span>
          <span className="text-3xl font-black text-indigo-400">{score}</span>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            AGLET MATCH
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Shoelace Stylist</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Moves</span>
          <span className={`text-3xl font-black ${moves < 5 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
            {moves}
          </span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative p-2 bg-slate-800 rounded-2xl shadow-2xl border-4 border-slate-700">
        <div 
          className="grid gap-1 md:gap-2"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(90vw, 480px)',
            height: 'min(90vw, 480px)'
          }}
        >
          {board.map((row, r) => 
            row.map((aglet, c) => (
              <div 
                key={aglet?.id || `empty-${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`
                  relative flex items-center justify-center rounded-lg cursor-pointer
                  transition-all duration-300 transform active:scale-95
                  ${selected?.row === r && selected?.col === c ? 'bg-indigo-500/30 scale-110 z-10 ring-2 ring-indigo-400 shadow-lg' : 'bg-slate-700/50 hover:bg-slate-600/50'}
                  ${!aglet ? 'opacity-0 scale-50' : 'opacity-100'}
                `}
              >
                {aglet && (
                  <div className={`${selected?.row === r && selected?.col === c ? 'aglet-pulse' : ''}`}>
                    <AgletIcon type={aglet.type} size={50} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm z-50">
            <h2 className="text-5xl font-black text-white mb-2">TIME'S UP!</h2>
            <p className="text-slate-400 mb-8 text-xl">Final Score: <span className="text-indigo-400 font-bold">{score}</span></p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-bold text-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Footer / Controls */}
      <div className="mt-8 flex gap-4">
        <button 
          onClick={resetGame}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-full font-bold text-sm text-slate-300 transition-colors"
        >
          Restart
        </button>
        <div className="flex items-center gap-2 px-6 py-2 bg-slate-800 rounded-full border border-slate-700">
           <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Matching System Active</span>
        </div>
      </div>

      <div className="mt-6 max-w-md text-center">
        <p className="text-slate-500 text-xs italic">
          Tip: Match 3 or more stylish aglets of the same design horizontally or vertically to clear them from the board. High-end shoelace tips await your curation!
        </p>
      </div>
    </div>
  );
};

export default App;

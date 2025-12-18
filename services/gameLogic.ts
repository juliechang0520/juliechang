
import { AgletType, AgletItem, Board, Position } from '../types';

export const GRID_SIZE = 8;

export const generateRandomAglet = (): AgletItem => {
  const types = Object.values(AgletType);
  const randomType = types[Math.floor(Math.random() * types.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: randomType,
  };
};

export const createBoard = (): Board => {
  const board: Board = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    board[r] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      let aglet = generateRandomAglet();
      // Simple loop to avoid starting with matches
      while (
        (c >= 2 && board[r][c - 1]?.type === aglet.type && board[r][c - 2]?.type === aglet.type) ||
        (r >= 2 && board[r - 1][c]?.type === aglet.type && board[r - 2][c]?.type === aglet.type)
      ) {
        aglet = generateRandomAglet();
      }
      board[r][c] = aglet;
    }
  }
  return board;
};

export const checkMatches = (board: Board): Position[] => {
  const matches: Position[] = [];

  // Horizontal matches
  for (let r = 0; r < GRID_SIZE; r++) {
    let matchCount = 1;
    for (let c = 0; c < GRID_SIZE; c++) {
      if (c > 0 && board[r][c]?.type === board[r][c - 1]?.type) {
        matchCount++;
      } else {
        if (matchCount >= 3) {
          for (let i = 1; i <= matchCount; i++) {
            matches.push({ row: r, col: c - i });
          }
        }
        matchCount = 1;
      }
    }
    if (matchCount >= 3) {
      for (let i = 1; i <= matchCount; i++) {
        matches.push({ row: r, col: GRID_SIZE - i });
      }
    }
  }

  // Vertical matches
  for (let c = 0; c < GRID_SIZE; c++) {
    let matchCount = 1;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (r > 0 && board[r][c]?.type === board[r - 1][c]?.type) {
        matchCount++;
      } else {
        if (matchCount >= 3) {
          for (let i = 1; i <= matchCount; i++) {
            matches.push({ row: r - i, col: c });
          }
        }
        matchCount = 1;
      }
    }
    if (matchCount >= 3) {
      for (let i = 1; i <= matchCount; i++) {
        matches.push({ row: GRID_SIZE - i, col: c });
      }
    }
  }

  // Deduplicate matches
  const uniqueMatches = Array.from(new Set(matches.map(m => `${m.row}-${m.col}`)))
    .map(s => {
      const [row, col] = s.split('-').map(Number);
      return { row, col };
    });

  return uniqueMatches;
};

export const applyGravity = (board: Board): Board => {
  const newBoard = board.map(row => [...row]);
  for (let c = 0; c < GRID_SIZE; c++) {
    let emptyRow = GRID_SIZE - 1;
    for (let r = GRID_SIZE - 1; r >= 0; r--) {
      if (newBoard[r][c] !== null) {
        const temp = newBoard[r][c];
        newBoard[r][c] = null;
        newBoard[emptyRow][c] = temp;
        emptyRow--;
      }
    }
  }
  return newBoard;
};

export const refillBoard = (board: Board): Board => {
  return board.map(row => row.map(cell => cell === null ? generateRandomAglet() : cell));
};

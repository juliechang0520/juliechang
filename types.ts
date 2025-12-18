
export enum AgletType {
  GOLD = 'GOLD',
  SILVER = 'SILVER',
  NEON_PINK = 'NEON_PINK',
  POLKA_DOT = 'POLKA_DOT',
  STRIPED = 'STRIPED',
  MATTE_BLACK = 'MATTE_BLACK'
}

export interface Position {
  row: number;
  col: number;
}

export interface AgletItem {
  id: string;
  type: AgletType;
}

export type Board = (AgletItem | null)[][];

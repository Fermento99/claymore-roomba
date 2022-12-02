import { TileState } from './TileState';

export interface BoardState {
  board: TileState[][];
  height: number;
  width: number;
}

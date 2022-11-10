import { getNeighbours } from './neighbours';
import { TileState } from '../models/TileState';

export const openTile = (
  point: { x: number; y: number },
  boardState: { board: TileState[][]; height: number; width: number }
): TileState[][] => {
  const { x, y } = point;
  const { board, width, height } = boardState;
  board[y][x].setOpen();
  if (board[y][x].proximity === 0) {
    getNeighbours(x, y, height, width).forEach(([y, x]) => {
      if (!board[y][x].open)
        return openTile({ x, y }, { board, height, width });
    });
  }
  return board;
};

export const checkLost = (
  point: { x: number; y: number },
  board: TileState[][]
): boolean => {
  return board[point.y][point.x].bomb;
};

export const checkWon = (boardState: {
  board: TileState[][];
  bombs: number;
}): boolean => {
  const { flaggedBombs, closed } = boardState.board.reduce(
    (acc, row) => {
      const { flaggedBombs, closed } = row.reduce(
        (acc, tile) => ({
          flaggedBombs: acc.flaggedBombs + (tile.flagged && tile.bomb ? 1 : 0),
          closed: acc.closed + (!tile.open ? 1 : 0),
        }),
        { flaggedBombs: 0, closed: 0 }
      );
      return {
        flaggedBombs: acc.flaggedBombs + flaggedBombs,
        closed: acc.closed + closed,
      };
    },
    { flaggedBombs: 0, closed: 0 }
  );

  return flaggedBombs === boardState.bombs || closed === boardState.bombs;
};

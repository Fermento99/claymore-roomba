import { getNeighbours } from './neighbours';
import { TileState } from '../models/TileState';
import { randNoRep } from './random';

interface BoardState {
  board: TileState[][];
  height: number;
  width: number;
}

interface Point {
  x: number;
  y: number;
}

export const generateBoard = (
  point: Point,
  boardState: BoardState,
  bombs: number
): TileState[][] => {
  const { width, height, board } = boardState;
  const bombLocations = randNoRep(0, height * width, bombs, [
    point.y * width + point.x,
  ]).map((index) => [Math.floor(index / width), index % width]);
  bombLocations.forEach(([y, x]) => {
    board[y][x].bomb = true;
    getNeighbours(x, y, height, width).forEach(
      ([y, x]) => board[y][x].proximity++
    );
  });
  return board;
};

export const openTile = (
  point: Point,
  boardState: BoardState
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

export const checkLost = (point: Point, board: TileState[][]): boolean => {
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

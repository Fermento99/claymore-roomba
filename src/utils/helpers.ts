import { TileState } from '../models/TileState';
import { getNeighbours } from './neighbours';
import { openTile } from './mechanics';

const autoFlag = ({
  board,
  width,
  height,
}: {
  board: TileState[][];
  width: number;
  height: number;
}): number => {
  let changed = 0;
  board.forEach((row, y) =>
    row.forEach((tile, x) => {
      const closedNeighbours = getNeighbours({ x, y }, height, width).filter(
        ({ y, x }) => !board[y][x].open
      );
      if (closedNeighbours.length === tile.proximity) {
        const notFlaggedNeighbours = closedNeighbours.filter(
          ({ y, x }) => !board[y][x].flagged
        );
        changed += notFlaggedNeighbours.length;
        notFlaggedNeighbours.forEach(({ y, x }) => !board[y][x].toggleFlag());
      }
    })
  );
  return changed;
};

const autoOpen = ({
  board,
  width,
  height,
}: {
  board: TileState[][];
  width: number;
  height: number;
}): boolean => {
  let changed = false;
  board.forEach((row, y) =>
    row.forEach((tile, x) => {
      const neighbours = getNeighbours({ x, y }, height, width);
      const flaggedNeighbours = neighbours.filter(
        ({ y, x }) => board[y][x].flagged
      );
      const closedNeighbours = neighbours.filter(
        ({ y, x }) => !board[y][x].open
      );
      if (
        flaggedNeighbours.length === tile.proximity &&
        closedNeighbours.length > 0
      ) {
        changed = true;
        neighbours.forEach((point) =>
          openTile(point, { board, width, height })
        );
      }
    })
  );
  return changed;
};

export const autoLoop = (boardState: {
  board: TileState[][];
  width: number;
  height: number;
}): number => {
  let opened = true,
    flagged = 0,
    newFlags;
  do {
    newFlags = 0;
    while (opened) {
      opened = autoOpen(boardState);
      console.log(opened);
    }
    newFlags = autoFlag(boardState);
    flagged += newFlags;
    console.log(newFlags);
  } while (newFlags !== 0);
  return flagged;
};

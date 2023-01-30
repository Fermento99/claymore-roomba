import { TileState } from './TileState';
import { Point } from './Point';
import { randNoRep } from '../utils/random';
import { GameConfig } from './GameConfig';

export class GameState {
  board: TileState[][] = [];
  height: number = 0;
  width: number = 0;
  bombs: number = 0;
  flags: number = 0;

  constructor({ width = 0, height = 0, bombs = 0 }: GameConfig) {
    this.height = height;
    this.width = width;
    this.bombs = bombs;
    this._generateEmptyBoard();
  }

  resetGameState() {
    this.flags = 0;
    this._generateEmptyBoard();
  }

  copyBoardState(): TileState[][] {
    return this.board.map((row) => row.map((tile) => new TileState(tile)));
  }

  getRemainingBombCount(): number {
    return this.bombs - this.flags;
  }

  checkWon(): boolean {
    const { flaggedBombs, closed } = this.board.reduce(
      (acc, row) => {
        const { flaggedBombs, closed } = row.reduce(
          (acc, tile) => ({
            flaggedBombs:
              acc.flaggedBombs + (tile.flagged && tile.bomb ? 1 : 0),
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

    return (
      (flaggedBombs === this.bombs && this.bombs === this.flags) ||
      closed === this.bombs
    );
  }
  checkLost(point: Point): boolean {
    const { bomb, flagged } = this.tile(point);
    return bomb && !flagged;
  }

  _generateEmptyBoard() {
    this.board = Array(this.height)
      .fill(0)
      .map(() =>
        Array(this.width)
          .fill(0)
          .map(() => new TileState())
      );
  }

  generateBombs({ x, y }: Point) {
    const { width, height, bombs } = this;
    randNoRep(0, height * width, bombs, [y * width + x])
      .map((index) => ({ y: Math.floor(index / width), x: index % width }))
      .forEach((point) => {
        this.tile(point).bomb = true;
        this.getNeighbours(point).forEach(
          (point) => this.tile(point).proximity++
        );
      });
  }
  openTile(point: Point) {
    this.tile(point).setOpen();
    if (this.tile(point).proximity === 0) {
      this.getNeighbours(point).forEach((point) => {
        if (!this.tile(point).open) return this.openTile(point);
      });
    }
  }

  getNeighbours({ x, y }: Point): Point[] {
    const out: Point[] = [];
    const { height, width } = this;

    if (x > 0) {
      if (y > 0) out.push({ y: y - 1, x: x - 1 });
      out.push({ y, x: x - 1 });
      if (y < height - 1) out.push({ y: y + 1, x: x - 1 });
    }
    if (y > 0) out.push({ y: y - 1, x });
    if (y < height - 1) out.push({ y: y + 1, x });
    if (x < width - 1) {
      if (y > 0) out.push({ y: y - 1, x: x + 1 });
      out.push({ y, x: x + 1 });
      if (y < height - 1) out.push({ y: y + 1, x: x + 1 });
    }

    return out;
  }

  tile({ x, y }: Point): TileState {
    return this.board[y][x];
  }

  flagTile(point: Point) {
    this.flags += this.tile(point).toggleFlag();
  }
}

import { TileState } from './TileState';
import { Point } from './Point';
import { randNoRep } from '../utils/random';
import { GameConfig } from './GameConfig';

/** Class storing and managing game state */
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

  /** Method prepares GameState for next game with the same configuration */
  resetGameState() {
    this.flags = 0;
    this._generateEmptyBoard();
  }

  /** Method generates empty board */
  _generateEmptyBoard() {
    this.board = Array(this.height)
      .fill(0)
      .map(() =>
        Array(this.width)
          .fill(0)
          .map(() => new TileState())
      );
  }

  /**
   * Method used to fetch a copy of board (e.g. to render it)
   * @returns copy of the board
   */
  copyBoardState(): TileState[][] {
    return this.board.map((row) => row.map((tile) => new TileState(tile)));
  }

  /**
   * Method for fetching supposed number of bombs left to be flagged
   * @returns number of not flagged bombs
   */
  getRemainingBombCount(): number {
    return this.bombs - this.flags;
  }

  /**
   * Method used to check if win condition is satisfied
   * @returns True if the game is won, false otherwise
   */
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

  /**
   * Method used to check if game would be lost if the point was opened
   * @param point - point to be opened
   * @returns True if the game would be lost, false otherwise
   */
  checkLost(point: Point): boolean {
    const { bomb, flagged } = this.tile(point);
    return bomb && !flagged;
  }

  /**
   * Method generates set number of bombs (acquired from config) on the whole board aside from given point
   * @param point - point to be omitted during generating the bombs
   */
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

  /**
   * Method opens given point on the board
   * @throws Error if the point has a bomb
   */
  openTile(point: Point) {
    this.tile(point).setOpen();
    if (this.tile(point).proximity === 0) {
      this.getNeighbours(point).forEach((point) => {
        if (!this.tile(point).open) return this.openTile(point);
      });
    }
  }

  /**
   * Method returns neighbours of given point
   * @param point - point of which neighbours will be returned
   * @returns list of points being list of neighbours
   */
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

  /**
   * Method used for getting point state
   * @param point - point of which state is needed
   * @returns point state
   */
  tile({ x, y }: Point): TileState {
    return this.board[y][x];
  }

  /**
   * Method used for flagging points
   * @param point - point to be flagged
   */
  flagTile(point: Point) {
    this.flags += this.tile(point).toggleFlag();
  }
}

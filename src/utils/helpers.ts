import { GameState } from '../models/GameState';
import { Point } from '../models/Point';

const autoOpen = (gameState: GameState): boolean => {
  let changed = false;
  for (let x = 0; x < gameState.width; x++) {
    for (let y = 0; y < gameState.height; y++) {
      const tile = gameState.tile({ x, y });
      if (tile.open && tile.proximity !== 0) {
        const neighbours = gameState.getNeighbours({ x, y });
        const { closedNeighbours, flaggedNeighbours } = neighbours.reduce(
          (acc, curr) => {
            const { open, flagged } = gameState.tile(curr);
            if (flagged) acc.flaggedNeighbours.push(curr);
            else if (!open) acc.closedNeighbours.push(curr);
            return acc;
          },
          { closedNeighbours: [] as Point[], flaggedNeighbours: [] as Point[] }
        );
        if (
          flaggedNeighbours.length === tile.proximity &&
          closedNeighbours.length > 0
        ) {
          closedNeighbours.forEach((neighbour) => {
            gameState.openTile(neighbour);
            console.log(
              `because of point (${x}, ${y}) open point (${neighbour.x}, ${neighbour.y})`
            );
          });
          changed = true;
        } else if (
          closedNeighbours.length + flaggedNeighbours.length ===
            tile.proximity &&
          closedNeighbours.length > 0
        ) {
          closedNeighbours.forEach((neighbour) => {
            gameState.flagTile(neighbour);
            console.log(
              `because of point (${x}, ${y}) flag point (${neighbour.x}, ${neighbour.y})`
            );
          });
          changed = true;
        }
      }
    }
  }
  return changed;
};

export const autoLoop = (gameState: GameState) => {
  let opened = true;
  let loops = 0;
  do {
    opened = autoOpen(gameState);
    loops++;
  } while (opened);
  console.log(`done ${loops} loops`);
};

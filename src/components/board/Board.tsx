import { ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import { Tile } from './components/Tile';
import { TileState } from '../../models/TileState';
import { randNoRep } from '../../utils/random';
import { getNeighbours } from '../../utils/neighbours';
import { GameConfig } from '../../models/GameConfig';
import { GameStatus } from '../../models/GameStatus';

interface BoardProps {
  gameConfig: GameConfig;
  finishedCallback: (result: GameStatus) => void;
}

export const Board = ({
  gameConfig: { width, height, bombs },
  finishedCallback,
}: BoardProps) => {
  const [ended, setEnded] = useState(false);
  const [firstMoveMade, makeFirstMoveMade] = useState(false);
  const [boardState, setBoardState] = useState<TileState[][]>(
    Array(height)
      .fill(0)
      .map(() =>
        Array(width)
          .fill(0)
          .map(() => new TileState())
      )
  );

  const renderRows = (board: TileState[][]): ReactNode => {
    return board.map((row, y) => (
      <Row key={y}>
        {row.map((state, x) => (
          <Tile
            ended={ended}
            state={state}
            click={callback(x, y)}
            key={x + '-' + y}
          />
        ))}
      </Row>
    ));
  };

  const checkLost = (x: number, y: number): boolean => {
    if (boardState[y][x].bomb) {
      setEnded(true);
      finishedCallback(GameStatus.LOST);
      return true;
    }

    return false;
  };
  const checkWon = () => {
    const { flaggedBombs, closed } = boardState.reduce(
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
    console.log(flaggedBombs, closed, bombs);
    if (flaggedBombs === bombs || closed === bombs) {
      setEnded(true);
      finishedCallback(GameStatus.WON);
    }
  };

  const openTile = (x: number, y: number) => {
    boardState[y][x].setOpen();
    if (boardState[y][x].proximity === 0) {
      getNeighbours(x, y, height, width).forEach(([y, x]) => {
        if (!boardState[y][x].open) openTile(x, y);
      });
    }
  };

  const callback = (x: number, y: number) =>
    firstMoveMade
      ? (alt: boolean) => {
          if (alt) boardState[y][x].toggleFlag();
          else {
            if (!checkLost(x, y)) openTile(x, y);
          }
          checkWon();
          setBoardState([...boardState]);
        }
      : ended
      ? () => {}
      : () => {
          makeFirstMoveMade(true);
          const bombLocations = randNoRep(0, height * width, bombs, [
            y * width + x,
          ]).map((index) => [Math.floor(index / width), index % width]);
          bombLocations.forEach(([y, x]) => {
            boardState[y][x].bomb = true;
            getNeighbours(x, y, height, width).forEach(
              ([y, x]) => boardState[y][x].proximity++
            );
          });
          openTile(x, y);
          setBoardState([...boardState]);
        };

  return <BoardContainer>{renderRows(boardState)}</BoardContainer>;
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: min-content;
`;

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 3px inset #888;
  width: min-content;
`;

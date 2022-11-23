import { ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import { Tile } from './components/Tile';
import { TileState } from '../../models/TileState';
import { randNoRep } from '../../utils/random';
import { getNeighbours } from '../../utils/neighbours';
import { GameConfig } from '../../models/GameConfig';
import { GameStatus } from '../../models/GameStatus';
import { checkLost, checkWon, openTile } from '../../utils/base-mechanics';

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

  const callback = (x: number, y: number) =>
    firstMoveMade
      ? (alt: boolean) => {
          let board = boardState;
          if (alt) board[y][x].toggleFlag();
          else {
            if (checkLost({ x, y }, boardState)) {
              setEnded(true);
              finishedCallback(GameStatus.LOST);
            } else {
              board = openTile({ x, y }, { board, height, width });
            }
          }
          if (checkWon({ board, bombs })) {
            setEnded(true);
            finishedCallback(GameStatus.WON);
          }
          setBoardState([...board]);
        }
      : ended
      ? () => {}
      : () => {
          //TODO: refactor
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
          openTile({ x, y }, { board: boardState, height, width });
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
  border: 3px inset #4d535e;
  width: min-content;
`;

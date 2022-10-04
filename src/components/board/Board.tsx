import { ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import { Tile } from './components/Tile';
import { TileState } from '../../models/TileState';
import { randNoRep } from '../../utils/random';
import { getNeighbours } from '../../utils/neighbours';

interface BoardProps {
  width: number;
  height: number;
  bombs: number;
}

export const Board = ({ width, height, bombs }: BoardProps) => {
  const [ended, end] = useState(0);
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
            ended={ended !== 0}
            state={state}
            click={callback(x, y)}
            key={x + '-' + y}
          />
        ))}
      </Row>
    ));
  };

  const openTile = (x: number, y: number, board: TileState[][]) => {
    board[y][x].setOpen();
    if (board[y][x].proximity === 0) {
      getNeighbours(x, y, height, width).forEach(([y, x]) => {
        if (!board[y][x].open) openTile(x, y, board);
      });
    }
  };

  const callback = (x: number, y: number) =>
    firstMoveMade
      ? (alt: boolean) => {
          alt
            ? boardState[y][x].toggleFlag()
            : boardState[y][x].bomb
            ? end(-1)
            : openTile(x, y, boardState);
          setBoardState([...boardState]);
        }
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
          openTile(x, y, boardState);
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
`;

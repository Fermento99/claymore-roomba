import { ReactNode, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Tile } from './components/Tile';
import { TileState } from '../../models/TileState';
import { GameConfig } from '../../models/GameConfig';
import { GameStatus } from '../../models/GameStatus';
import { Button } from '../Button';
import { GameState } from '../../models/GameState';
import { Point } from '../../models/Point';
import { autoLoop } from '../../utils/helpers';

interface BoardProps {
  gameConfig: GameConfig;
  finishedCallback: (result: GameStatus) => void;
}

export const Board = ({ gameConfig, finishedCallback }: BoardProps) => {
  const gameState = useMemo(() => new GameState(gameConfig), [gameConfig]);
  const [ended, setEnded] = useState(false);
  const [firstMoveMade, makeFirstMoveMade] = useState(false);
  const [flaggedCount, setFlaggedCount] = useState(gameConfig.bombs);
  const [boardState, setBoardState] = useState<TileState[][]>(
    gameState.copyBoardState()
  );

  const resetState = () => {
    setEnded(false);
    makeFirstMoveMade(false);
    gameState.resetGameState();
    setBoardState(gameState.copyBoardState());
    setFlaggedCount(gameConfig.bombs);
    finishedCallback(GameStatus.STARTED);
  };

  const renderRows = (board: TileState[][]): ReactNode => {
    return board.map((row, y) => (
      <BoardRow key={y}>
        {row.map((state, x) => (
          <Tile
            ended={ended}
            state={state}
            click={callback({ x, y })}
            key={x + '-' + y}
          />
        ))}
      </BoardRow>
    ));
  };

  const callback = (point: Point) =>
    !firstMoveMade
      ? () => {
          makeFirstMoveMade(true);
          gameState.generateBombs(point);
          gameState.openTile(point);
          autoLoop(gameState);
          setFlaggedCount(gameState.getRemainingBombCount());
          setBoardState(gameState.copyBoardState());
        }
      : ended
      ? () => {}
      : (alt: boolean) => {
          if (alt) {
            gameState.flagTile(point);
            try {
              autoLoop(gameState);
            } catch (e) {
              console.error(e);
              setEnded(true);
              finishedCallback(GameStatus.LOST);
            }
            setFlaggedCount(gameState.getRemainingBombCount());
          } else {
            if (gameState.checkLost(point)) {
              setEnded(true);
              finishedCallback(GameStatus.LOST);
            } else {
              gameState.openTile(point);
              try {
                autoLoop(gameState);
              } catch (e) {
                console.error(e);
                setEnded(true);
                finishedCallback(GameStatus.LOST);
              }
            }
          }
          if (gameState.checkWon()) {
            setEnded(true);
            finishedCallback(GameStatus.WON);
          }
          setFlaggedCount(gameState.getRemainingBombCount());
          setBoardState(gameState.copyBoardState());
        };

  return (
    <>
      <HeaderRow>
        <Button onClick={() => resetState()}>Restart</Button>
        <p>Bombs left:</p>
        <Button disabled>
          <strong>
            {flaggedCount >= 0
              ? flaggedCount.toString().padStart(2, '0')
              : '??'}
          </strong>
        </Button>
      </HeaderRow>
      <BoardContainer>{renderRows(boardState)}</BoardContainer>
    </>
  );
};

const BoardRow = styled.div`
  display: flex;
  flex-direction: row;
  width: min-content;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > p {
    font-size: 10px;
  }

  > p + button {
    margin-left: 0.25em;
  }
`;

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 3px inset #4d535e;
  width: min-content;
`;

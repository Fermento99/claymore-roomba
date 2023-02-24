import { ReactNode, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Tile } from './components/Tile';
import { TileState } from '../../models/TileState';
import { GameConfig } from '../../models/GameConfig';
import { GameStatus } from '../../models/GameStatus';
import { Button } from '../Button';
import { GameState } from '../../models/GameState';
import { Point } from '../../models/Point';
import { autoLoop, autoOpen } from '../../utils/helpers';

interface BoardProps {
  gameConfig: GameConfig;
  finishedCallback: (result: GameStatus) => void;
}

export const Board = ({ gameConfig, finishedCallback }: BoardProps) => {
  const gameState = useMemo(() => new GameState(gameConfig), [gameConfig]);
  const [ended, setEnded] = useState(false);
  const [firstMoveMade, makeFirstMoveMade] = useState(false);
  const [autoLoopMode, setAutoLoopMode] = useState(false);
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

  const renderRows = (board: TileState[][]): ReactNode =>
    board.map((row, y) => (
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

  const callback = (point: Point) =>
    !firstMoveMade
      ? () => {
          makeFirstMoveMade(true);
          gameState.generateBombs(point);
          gameState.openTile(point);
          if (autoLoopMode) {
            autoLoop(gameState);
            setFlaggedCount(gameState.getRemainingBombCount());
          }
          setBoardState(gameState.copyBoardState());
        }
      : ended
      ? () => {}
      : (alt: boolean) => {
          if (alt) {
            gameState.flagTile(point);
            if (autoLoopMode) {
              try {
                autoLoop(gameState);
              } catch (e) {
                console.error(e);
                setEnded(true);
                finishedCallback(GameStatus.LOST);
              }
              setFlaggedCount(gameState.getRemainingBombCount());
            }
          } else {
            if (gameState.checkLost(point)) {
              setEnded(true);
              finishedCallback(GameStatus.LOST);
            } else {
              gameState.openTile(point);
              if (autoLoopMode) {
                try {
                  autoLoop(gameState);
                } catch (e) {
                  console.error(e);
                  setEnded(true);
                  finishedCallback(GameStatus.LOST);
                }
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

  const runAutoOnce = () => {
    try {
      autoOpen(gameState);
    } catch (e) {
      console.error(e);
      setEnded(true);
      finishedCallback(GameStatus.LOST);
    }
    setFlaggedCount(gameState.getRemainingBombCount());
    setBoardState(gameState.copyBoardState());
    if (gameState.checkWon()) {
      setEnded(true);
      finishedCallback(GameStatus.WON);
    }
  };

  return (
    <>
      <ButtonRow>
        <p>Bombs left:</p>
        <Button disabled>
          <strong>
            {flaggedCount >= 0
              ? flaggedCount.toString().padStart(2, '0')
              : '??'}
          </strong>
        </Button>
      </ButtonRow>
      <ButtonRow>
        <Button
          active={autoLoopMode}
          onClick={() => setAutoLoopMode(!autoLoopMode)}
        >
          auto loop: {autoLoopMode ? 'on' : 'off'}
        </Button>
        <Button onClick={() => runAutoOnce()}>run auto once</Button>
      </ButtonRow>
      <BoardContainer>{renderRows(boardState)}</BoardContainer>
      <ButtonRow>
        <Button onClick={() => resetState()}>Restart</Button>
        <Button onClick={() => finishedCallback(GameStatus.NOT_STARTED)}>
          Main Menu
        </Button>
      </ButtonRow>
    </>
  );
};

const BoardRow = styled.div`
  display: flex;
  flex-direction: row;
  width: min-content;
`;

const ButtonRow = styled.div`
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
  margin: 1em 0;
`;

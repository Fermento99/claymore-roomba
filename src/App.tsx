import { Board, Menu } from './components';
import { useState } from 'react';
import { GameStatus } from './models/GameStatus';
import { GameConfig } from './models/GameConfig';
import styled from '@emotion/styled';
import { Button } from './components/Button';

export const App = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.NOT_STARTED
  );
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    width: 9,
    height: 9,
    bombs: 10,
  });
  return (
    <GameContainer>
      <h1>Activate Claymore Roomba!!1</h1>
      {gameStatus === GameStatus.NOT_STARTED ? (
        <Menu
          selected={(gameConfig) => {
            setGameConfig(gameConfig);
            setGameStatus(GameStatus.STARTED);
          }}
        />
      ) : (
        <>
          <Board
            gameConfig={gameConfig}
            finishedCallback={(gameStatus) => setGameStatus(gameStatus)}
          />
          {gameStatus === GameStatus.LOST && <h4>You've lost</h4>}
          {gameStatus === GameStatus.WON && <h4>You've won</h4>}
          {(gameStatus === GameStatus.LOST ||
            gameStatus === GameStatus.WON) && (
            <Button onClick={() => setGameStatus(GameStatus.NOT_STARTED)}>
              Go back to Menu
            </Button>
          )}
        </>
      )}
    </GameContainer>
  );
};

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

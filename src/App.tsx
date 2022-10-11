import { Board, Menu } from './components';
import { useState } from 'react';
import { GameStatus } from './models/GameStatus';
import { GameConfig } from './models/GameConfig';

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
    <>
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
            <button onClick={() => setGameStatus(GameStatus.NOT_STARTED)}>
              Play Again
            </button>
          )}
        </>
      )}
    </>
  );
};

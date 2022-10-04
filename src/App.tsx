import { Board } from './components';

export const App = () => {
  return (
    <>
      <h1>Activate Claymore Roomba!!1</h1>
      <Board width={15} height={20} bombs={20} />
    </>
  );
};

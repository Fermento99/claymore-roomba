import styled from '@emotion/styled';
import { useState } from 'react';
import { GameConfig } from '../../models/GameConfig';

interface MenuProps {
  selected: (gameConfig: GameConfig) => void;
}

export const Menu = ({ selected }: MenuProps) => {
  const [customWidth, setCustomWidth] = useState(9);
  const [customHeight, setCustomHeight] = useState(9);
  const [customBombs, setCustomBombs] = useState(10);

  return (
    <div>
      <Button onClick={() => selected({ width: 9, height: 9, bombs: 10 })}>
        Beginner
      </Button>
      <Button onClick={() => selected({ width: 16, height: 16, bombs: 40 })}>
        Intermediate
      </Button>
      <Button onClick={() => selected({ width: 16, height: 30, bombs: 99 })}>
        Expert
      </Button>
      <Button
        onClick={() =>
          selected({
            width: customWidth,
            height: customHeight,
            bombs: customBombs,
          })
        }
      >
        Custom
      </Button>
      <div>
        <label>
          Width
          <Input
            type="number"
            name="width"
            value={customWidth}
            onChange={(e) => setCustomWidth(parseInt(e.target.value))}
          />
        </label>
        <label>
          Height
          <Input
            type="number"
            value={customHeight}
            name="width"
            onChange={(e) => setCustomHeight(parseInt(e.target.value))}
          />
        </label>
        <label>
          Bombs
          <Input
            type="number"
            name="width"
            value={customBombs}
            onChange={(e) => setCustomBombs(parseInt(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

const Button = styled.button`
  background-color: #eee;
`;

const Input = styled.input`
  color: black;
`;

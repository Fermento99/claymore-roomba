import styled from '@emotion/styled';
import { useState } from 'react';
import { GameConfig } from '../../models/GameConfig';
import { Button } from '../Button';

interface MenuProps {
  selected: (gameConfig: GameConfig) => void;
}

export const Menu = ({ selected }: MenuProps) => {
  const [customWidth, setCustomWidth] = useState(9);
  const [customHeight, setCustomHeight] = useState(9);
  const [customBombs, setCustomBombs] = useState(10);

  return (
    <Column>
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
      <Column>
        <Label>
          <p>Width</p>
          <Input
            type="number"
            name="width"
            value={customWidth}
            onChange={(e) => setCustomWidth(parseInt(e.target.value))}
          />
        </Label>
        <Label>
          <p>Height</p>
          <Input
            type="number"
            value={customHeight}
            name="width"
            onChange={(e) => setCustomHeight(parseInt(e.target.value))}
          />
        </Label>
        <Label>
          <p>Bombs</p>
          <Input
            type="number"
            name="width"
            value={customBombs}
            onChange={(e) => setCustomBombs(parseInt(e.target.value))}
          />
        </Label>
      </Column>
    </Column>
  );
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1em;
`;

const Label = styled.label`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  > p {
    margin: 0.25em 1em 0.25em 0;
  }
`;

const Input = styled.input`
  color: black;
  background-color: #f7f7f7;
  font-size: 14px;
  padding-left: 1em;
  border-radius: 16px;
  margin-left: auto;
  max-width: 5em;
`;

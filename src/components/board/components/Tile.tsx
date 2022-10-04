import styled from '@emotion/styled';
import { TileState } from '../../../models/TileState';

interface TileProps {
  state: TileState;
  click: (alt: boolean) => void;
  ended: boolean;
}

export const Tile = ({ state, click, ended }: TileProps) => {
  let content = '';
  if (ended && !state.open) {
    if (state.flagged) {
      if (state.bomb) content = 'F';
      else content = 'x';
    } else {
      if (state.bomb) content = '#';
    }
  } else {
    if (state.open) {
      if (state.proximity !== 0) content = state.proximity.toString();
      if (state.bomb) content = '#';
    } else {
      if (state.flagged) content = 'F';
    }
  }
  return (
    <TileContainer open={state.open} onClick={(e) => click(e.altKey)}>
      {content}
    </TileContainer>
  );
};

const TileContainer = styled.div<{ open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.5rem;
  width: 1.5rem;
  background-color: #888;
  border-color: #000;
  border-width: 2px;
  border-style: ${({ open }) => (open ? 'inset' : 'outset')};
  cursor: ${({ open }) => (open ? 'default' : 'pointer')};
`;

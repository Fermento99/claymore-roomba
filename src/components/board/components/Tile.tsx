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
    <TileContainer state={state} onClick={(e) => click(e.ctrlKey)}>
      {content}
    </TileContainer>
  );
};

const TileContainer = styled.div<{ state: TileState }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.5rem;
  width: 1.5rem;
  background-color: ${({ state }) => (state.open ? '#bdbdbd' : '#c0c0c0')};
  border-color: ${({ state }) => (state.open ? '#888' : '#ddd')};
  border-width: ${({ state }) => (state.open ? '1px' : '3px')};
  border-style: ${({ state }) => (state.open ? 'solid' : 'outset')};
  cursor: ${({ state }) => (state.open ? 'default' : 'pointer')};
  color: ${({ state }) => {
    if (state.flagged || state.bomb) return '#f11013';
    switch (state.proximity) {
      case 1:
        return '#14538c';
      case 2:
        return '#158f8c';
      case 3:
        return '#18a97d';
      case 4:
        return '#62b91f';
      case 5:
        return '#f8b81f';
      case 6:
        return '#f68c0b';
      case 7:
        return '#ef5f11';
      case 8:
        return '#f8181c';
      default:
        return '#000';
    }
  }};
`;

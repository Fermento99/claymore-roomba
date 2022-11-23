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
      if (state.bomb) content = '🚩';
      else content = '🚫';
    } else {
      if (state.bomb) content = '💣';
    }
  } else {
    if (state.open) {
      if (state.proximity !== 0) content = state.proximity.toString();
      if (state.bomb) content = '💣';
    } else {
      if (state.flagged) content = '🚩';
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
  background-color: ${({ state }) => (state.open ? '#F2E7D5' : '#6D9886')};
  border-color: ${({ state }) => (state.open ? '#c5bbab' : '#8ec5af')};
  border-width: ${({ state }) => (state.open ? '1px' : '3px')};
  border-style: ${({ state }) => (state.open ? 'solid' : 'outset')};
  cursor: ${({ state }) => (state.open ? 'default' : 'pointer')};
  color: ${({ state }) => {
    if (state.flagged || state.bomb) return '#f11013';
    switch (state.proximity) {
      case 1:
        return '#542dde';
      case 2:
        return '#069d06';
      case 3:
        return '#e12e0c';
      case 4:
        return '#0000b3';
      case 5:
        return '#d04900';
      case 6:
        return '#009da0';
      case 7:
        return '#a600a6';
      case 8:
        return '#949494';
      default:
        return '#000';
    }
  }};
`;

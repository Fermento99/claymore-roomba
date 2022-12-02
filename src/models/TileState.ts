enum FlaggingResult {
  FLAG_ADDED = 1,
  FLAG_REMOVED = -1,
  NO_CHANGE = 0,
}

export class TileState {
  open: boolean;
  flagged: boolean;
  bomb: boolean;
  proximity: number;

  constructor(
    { open, flagged, bomb, proximity } = {
      open: false,
      flagged: false,
      bomb: false,
      proximity: 0,
    }
  ) {
    this.open = open;
    this.flagged = flagged;
    this.bomb = bomb;
    this.proximity = proximity;
  }
  setOpen() {
    if (!this.flagged) this.open = true;
  }

  toggleFlag(): FlaggingResult {
    if (!this.open) {
      this.flagged = !this.flagged;
      return this.flagged
        ? FlaggingResult.FLAG_ADDED
        : FlaggingResult.FLAG_REMOVED;
    }

    return FlaggingResult.NO_CHANGE;
  }
}

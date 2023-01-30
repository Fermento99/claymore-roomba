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
    if (this.bomb) throw Error('Bomb went off');
  }

  /**
   * Function toggles the "flag status" if possible
   * @return {FlaggingResult} FLAG_ADDED if flag was turned on
   *  FLAG_REMOVED if flag was turned off
   *  NO_CHANGE if changing flag status was impossible
   */
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

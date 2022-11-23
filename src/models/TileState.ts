enum FlaggingResult {
  FLAG_ADDED = 1,
  FLAG_REMOVED = -1,
  NO_CHANGE = 0,
}

export class TileState {
  open = false;
  flagged = false;
  bomb = false;
  proximity = 0;

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

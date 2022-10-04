export class TileState {
  open = false;
  flagged = false;
  bomb = false;
  proximity = 0;

  setOpen() {
    if (!this.flagged) this.open = true;
  }

  toggleFlag() {
    if (!this.open) this.flagged = !this.flagged;
  }
}

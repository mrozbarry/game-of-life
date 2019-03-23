export default class Game {
  constructor(timer, renderer) {
    this.timer = timer;
    this.renderer = renderer;
    this.handle = null;
    this.cursor = null;
  }

  start(grid) {
    this.grid = grid;
    this.queue();
  }

  stop() {
    this.timer.clear(this.handle);
    this.handle = null;
  }

  queue() {
    this.handle = this.timer.trigger(() => this.tick());
  }

  setCursor([x, y]) {
    this.cursor = this.renderer.transformPosition(x, y);
  }

  removeCursor() {
    this.cursor = null;
  }

  tick() {

    this.grid.update();
    this.renderer.draw(this.grid, this.cursor, this.cellSize);

    this.queue();
  }
}

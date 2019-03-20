const patterns = {
  glider: [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ],

  repeatCircle: [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ],
};

export default class Game {
  constructor(ctx, colors, timer) {
    this.ctx = ctx;
    this.colors = colors;
    this.timer = timer;
    this.handle = null;
    this.cursor = null;

    // Glider
    this.pattern = patterns.glider;
  }

  start(grid, cellSize) {
    this.grid = grid;
    this.cellSize = cellSize;
    this.queue();
  }

  stop() {
    this.timer.clear(this.handle);
    this.handle = null;
  }

  queue() {
    this.handle = this.timer.trigger(() => this.tick());
  }

  setCursor(cursorTuple) {
    this.cursor = cursorTuple.map((value, axis) =>
      Math.floor(value / this.cellSize)
    );
  }

  addPattern() {
    if (!this.cursor) return;

    this.grid.eachCell((cell, {
      row,
      column
    }) => {
      const y = (row - this.cursor[1]);
      const x = (column - this.cursor[0]);
      const value = this.pattern[y] && this.pattern[y][x];
      if (value === 1) {
        cell.value = 1;
        cell.meta.continuity = 0;
      }
    });
  }

  removeCursor() {
    this.cursor = null;
  }

  erase() {
    this.ctx.fillStyle = this.colors.clear;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  draw() {
    this.ctx.strokeStyle = this.colors.cellStroke
    this.ctx.fillStyle = this.colors.cellFill;

    this.grid.eachCell((cell, {
      row,
      column
    }) => {
      if (!cell.isAlive()) return;

      this.ctx.fillStyle = cell.color();

      const rect = [
        column * this.cellSize,
        row * this.cellSize,
        this.cellSize,
        this.cellSize,
      ];

      this.ctx.fillRect(...rect);
      this.ctx.strokeRect(...rect);

    });
  }

  drawPattern() {
    if (!this.cursor || !this.pattern) return;

    this.ctx.fillStyle = "rgba(50, 50, 50, .4)";
    this.pattern.forEach((rowValues, row) => {
      rowValues.forEach((value, column) => {
        if (!value) return;

        this.ctx.fillRect(
          (this.cursor[0] + column) * this.cellSize,
          (this.cursor[1] + row) * this.cellSize,
          this.cellSize,
          this.cellSize
        );
      });
    });
  }

  drawCursor() {
    if (!this.cursor) return;
    this.ctx.fillStyle = "#FF00FF";
    this.ctx.fillRect(
      this.cursor[0] * this.cellSize,
      this.cursor[1] * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  tick() {
    this.erase();
    this.grid.update();
    this.draw();
    this.drawPattern();
    this.drawCursor();

    this.queue();
  }
}

export default class CanvasRenderer {
  constructor(container, colors, cellSize) {
    this.colors = colors;
    this.cellSize = cellSize;
    this.element = document.createElement('canvas');
    this.ctx = this.element.getContext('2d');
    this.mounted = false;
    this.mount(container);
    this.resize(window.innerWidth, window.innerHeight);
  }

  mount(container) {
    if (this.mounted) return;

    this.container = container;
    this.container.appendChild(this.element);
    this.mounted = true;
  }

  unmount() {
    if (!this.mounted) return;

    this.element.remove();
    this.mounted = false;
  }

  resize(width, height) {
    this.element.width = width;
    this.element.height = height;
  }

  calculateGridSize() {
    return {
      width: Math.floor(this.element.width / this.cellSize),
      height: Math.floor(this.element.height / this.cellSize),
    };
  }

  transformPosition(x, y) {
    return {
      x: Math.floor(x / this.cellSize),
      y: Math.floor(y / this.cellSize),
    }
  }

  erase() {
    this.ctx.fillStyle = this.colors.clear;
    this.ctx.fillRect(0, 0, this.element.width, this.element.height);
  }

  drawGrid(grid) {
    this.ctx.strokeStyle = this.colors.cellStroke;

    grid.eachCell((cell, {
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

  drawCursor(cursor) {
    if (!cursor) return;

    this.ctx.fillStyle = "#FF00FF";
    this.ctx.fillRect(
      cursor[0] * this.cellSize,
      cursor[1] * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  draw(grid, cursor) {
    this.erase();
    this.drawGrid(grid);
    this.drawCursor(cursor);
  }
}

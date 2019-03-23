const styles = {
  grid: columns => `
    display: grid;
    grid-column-template: repeat(1fr, ${columns});
    width: 100vw;
    height: 100vh;
  `,
  cell: cellSize => `
    display: block;
    height: ${cellSize}px;
    transition: background-color .3s ease-out;
  `,
};

export default class GridRenderer {
  constructor(container, colors, cellSize) {
    this.colors = colors;
    this.cellSize = cellSize;
    this.element = document.createElement('canvas');
    this.cells = {};
    const size = this.calculateGridSize();
    this.applyStylesTo(styles.grid(size.width), this.element);
    this.mounted = false;
    this.mount(container);
  }

  applyStylesTo(style, element) {
    element.style.cssText = style;
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

  calculateGridSize() {
    return {
      width: Math.floor(window.innerWidth / this.cellSize),
      height: Math.floor(window.innerHeight / this.cellSize),
    };
  }

  transformPosition(x, y) {
    return {
      x: Math.floor(x / this.cellSize),
      y: Math.floor(y / this.cellSize),
    }
  }

  createCell(position) {
    const key = [position.x, position.y].join('x');
    const cell = document.createElement('div');
    const size = this.calculateGridSize();

    this.applyStylesTo(styles.cell(size.height), cell);

    this.cells[key] = cell;
    return cell;
  }

  getCell(position) {
    const key = [position.x, position.y].join('x');
    const cell = this.cells[key] || this.createCell(position);

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

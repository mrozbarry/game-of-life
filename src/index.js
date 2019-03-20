const framesPerSecond = 10
const cellStrokeColor = '#000'
const cellFillColor = '';
const clearColor = '';

const timers = {
  raf: {
    trigger: fn => requestAnimationFrame(fn),
    clear: handle => cancelAnimationFrame(handle),
  },
  timeout: {
    trigger: fn => setTimeout(fn, 1000 / framesPerSecond),
    clear: handle => clearTimeout(handle),
  },
};

const themes = {
  default: {
    clear: 'rgba(0, 0, 0, .1)',
    cellStroke: '#000',
    cellFill: 'rgba(0, 153, 255, 1)',
  },
  inverted: {
    clear: 'rgba(255, 255, 255, 0.3)',
    cellStroke: '#FFF',
    cellFill: 'rgba(0, 0, 0, 1)',
  },
};

const colors = themes.default;

import Game from './game.js';
import Grid from './grid.js';


const makeMouseMoveHandler = game => ({
  offsetX,
  offsetY
}) => {
  game.setCursor([offsetX, offsetY]);
};

const makeMouseClickHandler = game => () => {
  game.addPattern();
};


const init = () => {
  const canvasSize = [window.innerWidth, window.innerHeight];
  const cellSize = 4;

  const canvas = document.getElementById('canvas');
  canvas.width = canvasSize[0];
  canvas.height = canvasSize[1];

  const ctx = canvas.getContext('2d');

  const game = new Game(ctx, themes.default, timers.raf)

  const mouseMoveHandler = makeMouseMoveHandler(game);
  const mouseClickHandler = makeMouseClickHandler(game);
  canvas.addEventListener('click', mouseClickHandler);
  canvas.addEventListener('mousemove', mouseMoveHandler);
  canvas.addEventListener('mouseout', () => {
    game.removeCursor();
  });

  const grid = new Grid(Math.floor(canvasSize[0] / cellSize), Math.floor(canvasSize[1] / cellSize));
  grid.seed(1 / 10);

  game.start(grid, cellSize);
}

init();

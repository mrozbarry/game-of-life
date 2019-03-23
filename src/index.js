import Game from './game.js';
import Grid from './grid.js';
import CanvasRenderer from './renderers/canvas.js';

const framesPerSecond = 30
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

const makeMouseHandler = game => ({
  offsetX,
  offsetY
}) => {
  game.setCursor([offsetX, offsetY]);
};


const init = () => {
  const renderer = new CanvasRenderer(document.body, themes.default, 8);
  const gridSize = renderer.calculateGridSize();

  const game = new Game(timers.raf, renderer)

  const mouseHandler = makeMouseHandler(game);
  renderer.element.addEventListener('click', mouseHandler);
  renderer.element.addEventListener('mousemove', mouseHandler);
  renderer.element.addEventListener('mouseout', () => {
    game.removeCursor();
  });

  const grid = new Grid(gridSize.width, gridSize.height);
  grid.seed(1 / 2);

  game.start(grid);

  if (module.hot) {
    module.hot.dispose(() => {
      renderer.unmount();
    });

    module.hot.accept(() => {
      renderer.mount(document.body);
    });
  }
}

init();

const banner = document.getElementById('animated-banner');
const seed = crypto.getRandomValues(new Uint32Array(1))[0];

const hash = (x, y, salt = 0) => {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 0.000019 + salt * 91.7) * 43758.5453;
  return value - Math.floor(value);
};

const green = ['#17372a', '#234632', '#31533b', '#45634a', '#5e735b', '#74836d'];
const paper = ['#deddd5', '#e8e6dc', '#d1d0c7', '#f1efe5', '#bbbcb3', '#d8d5c8'];
const mortar = ['#657068', '#788079', '#90958e', '#56615a', '#718072'];
const ruleSpace = 2 ** 18;
let previousRule = null;
try {
  const storedRule = window.sessionStorage.getItem('mosaic-life-rule');
  if (storedRule !== null) previousRule = Number(storedRule);
} catch (_) {
}

let ruleBits = crypto.getRandomValues(new Uint32Array(1))[0] % ruleSpace;
if (ruleBits === previousRule) ruleBits = (ruleBits + 1) % ruleSpace;

const birth = [];
const survive = [];
for (let neighbours = 0; neighbours <= 8; neighbours += 1) {
  if ((ruleBits & (1 << neighbours)) !== 0) birth.push(neighbours);
  if ((ruleBits & (1 << (neighbours + 9))) !== 0) survive.push(neighbours);
}

const activeRule = {
  name: 'Random Life',
  code: `B${birth.join('')}/S${survive.join('')}`,
  birth,
  survive
};

try {
  window.sessionStorage.setItem('mosaic-life-rule', String(ruleBits));
} catch (_) {
}

let motionTimer;
let startTimer;

const render = () => {
  clearInterval(motionTimer);
  clearTimeout(startTimer);
  const width = Math.max(320, banner.clientWidth);
  const height = Math.max(180, banner.clientHeight);
  const pixel = width < 600 ? 6 : 7;
  const brickWidth = pixel * (7 + (seed % 2));
  const brickHeight = pixel * 5;
  const courseHeight = brickHeight + pixel;
  const columns = Math.ceil(width / pixel);
  const rows = Math.ceil(height / pixel);
  const cells = [];

  for (let gridY = 0; gridY < rows; gridY += 1) {
    const y = gridY * pixel;
    const course = Math.floor(y / courseHeight);
    const withinCourse = y - course * courseHeight;
    const isMortar = withinCourse >= brickHeight;
    const offset = Math.abs(course) % 2 === 1 ? brickWidth * 0.5 : 0;

    for (let gridX = 0; gridX < columns; gridX += 1) {
      const x = gridX * pixel;
      const brick = Math.floor((x + offset) / brickWidth);
      const alternate = Math.abs(brick + (seed % 2)) % 2 === 0;
      const palette = isMortar ? mortar : alternate ? green : paper;
      const group = isMortar ? 'mortar' : alternate ? 'green' : 'paper';
      const colourIndex = Math.floor(hash(gridX, gridY, brick * 13 + course * 7) * palette.length);

      cells.push(
        `<rect class="mosaic-cell" data-group="${group}" data-tone="${colourIndex}" x="${x.toFixed(2)}" y="${y.toFixed(2)}" ` +
        `width="${(pixel + 0.08).toFixed(2)}" height="${(pixel + 0.08).toFixed(2)}" ` +
        `fill="${palette[colourIndex]}"/>`
      );
    }
  }

  banner.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="A green and white café-wall mosaic evolving with the random cellular automaton rule ${activeRule.code}.">
      <style>
        .mosaic-cell { transition: fill 160ms linear; }
      </style>
      <g shape-rendering="crispEdges">${cells.join('')}</g>
    </svg>
    <div class="rule-readout" aria-label="Current cellular automaton setting">
      <span>${activeRule.code}</span>
    </div>`;

  banner.dataset.lifeRule = `${activeRule.name} ${activeRule.code}`;

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const elements = banner.querySelectorAll('.mosaic-cell');
    let states = Array.from(elements, (element) => element.dataset.group !== 'paper');
    let tick = 0;
    let regionSerial = 0;
    const regions = [];

    const colourForState = (element, alive) => {
      const tone = Number(element.dataset.tone);
      const palette = alive ? green : paper;
      return palette[(tone + (alive ? 1 : 0)) % palette.length];
    };

    const spawnRegion = () => {
      regionSerial += 1;
      const horizontalBand = (regionSerial - 1) % 2;
      const region = {
        side: horizontalBand === 0 ? 'left' : 'right',
        age: 0
      };

      regions.push(region);

      const column = region.side === 'left' ? 0 : columns - 1;
      for (let row = 0; row < rows; row += 1) {
        const index = row * columns + column;
        states[index] = !states[index];
        elements[index].setAttribute('fill', colourForState(elements[index], states[index]));
      }
    };

    const evolve = () => {
      tick += 1;
      const snapshot = states.slice();
      const nextStates = states.slice();
      const selected = new Set();

      regions.forEach((region) => {
        const depth = 1 + region.age * 0.9;
        const extent = Math.min(columns, Math.ceil(depth));

        for (let row = 0; row < rows; row += 1) {
          for (let offset = 0; offset < extent; offset += 1) {
            const column = region.side === 'left' ? offset : columns - 1 - offset;
            const atFrontier = offset > depth - 2.2;
            const updateChance = atFrontier ? 0.58 : 0.07;
            const sideSalt = region.side === 'left' ? 509 : 719;
            if (hash(column, row, tick + sideSalt) > updateChance) continue;
            selected.add(row * columns + column);
          }
        }

        region.age += 1;
      });

      selected.forEach((index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        let neighbours = 0;

        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            if (offsetX === 0 && offsetY === 0) continue;
            const neighbourColumn = (column + offsetX + columns) % columns;
            const neighbourRow = (row + offsetY + rows) % rows;
            if (snapshot[neighbourRow * columns + neighbourColumn]) neighbours += 1;
          }
        }

        const nextState = snapshot[index]
          ? activeRule.survive.includes(neighbours)
          : activeRule.birth.includes(neighbours);

        nextStates[index] = nextState;
        if (nextState === snapshot[index]) return;
        elements[index].setAttribute('fill', colourForState(elements[index], nextState));
      });

      states = nextStates;
    };

    startTimer = window.setTimeout(() => {
      spawnRegion();
      spawnRegion();
      evolve();
      motionTimer = window.setInterval(evolve, 650);
    }, 5000);
  }
};

let resizeFrame;
window.addEventListener('resize', () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(render);
});

render();

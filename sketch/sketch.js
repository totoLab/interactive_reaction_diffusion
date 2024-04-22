// Reference: http://karlsims.com/rd.html

const TESTING = false;

const DIMENSION = 200;
const D_A = 1;
const D_B = 0.5;
const FEED = 0.055;
const K = 0.062;

const laplaceWeights = [
  [0.05, 0.2, 0.05],
  [0.2, -1, 0.2],
  [0.05, 0.2, 0.05]
];

const pressed = new Set();

var grid, next;

function setup() {
  createCanvas(DIMENSION, DIMENSION);
  pixelDensity(1);
  
  initializeGrid();
  initialPoints();
  canSimulate = false;
}

function draw() {
  background(51);

  let KEY_D = 68;
  if (keyIsDown(KEY_D)) {
    const x = mouseX;
    const y = mouseY;
    fillPoint(x, y);
  }

  if (canSimulate) {
    updatePoints();
  }

  recolorPixels();
}

function keyPressed(evt) {
  const { code } = evt;

  if (!pressed.has(code)) {
    pressed.add(code);

    if (pressed.has("Space")) {
      canSimulate = !canSimulate;
    } else if (pressed.has("KeyR")) {
      initializeGrid();
    }
  }
}

function keyReleased(evt) {
  pressed.delete(evt.code);
}

function initializeGrid() {
  grid = Array.from({ length: DIMENSION }, () =>
    Array.from({ length: DIMENSION }, () => ({ a: 1, b: 0 }))
  );
  next = Array.from({ length: DIMENSION }, () =>
    Array.from({ length: DIMENSION }, () => ({ a: 1, b: 0 }))
  );
}

function updatePoints() {
  for (let x = 1; x < DIMENSION - 1; x++) {
    for (let y = 1; y < DIMENSION - 1; y++) {
      const a = grid[x][y].a;
      const b = grid[x][y].b;
      const lapA = laplace(x, y, 'a');
      const lapB = laplace(x, y, 'b');

      next[x][y].a = a + (D_A * lapA) - (a * b * b) + (FEED * (1 - a));
      next[x][y].b = b + (D_B * lapB) + (a * b * b) - ((K + FEED) * b);

      next[x][y].a = constrain(next[x][y].a, 0, 1);
      next[x][y].b = constrain(next[x][y].b, 0, 1);
    }
  }

  swap();
}

function recolorPixels() {
  loadPixels();
  for (let x = 0; x < DIMENSION; x++) {
    for (let y = 0; y < DIMENSION; y++) {
      const pix = (x + y * DIMENSION) * 4;
      const a = next[x][y].a;
      const b = next[x][y].b;
      const c = floor((a - b) * 255);
      pixels[pix + 0] = 255 - c;
      pixels[pix + 1] = 255 - c;
      pixels[pix + 2] = 255 - c;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
}

function laplace(x, y, targetVar) {
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      sum += grid[x + i][y + j][targetVar] * laplaceWeights[i + 1][j + 1];
    }
  }
  return sum;
}

function initialPoints() {
  if (!TESTING) {
    rectangle(60, 60, 30, 30);
    rectangle(150, 60, 5, 30);
    rectangle(20, 140, 60, 20);
    circular(170, 20, 20);
    circular(120, 180, 10);
    circular(150, 180, 10);
    circular(180, 180, 10);
  }
}

function rectangle(startX, startY, length, wideness) {
  for (let i = startX; i < startX + length; i++) {
    for (let j = startY; j < startY + wideness; j++) {
      fillPoint(i, j);
    }
  }
}

function circular(centerX, centerY, radius) {
  for (let i = centerX - radius; i < centerX + radius; i++) {
    for (let j = centerY - radius; j < centerY + radius; j++) {
      const a = i - centerX;
      const b = j - centerY;
      if (a * a + b * b <= radius * radius) {
        fillPoint(i, j);
      }
    }
  }
}

function fillPoint(i, j) {
  grid[i][j].b = 1;
  next[i][j].b = 1;
}

function swap() {
  [grid, next] = [next, grid];
}

// Reference: http://karlsims.com/rd.html

TESTING = false;

var grid;
var next;

var dA = 1;
var dB = 0.5;
var feed = 0.055;
var k = 0.062;

const pressed = new Set();

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

function setup() {
  dim = 200;
  createCanvas(dim, dim);
  pixelDensity(1);
  
  initializeData();
  initialPoints();
  
  canSimulate = false;
}

function draw() {
  background(51);
  
  KEY_D = 68;
  if (keyIsDown(KEY_D)) {
    x = mouseX;
    y = mouseY;
    fillPoint(x, y);
  }
  
  if (canSimulate) {
    updatePoints();
  }
  
  recolorPixels();
}

function keyPressed(evt) {
  const {code} = evt;

  if (!pressed.has(code)) {
    pressed.add(code);

    if (pressed.has("Space")) {
      canStart = !canStart;
    } else if (pressed.has("KeyR")) {
      initializeData();
    }
  }
}

function keyReleased(evt) {
  pressed.delete(evt.code);
}

function initializeData() {
  grid = [];
  next = [];
  for (var x = 0; x < width; x++) {
    grid[x] = [];
    next[x] = [];
    for (var y = 0; y < height; y++) {
      grid[x][y] = {
        a: 1,
        b: 0
      };
      next[x][y] = {
        a: 1,
        b: 0
      };
    }
  }
}

function updatePoints() {
  for (var x = 1; x < width - 1; x++) {
    for (var y = 1; y < height - 1; y++) {
      var a = grid[x][y].a;
      var b = grid[x][y].b;
      next[x][y].a = a +
        (dA * laplaceA(x, y)) -
        (a * b * b) +
        (feed * (1 - a));
      next[x][y].b = b +
        (dB * laplaceB(x, y)) +
        (a * b * b) -
        ((k + feed) * b);

      next[x][y].a = constrain(next[x][y].a, 0, 1);
      next[x][y].b = constrain(next[x][y].b, 0, 1);
    }
  }
  

  swap();
}

function recolorPixels() {
  loadPixels();
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var pix = (x + y * width) * 4;
      var a = next[x][y].a;
      var b = next[x][y].b;
      var c = floor((a - b) * 255);
      c = constrain(c, 0, 255);
      pixels[pix + 0] = 255-c;
      pixels[pix + 1] = 255-c;
      pixels[pix + 2] = 255-c;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
}

function laplace(x, y, targetVar) {
  low = 0.05
  medium = 0.2
  removal = -1
  var weights = [
    [ low, medium, low ],
    [ medium, removal, medium ],
    [ low, medium, low ]
  ];

  var sum = 0;
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      sum += grid[x + i][y + j][targetVar] * weights[i + 1][j + 1];
    }
  }
  return sum;
}

function laplaceA(x, y) {
  return laplace(x, y, 'a');
}

function laplaceB(x, y) {
  return laplace(x, y, 'b');
}

function rectangle(startX, startY, length, wideness) {
   for (var i = startX; i < startX+length; i++) {
    for (var j = startY; j < startY+wideness; j++) {
      fillPoint(i, j);
    }
  }
}

function circular(centerX, centerY, radius) {
  for (var i = centerX-radius; i < centerX+radius; i++) {
    for (var j = centerY-radius; j < centerY+radius; j++) {
      a = i - centerX
      b = j - centerY
      if (a*a + b*b <= radius*radius) {
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
  var temp = grid;
  grid = next;
  next = temp;
}

var bgColor;
var canvas;
var canvasImage;
var circleCount;
var circles;
var color;
var context;
var draggingDraw;
var draggingMove;
var dragX;
var dragY;
var dragIndexDelete;
var dragIndexMove;
var dragStartLocation;
var mouseX;
var mouseY;
var radius;
var targetX;
var targetY;
var tempX;
var tempY;
var dx;
var dy;
var flagRandom = false;

window.addEventListener('load', init, false);

// resizing of canvas, based on the window size (called on: load, resize of window)
window.onload = window.onresize = function () {
  var canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth * 0.6;
  canvas.height = window.innerHeight * 0.8;
  drawCircles();
};

// initialize global variables (called on: load of window)
function init() {
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  context.lineWidth = 4;
  context.lineCap = 'round';

  circleCount = 0;
  draggingDraw = false;
  bgColor = '#000000';
  circles = [];

  // Event listeners to draw circles
  canvas.addEventListener('mousedown', dragStart, false);
  canvas.addEventListener('mousemove', drag, false);
  canvas.addEventListener('mouseup', dragStop, false);

  // Event listener to delete or hit circle on double click
  canvas.addEventListener('dblclick', deleteOrHitCircle, false);

  // Event listener to delete or hit circle on single click
  canvas.addEventListener('click', deleteOrHitCircle, false);
}

// Drawing of Circles with random colors
function dragStart(event) {
  draggingDraw = true;
  dragStartLocation = getCanvasCoordinates(event);
  color =
    'rgb(' +
    Math.floor(Math.random() * 200) +
    ',' +
    Math.floor(Math.random() * 200) +
    ',' +
    Math.floor(Math.random() * 200) +
    ')';
}

function drag(event) {
  var position;
  if (draggingDraw === true) {
    position = getCanvasCoordinates(event);
    drawCircle(position);
    context.fillStyle = color;
    context.fill();
  }
}

function dragStop(event) {
  draggingDraw = false;
  var position = getCanvasCoordinates(event);
  drawCircle(position);
  context.fillStyle = color;
  context.fill();
  circleCount = circleCount + 1;
  tempCircle = { x: tempX, y: tempY, rad: radius, color: color };

  circles.push(tempCircle);
}

function getCanvasCoordinates(event) {
  var x = event.clientX - canvas.getBoundingClientRect().left,
    y = event.clientY - canvas.getBoundingClientRect().top;

  return { x: x, y: y };
}

function drawCircle(position) {
  tempX = dragStartLocation.x;
  tempY = dragStartLocation.y;

  radius = Math.sqrt(
    Math.pow(tempX - position.x, 2) + Math.pow(tempY - position.y, 2)
  );
  context.beginPath();
  context.arc(tempX, tempY, radius, 0, 2 * Math.PI, false);
  context.closePath();
}

// On click of Erase Button
function drawScreen() {
  circleCount = 0;
  circles = [];
  context.fillStyle = bgColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  document.getElementById('statusMessage').innerHTML = '';
}

// On click of Draw / Move Button
function togglebtn() {
  if (document.getElementById('btnMve').name == 'Draw Shape') {
    canvas.removeEventListener('mousedown', mouseDown, false);
    document.getElementById('btnMve').src = 'moveButton.jpg';
    document.getElementById('btnMve').name = 'Move Shape';
    document.getElementById('spid').innerHTML =
      'Click here to move the circles';

    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
  } else if (document.getElementById('btnMve').name == 'Move Shape') {
    canvas.removeEventListener('mousedown', dragStart, false);
    canvas.removeEventListener('mousemove', drag, false);
    canvas.removeEventListener('mouseup', dragStop, false);

    document.getElementById('btnMve').src = 'drawButton.jpg';
    document.getElementById('btnMve').name = 'Draw Shape';
    document.getElementById('spid').innerHTML =
      'Click here to draw the circles';

    canvas.addEventListener('mousedown', mouseDown, false);
  }
}

// To Move/Delete the Circles
function drawCircles() {
  var i;
  var x;
  var y;
  var rad;
  var color;

  context.fillStyle = bgColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (i = 0; i < circleCount; i++) {
    rad = circles[i].rad;
    x = circles[i].x;
    y = circles[i].y;
    color = circles[i].color;
    context.beginPath();
    context.arc(x, y, rad, 0, 2 * Math.PI, false);
    context.closePath();
    context.fillStyle = color;
    context.fill();
  }
}

// To check whether the circle was clicked
function isCircleClicked(shape, mx, my) {
  var dx;
  var dy;
  dx = mx - shape.x;
  dy = my - shape.y;
  return dx * dx + dy * dy < shape.rad * shape.rad;
}

// To Delete/Hit the Circles
function deleteOrHitCircle(event) {
  var i;
  var bRect = canvas.getBoundingClientRect();
  dragIndexDelete = -1;

  mouseX = (event.clientX - bRect.left) * (canvas.width / bRect.width);
  mouseY = (event.clientY - bRect.top) * (canvas.height / bRect.height);

  var hit = false;

  for (i = 0; i < circleCount; i++) {
    if (isCircleClicked(circles[i], mouseX, mouseY)) {
      hit = true;
      break; // Exit the loop once a circle is found
    }
  }

  if (hit) {
    // On single click, show "Hit" message
    if (event.detail === 1) {
      document.getElementById('statusMessage').innerHTML = 'Hit';
    }
  } else {
    // If no circle is clicked, show "Miss" message
    if (event.detail === 1) {
      document.getElementById('statusMessage').innerHTML = 'Miss';
    }
  }

  // On double click, delete the circle
  if (event.detail === 2) {
    circles.splice(i, 1);
    circleCount = circleCount - 1;
    document.getElementById('statusMessage').innerHTML = ''; // Clear status message on deletion
  }

  drawCircles();
}


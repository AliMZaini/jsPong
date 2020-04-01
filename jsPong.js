const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");
const canvasWidth = document.getElementById("pongCanvas").getAttribute('width');
const canvasHeight = document.getElementById("pongCanvas").getAttribute('height');

class Paddle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = "black";
        this.points = 0;
    }
    draw() {
        if (this.y >= canvasHeight - this.height) {this.y = canvasHeight - this.height;}
        if (this.y <= 0){this.y = 0;}
        createRectangle(this.x, this.y, this.width, this.height, this.colour);
    }
}

function updatePoints(paddle) {
    createText(((canvasWidth / 2) + paddle.x) / 2, 20, paddle.points, "black", "20px Arial");
}

// Initialise game components
var userPaddle = new Paddle(10, 10, 20, 100);
var compPaddle = new Paddle(canvasWidth - 30, 10, 20, 100);

function createRectangle(x, y, width, height, colour) {
    context.fillStyle = colour;
    context.fillRect(x, y, width, height);
}

function createCircle(x, y, radius, colour) {
    context.fillStyle = colour;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}

function createText(x, y, text, colour, style) {
    context.fillStyle = colour;
    context.font = style;
    context.fillText(text, x, y);
}

function clearCanvas(){
    createRectangle(0, 0, canvasWidth, canvasHeight, "white");
}

function render(){
    userPaddle.draw();
    compPaddle.draw();
    updatePoints(userPaddle);
    updatePoints(compPaddle);
}

document.addEventListener("keydown", event => {
    console.log(event.code);
    clearCanvas();
    if (event.code === "KeyS"){userPaddle.y++;}
    if (event.code === "ArrowDown"){compPaddle.y++;}

    if (event.code === "KeyW"){userPaddle.y--;}
    if (event.code === "ArrowUp"){compPaddle.y--;}

    render();
});

render();
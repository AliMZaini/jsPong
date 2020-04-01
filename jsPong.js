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
    draw(){
        createRectangle(this.x, this.y, this.width, this.height, this.colour);
    }
}

var userPaddle = new Paddle(10, 10, 20, 100);
var compPaddle = new Paddle(10, 10, 20, 100);

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

document.addEventListener("keydown", event => {
    console.log(event.code);
    clearCanvas();
    if (event.code === "KeyS" || event.code === "ArrowDown"){userPaddle.y++;}
    if (event.code === "KeyW" || event.code === "ArrowUp"){userPaddle.y--;}
    userPaddle.draw();
});

userPaddle.draw();
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

class Ball {
    constructor(x, y, radius, colour) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
        this.velocity = [3, 3]; // Velocity x & y components
    }
    getSpeed(){
        return Math.sqrt(this.velocity[0] ** 2 + this.velocity[1]**2);
    }
    move(){
        this.x += this.velocity[0];
        this.y += this.velocity[1];
        if (this.y >= canvasHeight - this.radius || this.y - this.radius <= 0) {this.velocity[1] = -this.velocity[1];}

        for (var i = 0; i < paddles.length; i++){
            var paddle = paddles[i];
            if (checkCollision(paddle, this)){
                paddle.points++;
                this.velocity[0] = -this.velocity[0];
                break;
            }
        }
        if (this.x > canvasWidth || this.x < 0){
            console.log("ball is out of canvas");
            this.x = canvasWidth/2;
            this.y = canvasHeight/2;
        }
    }
    draw() {
        createCircle(this.x, this.y, this.radius, this.colour);
    }
}

/**
 * Checks if ball and paddle have collided
 * @param paddle object
 * @param ball object
 * @returns boolean if the ball and paddle have collided
 */
function checkCollision(paddle, ball){
    /**
    left of paddle must not touch right of ball
    right of paddle must not touch left of ball
    bottom of paddle must not touch top of ball
    top of paddle must not touch bottom of ball

    paddle.x < ball.x + ball.radius
    paddle.x + paddle.width > ball.x - ball.radius
    paddle.y + paddle.height > ball.y - ball.radius
    paddle.y < ball.y + ball.radius
     **/
    console.log("collision:" + paddle.x < ball.x + ball.radius && paddle.x + paddle.width > ball.x - ball.radius && paddle.y + paddle.height > ball.y - ball.radius && paddle.y < ball.y + ball.radius);
    return (paddle.x < ball.x + ball.radius && paddle.x + paddle.width > ball.x - ball.radius && paddle.y + paddle.height > ball.y - ball.radius && paddle.y < ball.y + ball.radius);
}

function updatePoints(paddle) {
    createText(((canvasWidth / 2) + paddle.x) / 2, 20, paddle.points, "black", "20px Arial");
}

// Initialise game components
var userPaddle = new Paddle(10, 10, 20, 100);
var compPaddle = new Paddle(canvasWidth - 30, 250, 20, 100);
var paddles = [userPaddle, compPaddle];
var ball = new Ball(canvasWidth/2, canvasHeight/2, 5,"black");

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
    clearCanvas();
    ball.move();
    ball.draw();
    userPaddle.draw();
    compPaddle.draw();
    updatePoints(userPaddle);
    updatePoints(compPaddle);
}

document.addEventListener("keydown", event => {
    console.log(event.code);
    if (event.code === "KeyS"){userPaddle.y++;}
    if (event.code === "ArrowDown"){compPaddle.y++;}

    if (event.code === "KeyW"){userPaddle.y--;}
    if (event.code === "ArrowUp"){compPaddle.y--;}

    render();
});

const fps = 60;
setInterval(render, 1000/fps);
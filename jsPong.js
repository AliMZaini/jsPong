const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");
const canvasWidth = document.getElementById("pongCanvas").getAttribute('width');
const canvasHeight = document.getElementById("pongCanvas").getAttribute('height');

class Paddle {
    constructor(x, y, width, height, colour, vertical) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = colour;
        this.vertical = vertical;
        this.points = 0;
    }
    draw() {
        // TODO pass by reference
        if (this.vertical) {
            if (this.y >= canvasHeight - this.height) {
                this.y = canvasHeight - this.height;
            }
            if (this.y <= 0) {
                this.y = 0;
            }
        }else {
            if (this.x >= canvasWidth - this.width) {
                this.x = canvasWidth - this.width;
            }
            if (this.x <= 0) {
                this.x = 0;
            }
        }
        createRectangle(this.x, this.y, this.width, this.height, this.colour);
    }
    shorten(length) {
        // TODO pass by reference
        if (this.vertical) {
            if (this.height - length > 0) {
                this.height -= length;
                this.y += length / 2;
            }
        }else {
            if (this.width - length > 0) {
                this.width -= length;
                this.x += length / 2;
            }
        }
    }
}

class Ball {
    constructor(x, y, radius, velocity, colour) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
        this.velocity = velocity; // velocity is an array with an x & y component
    }
    move(){
        this.x += this.velocity[0];
        this.y += this.velocity[1];
        //if (this.y >= canvasHeight - this.radius || this.y - this.radius <= 0) {this.velocity[1] = -this.velocity[1];} // this would make the ball bounce off the horizontal walls

        for (var i = 0; i < paddles.length; i++){
            var paddle = paddles[i];
            if (checkCollision(paddle, this)){
                paddle.points++;
                paddle.shorten(5);
                this.velocity[0] = -this.velocity[0];
                this.move();
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
    createText((2 * paddle.x + paddle.width)/2 - 5, (2 * paddle.y + paddle.height)/2 + 5, paddle.points, "black", "20px Segoe UI");
}

// Initialise game components
var leftPaddle = new Paddle(10, canvasHeight/2 - 50, 20, 100, "blue", true);
var rightPaddle = new Paddle(canvasWidth - 30, canvasHeight/2 - 50, 20, 100, "red", true);
var topPaddle = new Paddle(canvasWidth/2 - 50, 10, 100, 20,"green", false);
var bottomPaddle = new Paddle(canvasWidth/2 - 50, canvasHeight - 30, 100, 20, "yellow", false);

var paddles = [leftPaddle, rightPaddle, topPaddle, bottomPaddle];

var ballOne = new Ball(canvasWidth/2, canvasHeight/2, 5,[-3, -2], "blue");
var ballTwo = new Ball(canvasWidth/2, canvasHeight/2, 5, [3, 2], "red");

var balls = [ballOne, ballTwo];

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
    for (var i = 0; i < balls.length; i++){
        balls[i].move();
        balls[i].draw();
    }
    for (var i = 0; i < paddles.length; i++){
        paddles[i].draw();
        // TODO have some way to show points for each of the four paddles
        updatePoints(paddles[i]);
    }
}

// TODO change listener
document.addEventListener("keydown", event => {
    console.log(event.code);
    if (event.code === "KeyS"){leftPaddle.y++;}
    if (event.code === "ArrowDown"){rightPaddle.y++;}

    if (event.code === "KeyW"){leftPaddle.y--;}
    if (event.code === "ArrowUp"){rightPaddle.y--;}

    if (event.code === "KeyD"){topPaddle.x++;}
    if (event.code === "ArrowRight"){bottomPaddle.x++;}

    if (event.code === "KeyA"){topPaddle.x--;}
    if (event.code === "ArrowLeft"){bottomPaddle.x--;}

    render();
});

const fps = 60;
setInterval(render, 1000/fps);
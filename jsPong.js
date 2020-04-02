const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");
const canvasWidth = document.getElementById("pongCanvas").getAttribute('width');
const canvasHeight = document.getElementById("pongCanvas").getAttribute('height');

const PADDLE_SPEED = 7;
const FPS = 60;
const BACKGROUND_COLOUR = "#9dc6a7";

class Component {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width; // height/width refer to the distance from x/y to the maximum height/width of the component
        this.height = height;
    }

    draw() {
    }
}

class Paddle extends Component {
    constructor(x, y, width, height, colour, vertical) {
        super(x, y, width, height);
        this.colour = colour;
        this.vertical = vertical;
        this.points = 0;
    }

    move(forward) {
        // TODO pass by reference

        if (forward){ // forwards is towards +X/+Y
            if (this.vertical){
                this.y += PADDLE_SPEED;
            }else{
                this.x += PADDLE_SPEED;
            }
        }else {
            if (this.vertical){
                this.y -= PADDLE_SPEED;
            }else{
                this.x -= PADDLE_SPEED;
            }
        }

        // disgusting
        //TODO for loop should go through 'paddles' with this paddle popped out.
        // currently i'm just checking that there is only a single collision with this paddle (meaning that it only collided with itself)
        var counter = 0;
        for (let paddle of paddles){
            if (checkCollision(this, paddle)){
                counter++;
                console.log("collision");
            }
        }
        if (counter > 1){
            console.log("more than one collision, so undoing move");
            // if collision after moving, undo the move
            // TODO instead of undoing, just move the paddle to be as close to the other as possible
            if (forward){ // forwards is towards +X/+Y
                if (this.vertical){
                    this.y -= PADDLE_SPEED;
                }else{
                    this.x -= PADDLE_SPEED;
                }
            }else {
                if (this.vertical){
                    this.y += PADDLE_SPEED;
                }else{
                    this.x += PADDLE_SPEED;
                }
            }
            return false;
        }

        // Checks if paddle is being moved off the canvas
        if (this.y >= canvasHeight - this.height) {
            this.y = canvasHeight - this.height;
        }
        if (this.y <= 0) {
            this.y = 0;
        }
        if (this.x >= canvasWidth - this.width) {
            this.x = canvasWidth - this.width;
        }
        if (this.x <= 0) {
            this.x = 0;
        }
        return true;
    }

    draw() {
        createRectangle(this.x, this.y, this.width, this.height, this.colour);
    }

    shorten(length) {
        // TODO pass by reference
        // TODO set a minimum length instead of just not letting the length be <=0
        if (this.vertical) {
            if (this.height - length > 0) {
                this.height -= length;
                this.y += length / 2;
            }
        } else {
            if (this.width - length > 0) {
                this.width -= length;
                this.x += length / 2;
            }
        }
    }
}

class Ball extends Component {
    constructor(x, y, radius, velocity, colour) {
        super(x, y, radius, radius);
        this.radius = radius;
        this.colour = colour;
        this.velocity = velocity; // velocity is an array with an x & y component
    }

    move() {
        this.x += this.velocity[0];
        this.y += this.velocity[1];

        for (let paddle of paddles) {
            if (checkCollision(this, paddle)) {
                paddle.points++;
                paddle.shorten(5);
                this.collision(paddle);
                break;
            }
        }

        // If ball hits the borders, it bounces off
        if (this.x > canvasWidth || this.x < 0) {
            this.velocity[0] = -this.velocity[0];
        }
        if (this.y >= canvasHeight - this.radius || this.y - this.radius <= 0) {
            this.velocity[1] = -this.velocity[1];
        }

        // if ball collides with another ball, it bounces
        var counter = 0;
        for (let ball of balls){
            if (checkCollision(this, ball)){
                counter++;
                console.log("ball collision");
            }
        }
        if (counter > 1){
            console.log("more than one ball collision, so bouncing ball");
            this.velocity[0] = -this.velocity[0];
            this.velocity[1] = -this.velocity[1];
        }
    }

    collision(paddle) {
        // the velocity of the ball should change based on where it hit the paddle
        this.velocity[0] = -this.velocity[0];
        this.velocity[1] = -this.velocity[1];
    }

    draw() {
        createCircle(this.x, this.y, this.radius, this.colour);
    }
}

// Initialise game components
// TODO sizes should depend on the canvas size
var leftPaddle = new Paddle(0, canvasHeight / 2 - 50, 30, 100, "#a8e6cf", true);
var rightPaddle = new Paddle(canvasWidth - 30, canvasHeight / 2 - 50, 30, 100, "#ccedd2", true);
var topPaddle = new Paddle(canvasWidth / 2 - 50, 0, 100, 30, "#effcef", false);
var bottomPaddle = new Paddle(canvasWidth / 2 - 50, canvasHeight - 30, 100, 30, "#d1f5d3", false);

var paddles = [leftPaddle, rightPaddle, topPaddle, bottomPaddle];

var ballOne = new Ball(canvasWidth / 2, canvasHeight / 2, 20, [-10, -7], "blue");
var ballTwo = new Ball(canvasWidth / 2, canvasHeight / 2, 20, [10, 7], "red");

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

function clearCanvas() {
    createRectangle(0, 0, canvasWidth, canvasHeight, BACKGROUND_COLOUR);
}

/**
 * Checks if two components have collided
 * @param componentA a component object
 * @param componentB a component object
 * @returns boolean returns true if the two components have collided
 */
function checkCollision(componentA, componentB) {
    return componentA.x < componentB.x + componentB.width &&
        componentA.x + componentA.width > componentB.x &&
        componentA.y < componentB.y + componentB.height &&
        componentA.y + componentA.height > componentB.y;
}

function updatePoints(paddle) {
    createText((2 * paddle.x + paddle.width) / 2 - 5, (2 * paddle.y + paddle.height) / 2 + 5, paddle.points, "black", "20px Segoe UI");
}

function render() {
    clearCanvas();
    for (let ball of balls) {
        ball.move();
        ball.draw();
    }
    for (let paddle of paddles) {
        //paddle.move();
        paddle.draw();
        updatePoints(paddle);
    }
}

// TODO change listener
document.addEventListener("keydown", event => {
    //console.log(event.code);
    if (event.code === "KeyS") {
        leftPaddle.move(true);
    }
    if (event.code === "ArrowDown") {
        rightPaddle.move(true)
    }

    if (event.code === "KeyW") {
        leftPaddle.move(false);
    }
    if (event.code === "ArrowUp") {
        rightPaddle.move(false);
    }

    if (event.code === "KeyD") {
        topPaddle.move(true);
    }
    if (event.code === "ArrowRight") {
        bottomPaddle.move(true);
    }

    if (event.code === "KeyA") {
        topPaddle.move(false);
    }
    if (event.code === "ArrowLeft") {
        bottomPaddle.move(false);
    }
});

setInterval(render, 1000 / FPS);
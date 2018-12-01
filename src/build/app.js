class Canvas {
    constructor(canvas) {
        this.d_canvas = canvas;
        this.d_context = this.d_canvas.getContext('2d');
        console.log('in canvas constructor');
    }
    clear() {
        this.d_context.clearRect(0, 0, this.d_canvas.width, this.d_canvas.height);
    }
    writeTextToCanvas(aText, aFontSize, aXpos, aYpos, aColor = "white", aAlignment = "center") {
        this.d_context.font = `${aFontSize}px Minecraft`;
        this.d_context.fillStyle = aColor;
        this.d_context.textAlign = aAlignment;
        this.d_context.fillText(aText, aXpos, aYpos);
    }
    writeImageFromFileToCanvas(aSrc, aXpos, aYpos) {
        let image = new Image();
        image.addEventListener('load', () => {
            this.d_context.drawImage(image, aXpos, aYpos);
        });
        image.src = aSrc;
    }
}
class Entity {
    constructor(canvas, imageSource, xCoor, yCoor, width, height) {
        this._canvas = new Canvas(canvas);
        this._imageSrc = imageSource;
        this._xPos = xCoor;
        this._yPos = yCoor;
        this._width = width;
        this._height = height;
    }
    draw() {
        this._canvas.writeImageFromFileToCanvas(this._imageSrc, this._xPos, this._yPos);
    }
    getX() {
        return this._xPos;
    }
    getY() {
        return this._yPos;
    }
    getWidth() {
        return this._width;
    }
    getHeight() {
        return this._height;
    }
}
class Game {
    constructor() {
        this.draw = () => {
            this._canvas.clear();
            this._player.move();
            this._player.draw();
            this._zombie1.move();
            this._zombie1.follow(this._player);
            this._zombie1.draw();
            if (this._player.isColliding(this._zombie1)) {
                this._zombie1.respawn();
                this._zombie1.draw();
            }
            else {
                this._zombie1.draw();
            }
        };
        const canvasElement = document.getElementById('canvas');
        this._canvas = new Canvas(canvasElement);
        this._player = new Player(canvasElement, './assets/images/player.png', 100, 100, 32, 32);
        this._zombie1 = new Zombie(canvasElement, './assets/images/Zombies/4ZombieFrontSPAWN.png', 10, 10, 32, 36);
        console.log('in game constructor');
    }
}
window.addEventListener('load', init);
function init() {
    const ZombieGame = new Game();
    window.setInterval(ZombieGame.draw, 1000 / 30);
}
class Player extends Entity {
    constructor(canvas, imageSource, xCoor, yCoor, width, height) {
        super(canvas, imageSource, xCoor, yCoor, width, height);
        width = 32;
        height = 32;
        this._keyboardListener = new KeyBoardListener();
    }
    move() {
        if (this._keyboardListener.getLeftPressed()) {
            this._xPos -= 2;
        }
        if (this._keyboardListener.getUpPressed()) {
            this._yPos -= 2;
        }
        if (this._keyboardListener.getRightPressed()) {
            this._xPos += 2;
        }
        if (this._keyboardListener.getdownPressed()) {
            this._yPos += 2;
        }
    }
    isColliding(enemy) {
        if (this.getX() < enemy.getX() + enemy.getWidth() &&
            this.getX() + this.getWidth() > enemy.getX() &&
            this.getY() < enemy.getY() + enemy.getHeight() &&
            this.getY() + this.getHeight() > enemy.getY()) {
            return true;
        }
        return false;
    }
}
class Zombie extends Entity {
    constructor(canvas, imageSource, xCoor, yCoor, width, height) {
        super(canvas, imageSource, xCoor, yCoor, width, height);
        width = 32;
        height = 36;
        this._keyboardListener = new KeyBoardListener();
    }
    move() {
        if (this._keyboardListener.getAPressed()) {
            this._xPos -= 3.5;
        }
        if (this._keyboardListener.getWPressed()) {
            this._yPos -= 3.5;
        }
        if (this._keyboardListener.getDPressed()) {
            this._xPos += 3.5;
        }
        if (this._keyboardListener.getSPressed()) {
            this._yPos += 3.5;
        }
    }
    respawn() {
        this._xPos = 10;
        this._yPos = 10;
    }
    follow(ally) {
        if (this.getX() < ally.getX()) {
            this._xPos += 0.75;
        }
        else if (this.getX() > ally.getX()) {
            this._xPos -= 0.75;
        }
        if (this.getY() < ally.getY()) {
            this._yPos += 0.75;
        }
        else if (this.getY() > ally.getY()) {
            this._yPos -= 0.75;
        }
    }
}
class KeyBoardListener {
    constructor() {
        this.keyDownHandler = (event) => {
            if (event.keyCode == 37) {
                this.leftPressed = true;
            }
            if (event.keyCode == 65) {
                this.aPressed = true;
                console.log("hallo");
            }
            if (event.keyCode == 38) {
                this.upPressed = true;
            }
            if (event.keyCode == 87) {
                this.wPressed = true;
            }
            if (event.keyCode == 39) {
                this.rightPressed = true;
            }
            if (event.keyCode == 68) {
                this.dPressed = true;
            }
            if (event.keyCode == 40) {
                this.downPressed = true;
            }
            if (event.keyCode == 83) {
                this.sPressed = true;
            }
        };
        this.keyUpHandler = (event) => {
            if (event.keyCode == 37) {
                this.leftPressed = false;
            }
            if (event.keyCode == 65) {
                this.aPressed = false;
            }
            if (event.keyCode == 38) {
                this.upPressed = false;
            }
            if (event.keyCode == 87) {
                this.wPressed = false;
            }
            if (event.keyCode == 39) {
                this.rightPressed = false;
            }
            if (event.keyCode == 68) {
                this.dPressed = false;
            }
            if (event.keyCode == 40) {
                this.downPressed = false;
            }
            if (event.keyCode == 83) {
                this.sPressed = false;
            }
        };
        this.leftPressed = false;
        this.upPressed = false;
        this.rightPressed = false;
        this.downPressed = false;
        this.aPressed = false;
        this.wPressed = false;
        this.dPressed = false;
        this.sPressed = false;
        window.addEventListener("keydown", this.keyDownHandler);
        window.addEventListener("keyup", this.keyUpHandler);
    }
    getAPressed() {
        return this.aPressed;
    }
    getWPressed() {
        return this.wPressed;
    }
    getDPressed() {
        return this.dPressed;
    }
    getSPressed() {
        return this.sPressed;
    }
    getLeftPressed() {
        return this.leftPressed;
    }
    getUpPressed() {
        return this.upPressed;
    }
    getRightPressed() {
        return this.rightPressed;
    }
    getdownPressed() {
        return this.downPressed;
    }
}
//# sourceMappingURL=app.js.map
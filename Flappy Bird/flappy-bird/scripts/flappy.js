let play = false;
let speed = 1;
let viewportWidth = window.innerWidth;

const flappy = {
    img: document.getElementById('flappy').style,
    color: 'yellow',
    get states() {
        return [
            `${this.color}bird-downflap.png`, 
            `${this.color}bird-midflap.png`, 
            `${this.color}bird-upflap.png`
        ];
    },
    state: 0,
    rot: 0,
    y : 50,
    yMult: 0,
    flyInterval: null,
    rotAnim: null,
    update: function() {
        this.img.bottom = `${this.y}%`;
        this.img.transform = `rotate(${this.rot}deg)`;
    },
    fly: function() {
        this.yMult = 0;
        this.y += 20;
        this.rot = -40;
        this.update();
        clearInterval(this.rotAnim);
        this.rotAnim = setInterval(() => {
            if (this.rot < 90 && this.y > 0) this.rot += 5;
            this.update();
        }, 40);
    },
    flyAnim: function() {
        clearInterval(thi.s.flyInterval);
        this.flyInterval = setInterval(() => {
            if (this.y <= 0) return;
            this.state = (this.state + 1) % 3;
            this.img.background = `url("./images/${this.states[this.state]}")`;
        }, 100);
    }
}

const pipes = {
    gap: 400,
    count: Math.floor(viewportWidth/410),
    arr: [],
    load: function() {
        document.getElementById('pipes').innerHTML = '';
        for (let i = 1; i <= this.count; i++) {
            const pipe = document.createElement('div');
            pipe.className = 'pipe';
            pipe.id = `pipe${i}`;
            document.getElementById('pipes').appendChild(pipe);
            pipes.arr.push({
                img: document.getElementById(`pipe${i}`).style,
                w: 110,
                x: viewportWidth + (i * this.gap),
                y: Math.floor(Math.random() * (75 - 35 + 1)) + 35,
                reset: function() {
                    this.y = Math.floor(Math.random() * (75 - 35 + 1)) + 35;
                    this.x = viewportWidth;
                },
                update: function() {
                    this.img.left = `${this.x}px`;
                    this.img.top = `${this.y}%`;
                },
                checkHit: function() {
                    if (this.x <= viewportWidth/2 && this.x + this.w >= viewportWidth/2) {
                        const divHeight = document.getElementById('play-area').offsetHeight;
                        const actualFlappy = flappy.y + Math.ceil((51/divHeight) * 100);
                        if ((actualFlappy) < (100-this.y)) {
                            stopGame();
                        }
                    }
                }
            });
        };
    }
}

const base = {
    img: document.getElementById('base').style,
    x: viewportWidth,
    update: function() {
        this.img.backgroundPosition = `${this.x}px center`;
    }
}

const bg = {
    img: document.getElementById('game-box').style,
    x: 0,
    update: function() {
        this.img.backgroundPosition = `${this.x}px center`;
    }
}

flappy.flyAnim();
pipes.load();
updateViewportWidth();

setInterval(() => {
    if (!play) return;
    if (flappy.y < 0) {
        flappy.y = 0
        flappy.update();
        stopGame();
        return;
    }
    flappy.y -= flappy.yMult
    flappy.yMult += 0.5;
    flappy.update();
}, 50);

setInterval(() => {
    if (!play) return;
    pipes.arr.forEach(pipe => {
        pipe.x -= speed;
        if (pipe.x < -pipe.w) {
            pipe.reset();
        }
        pipe.update();
        pipe.checkHit();
    });
    if (base.x < 0) {
        base.x = viewportWidth;
    }
    base.x -= speed;
    bg.x -= speed * 0.05;
    base.update();
    bg.update();
    speed += 0.00025;
}, 1);

let idleAnim = setInterval(() => {
    base.x -= 0.25;
    bg.x -= speed * 0.05;
    base.update();
    bg.update();
}, 1);

function playGame() {
    play = true;
    flappy.flyAnim();
    clearInterval(idleAnim);
    flappy.img.animation = 'none';
}

function stopGame() {
    clearInterval(flappy.flyAnim);
    play = false;
    alert('GAME OVER!');
    location.reload();
}

function updateViewportWidth() {
    viewportWidth = window.innerWidth;
    pipes.count = Math.floor(viewportWidth/410)
}

document.addEventListener('keydown', (event) => {
    if (event.code !== 'Space') return;
    if (!play) playGame();
    flappy.fly();
});

document.getElementById('game-box').addEventListener('click', () => {
    if (!play) playGame();
    flappy.fly();
});

window.addEventListener('resize', () => {
    updateViewportWidth();
    pipes.load();
});

document.getElementById('yellow-bird-button').addEventListener('click', () => {
    flappy.color = 'yellow';
});
document.getElementById('red-bird-button').addEventListener('click', () => {
    flappy.color = 'red';
});
document.getElementById('blue-bird-button').addEventListener('click', () => {
    flappy.color = 'blue';
});
document.getElementById('ugly-bird-button').addEventListener('click', () => {
    flappy.color = 'ugly';
});

import { Player } from './player.js';
import { BushMaze } from './bushmaze.js';
import { Enemy } from './enemy.js';
import { Key } from './key.js';
import { loadPlayerSprites } from "./sprites.js";

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.maze = new BushMaze(60, 60);
        this.player = new Player(24, 24, '#ff0');
        this.enemies = Array(10).fill().map(() => new Enemy(this.maze));
        this.key = new Key(this.maze);
        this.keys = {};
        this.health = 100;
        this.score = 0;
        this.gameOver = false;
        this.frame = 0;

        window.addEventListener('keydown', e => {
            console.log('Key down:', e.key);
            this.keys[e.key] = true;
        });
        window.addEventListener('keyup', e => {
            console.log('Key up:', e.key);
            this.keys[e.key] = false;
        });
    }

    start() {
        console.log('Game started');
        loadPlayerSprites().then(() => {console.log("Sprites loaded!")})
        const loop = () => {
            if (!this.gameOver) {
                this.frame = (this.frame + 1) % 60;
                this.update();
                this.draw();
                this.updateStats();
            }
            requestAnimationFrame(loop);
        };
        loop();
    }

    update() {
        this.player.update(this.keys, this.maze);
        this.enemies.forEach(enemy => enemy.update(this.player, this.maze));
        if (this.checkCollision(this.player, this.key)) {
            this.score += 50;
            this.gameOver = true;
        }

        if (this.health <= 0) this.gameOver = true;
    }

    draw() {
        this.ctx.fillStyle = '#6b8e23';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const camOffset = 160;
        const camX = this.player.x - camOffset;
        const camY = this.player.y - camOffset;
        this.ctx.save();
        this.ctx.translate(-camX, -camY);

        this.maze.draw(this.ctx, this.frame);
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.key.draw(this.ctx);

        this.ctx.restore();

        if (this.gameOver) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Courier New';
            this.ctx.fillText('Game Over! Score: ' + this.score, 80, 120);
        }
    }

    updateStats() {
        const statsEl = document.getElementById('gameStats');
        if (statsEl) {
            statsEl.textContent = `Health: ${Math.max(0, this.health)} | Score: ${this.score}`;
        }
    }

    checkCollision(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (obj1.size + obj2.size) / 2;
    }
}
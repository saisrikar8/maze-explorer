import { Player } from './player.js';
import { BushMaze } from './bushmaze.js';
import { Enemy } from './enemy.js';
import { Key } from './key.js';
import { Potion } from './potion.js';
import { loadPlayerSprites } from "./sprites.js";

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.maze = new BushMaze(60, 60);
        this.player = new Player(24, 24, '#ff0');
        this.enemies = Array(10).fill().map(() => new Enemy(this.maze));
        this.key = new Key(this.maze);
        this.potions = Array(5).fill().map(() => new Potion(this.maze));

        this.keys = {};
        this.health = 100;
        this.score = 0;
        this.speedBoostTurns = 0;
        this.gameOver = false;
        this.frame = 0;

        this.isPunching = false;
        this.punchFrame = 0;
        this.maxPunchFrames = 10;

        window.addEventListener('keydown', e => {
            this.keys[e.key] = true;
            if (e.key === ' ' && !this.isPunching) {
                this.isPunching = true;
                this.punchFrame = this.maxPunchFrames;
                this.handlePunch();
            }
        });

        window.addEventListener('keyup', e => {
            this.keys[e.key] = false;
        });
    }

    start() {
        loadPlayerSprites().then(() => {
            this.loop();
        });
    }

    loop() {
        if (!this.gameOver) {
            this.frame = (this.frame + 1) % 60;
            this.update();
            this.draw();
            this.updateStats();
            requestAnimationFrame(() => this.loop());
        } else {
            this.drawGameOver();
        }
    }

    update() {
        this.player.expression = 'neutral';
        if (this.speedBoostTurns > 0) {
            this.player.speed = 4;
            this.player.expression = 'happy';
            this.speedBoostTurns--;
        } else {
            this.player.speed = 2;
        }

        this.player.update(this.keys, this.maze);
        this.enemies.forEach(enemy => enemy.update(this.player, this.maze));

        for (const enemy of this.enemies) {
            if (this.checkCollision(this.player, enemy)) {
                this.health -= 1;
                this.player.expression = 'hurt';
                if (this.health <= 0) {
                    this.gameOver = true;
                }
            }
        }

        if (this.checkCollision(this.player, this.key)) {
            this.score += 50;
            this.key = new Key(this.maze);
        }

        for (let i = this.potions.length - 1; i >= 0; i--) {
            const potion = this.potions[i];
            if (this.checkCollision(this.player, potion)) {
                this.applyPotionEffect(potion);
                this.potions.splice(i, 1);
                this.potions.push(new Potion(this.maze));
            }
        }

        const exitX = this.maze.exit.x * this.maze.tileSize + this.maze.tileSize / 2;
        const exitY = this.maze.exit.y * this.maze.tileSize + this.maze.tileSize / 2;
        const exitObj = { x: exitX, y: exitY, size: this.maze.tileSize };
        if (this.checkCollision(this.player, exitObj)) {
            this.gameOver = true;
        }

        if (this.punchFrame > 0) {
            this.punchFrame--;
            this.player.expression = 'angry';
            if (this.punchFrame === 0) {
                this.isPunching = false;
            }
        }
    }

    applyPotionEffect(potion) {
        switch (potion.type) {
            case 'health':
                this.health = Math.min(100, this.health + 30);
                break;
            case 'speed':
                this.speedBoostTurns = 300;
                break;
            case 'score':
                this.score += 100;
                break;
        }
    }

    handlePunch() {
        const punchRange = 20;
        this.player.expression = 'angry'
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const dx = enemy.x - this.player.x;
            const dy = enemy.y - this.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < punchRange) {
                enemy.health -= 0.5;
                if (enemy.health <= 0) {
                    this.enemies.splice(i, 1);
                    this.enemies.push(new Enemy(this.maze));
                    this.score += 25;
                }
            }
        }
    }

    draw() {
        this.ctx.fillStyle = '#6b8e23';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const camOffset = 160;
        let camX = Math.floor(this.player.x - camOffset);
        let camY = Math.floor(this.player.y - camOffset);

        this.ctx.save();
        this.ctx.translate(-camX, -camY);

        this.maze.draw(this.ctx, this.frame);
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.key.draw(this.ctx);
        this.potions.forEach(potion => potion.draw(this.ctx));

        if (this.isPunching && this.punchFrame > 0) {
            const angle = (this.maxPunchFrames - this.punchFrame) / this.maxPunchFrames * Math.PI / 2;
            const punchX = this.player.x + Math.cos(angle) * 10;
            const punchY = this.player.y - 6 + Math.sin(angle) * 4;

            this.ctx.save();
            this.ctx.translate(punchX, punchY);
            this.ctx.fillStyle = '#ffcc99';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 4, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.globalAlpha = 0.3;
            this.ctx.beginPath();
            this.ctx.arc(-3, 0, 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        this.ctx.restore();

        this.drawHealthBar();
        this.drawScore();
    }

    drawHealthBar() {
        const barX = 20;
        const barY = 20;
        const barWidth = 150;
        const barHeight = 12;

        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        const healthPercent = Math.max(0, this.health) / 100;
        const green = Math.floor(255 * healthPercent);
        const red = 255 - green;
        this.ctx.fillStyle = `rgb(${red},${green},0)`;
        this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px Courier New';
        this.ctx.fillText(`Health: ${Math.max(0, this.health)}`, barX + 6, barY + 10);
    }

    drawScore() {
        const x = this.canvas.width - 20;
        const y = 30;
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Courier New';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Score: ${this.score}`, x, y);
        this.ctx.textAlign = 'start';
    }

    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '40px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.font = '28px Courier New';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        this.ctx.textAlign = 'start';
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

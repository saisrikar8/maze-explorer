import { getPlayerCustomization } from './utils.js';


export class Enemy {
    constructor(maze) {
        this.difficulty = getPlayerCustomization().difficulty;
        this.x = (Math.floor(Math.random() * (maze.width - 2)) + 1) * 16 + 8;
        this.y = (Math.floor(Math.random() * (maze.height - 2)) + 1) * 16 + 8;
        this.size = 8;
        while (maze.isTallGrass(this.x, this.y)) {
            this.x = (Math.floor(Math.random() * (maze.width - 2)) + 1) * 16 + 8;
            this.y = (Math.floor(Math.random() * (maze.height - 2)) + 1) * 16 + 8;
        }
        this.color = '#f00';
        this.speed = this.difficulty === 'EASY' ? 0.4 : this.difficulty === 'MEDIUM' ? 0.8 : 1.1;
        this.health = 1;
    }

    update(player, maze) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }

        if (maze.isTallGrass(this.x, this.y)) {
            this.x -= (dx / distance) * this.speed;
            this.y -= (dy / distance) * this.speed;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(Math.floor(this.x), Math.floor(this.y));

        // Draw health bar
        const barWidth = 10;
        const barHeight = 2;
        const healthRatio = Math.max(0, this.health);
        ctx.fillStyle = '#000';
        ctx.fillRect(-barWidth / 2, -10, barWidth, barHeight);
        ctx.fillStyle = '#f00';
        ctx.fillRect(-barWidth / 2, -10, barWidth * healthRatio, barHeight);

        // Enemy sprite
        ctx.fillStyle = '#222222';
        ctx.fillRect(1, 1, 4, 2);

        ctx.fillStyle = '#f0e68c';
        ctx.fillRect(-2, -4, 1, 1);
        ctx.fillStyle = '#ff4500';
        ctx.fillRect(-1, -4, 2, 2);
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(-2, -2, 4, 3);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, -3, 1, 1);
        ctx.fillStyle = '#a52a2a';
        ctx.fillRect(-2, -1, 1, 1);
        ctx.fillRect(1, -1, 1, 1);
        ctx.fillStyle = '#fff';
        ctx.fillRect(-2, -1, 1, 1);

        ctx.restore();
    }
}

import { PlayerSprites } from './sprites.js';
import { getPlayerCustomization } from './utils.js';

const customization = getPlayerCustomization();
const spriteKey = `neutral-skin${customization.skin}-clothes${customization.clothes}${customization.prop !== 'none' ? '-' + customization.prop : ''}`;

export class Player {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 8;
        this.speed = 2;
        this.lastX = x;
        this.lastY = y;
    }

    update(keys, maze) {
        let newX = this.x;
        let newY = this.y;

        if (keys['ArrowUp']) newY -= this.speed;
        if (keys['ArrowDown']) newY += this.speed;
        if (keys['ArrowLeft']) newX -= this.speed;
        if (keys['ArrowRight']) newX += this.speed;

        // Only update if new position is not inside a wall
        const half = this.size / 2;
        const points = [
            [newX - half, newY - half],
            [newX + half, newY - half],
            [newX - half, newY + half],
            [newX + half, newY + half],
        ];

        if (points.every(([x, y]) => !maze.isWall(x, y))) {
            if (points.every(([x, y]) => maze.isTallGrass(x, y))) {
                this.x = (newX - this.x)*0.5 + this.x;
                this.y = (newY - this.y)*0.5 + this.y;
            }
            else {
                this.x = newX;
                this.y = newY;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(Math.floor(this.x) - 8, Math.floor(this.y) - 16); // Offset so player is centered
        const sprite = PlayerSprites[spriteKey];
        if (sprite) {
            ctx.drawImage(sprite, 0, 0, sprite.width * 0.5, sprite.height * 0.5);
        } else {
            // fallback if sprite is missing
            ctx.fillStyle = '#f00';
            ctx.fillRect(0, 0, 16, 16);
        }
        ctx.restore();
    }
}
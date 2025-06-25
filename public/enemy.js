export class Enemy {
    constructor(maze) {
        this.x = (Math.floor(Math.random() * (maze.width - 2)) + 1) * 16 + 8;
        this.y = (Math.floor(Math.random() * (maze.height - 2)) + 1) * 16 + 8;
        this.size = 8;
        while (maze.isTallGrass(this.x, this.y)) {
            this.x = (Math.floor(Math.random() * (maze.width - 2)) + 1) * 16 + 8;
            this.y = (Math.floor(Math.random() * (maze.height - 2)) + 1) * 16 + 8;
        }
        this.color = '#f00';
        this.speed = 1;
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
        // Bold shading
        ctx.fillStyle = '#222222'; // Darker shadow
        ctx.fillRect(1, 1, 4, 2);
        // Detailed Pidgey
        ctx.fillStyle = '#f0e68c'; // Beak
        ctx.fillRect(-2, -4, 1, 1);
        ctx.fillStyle = '#ff4500'; // Head
        ctx.fillRect(-1, -4, 2, 2);
        ctx.fillStyle = '#8b0000'; // Body
        ctx.fillRect(-2, -2, 4, 3);
        ctx.fillStyle = '#000'; // Eye
        ctx.fillRect(0, -3, 1, 1);
        ctx.fillStyle = '#a52a2a'; // Wings
        ctx.fillRect(-2, -1, 1, 1);
        ctx.fillRect(1, -1, 1, 1);
        ctx.fillStyle = '#fff'; // Wing tips
        ctx.fillRect(-2, -1, 1, 1);
        ctx.restore();
    }
}
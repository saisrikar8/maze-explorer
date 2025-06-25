export class Key {
    constructor(maze) {
        this.x = (Math.floor(Math.random() * (maze.width - 2)) + 1) * 16 + 8;
        this.y = (Math.floor(Math.random() * (maze.height - 2)) + 1) * 16 + 8;
        this.size = 8;
        while (maze.isTallGrass(this.x, this.y)) {
            this.x = (Math.floor(Math.random() * (maze.width - 2)) + 1) * 16 + 8;
            this.y = (Math.floor(Math.random() * (maze.height - 2)) + 1) * 16 + 8;
        }
        this.color = '#ffd700';
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(Math.floor(this.x), Math.floor(this.y));
        // Bold shading
        ctx.fillStyle = '#222222'; // Darker shadow
        ctx.fillRect(1, 1, 4, 2);
        // Detailed key
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-3, -2, 6, 1); // Top
        ctx.fillRect(-2, -1, 4, 3); // Body
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(-1, 1, 2, 2); // Handle
        ctx.fillStyle = '#fff'; // Highlight
        ctx.fillRect(-2, -1, 1, 1);
        ctx.restore();
    }
}
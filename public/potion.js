export class Potion {
    constructor(maze) {
        this.x = (Math.floor(Math.random() * (maze.width - 2)) + 1) * 16 + 8;
        this.y = (Math.floor(Math.random() * (maze.height - 2)) + 1) * 16 + 8;
        this.size = 12;
        while (!maze.isWall(this.x, this.y)) {
            this.x = (Math.floor(Math.random() * (maze.width - 2)) + 1) * 16 + 8;
            this.y = (Math.floor(Math.random() * (maze.height - 2)) + 1) * 16 + 8;
        }
        this.color = '#0ff';
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(Math.floor(this.x), Math.floor(this.y));
        ctx.fillStyle = this.color;
        ctx.fillRect(-6, -6, 12, 12);
        ctx.fillStyle = '#000';
        ctx.fillRect(-3, -3, 6, 6);
        ctx.restore();
    }
}
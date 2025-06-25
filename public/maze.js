export class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileSize = 16;
        this.grid = this.generateMaze();
        this.exit = { x: width - 2, y: height - 2 };
    }

    generateMaze() {
        const grid = Array(this.height).fill().map(() => Array(this.width).fill(1));
        const stack = [];
        let current = { x: 1, y: 1 };
        grid[current.y][current.x] = 0;

        while (true) {
            const neighbors = this.getUnvisitedNeighbors(current, grid);
            if (neighbors.length === 0) {
                if (stack.length === 0) break;
                current = stack.pop();
                continue;
            }
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            const dx = next.x - current.x;
            const dy = next.y - current.y;
            grid[current.y + dy][current.x + dx] = 0;
            grid[next.y][next.x] = 0;
            stack.push(current);
            current = next;
        }
        return grid;
    }

    getUnvisitedNeighbors(cell, grid) {
        const neighbors = [];
        const directions = [[0, -2], [0, 2], [-2, 0], [2, 0]];
        for (let [dx, dy] of directions) {
            const newX = cell.x + dx;
            const newY = cell.y + dy;
            if (newX > 0 && newX < this.width - 1 && newY > 0 && newY < this.height - 1 && grid[newY][newX] === 1) {
                neighbors.push({ x: newX, y: newY });
            }
        }
        return neighbors;
    }

    draw(ctx) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                ctx.fillStyle = this.grid[y][x] ? '#333' : '#555';
                ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }
        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.exit.x * this.tileSize, this.exit.y * this.tileSize, this.tileSize, this.tileSize);
    }

    isWall(x, y) {
        const gridX = Math.floor(x / this.tileSize);
        const gridY = Math.floor(y / this.tileSize);
        if (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) return true;
        return this.grid[gridY][gridX] === 1;
    }
}
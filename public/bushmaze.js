export class BushMaze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileSize = 16;
        this.grid = this.generateMaze();
        this.exit = this.generateFinishLineOpening();
        this.bambooData = Array(this.height).fill().map(() => Array(this.width).fill(null));
        this.precomputeBamboo();
    }

    generateMaze() {
        const grid = Array(this.height).fill().map(() => Array(this.width).fill(1));
        const stack = [];
        const visited = Array(this.height).fill().map(() => Array(this.width).fill(false));
        let current = { x: 1, y: 1 };
        visited[current.y][current.x] = true;
        grid[current.y][current.x] = 0;

        while (true) {
            const neighbors = this.getUnvisitedNeighbors(current, visited);
            if (neighbors.length === 0) {
                if (stack.length === 0) break;
                current = stack.pop();
                continue;
            }
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            const dx = next.x - current.x;
            const dy = next.y - current.y;
            grid[current.y + dy / 2][current.x + dx / 2] = 0;
            grid[next.y][next.x] = 0;
            visited[next.y][next.x] = true;
            stack.push(current);
            current = next;
        }

        const treeRowCount = 20;
        for (let i = 0; i < treeRowCount; i++) {
            const horizontal = Math.random() < 0.5;
            if (horizontal) {
                const row = 2 + Math.floor(Math.random() * (this.height - 4));
                const length = 3 + Math.floor(Math.random() * 4);
                const startCol = 1 + Math.floor(Math.random() * (this.width - 1 - length));
                for (let c = startCol; c < startCol + length; c++) {
                    if (grid[row][c] === 1) {
                        grid[row][c] = 3;
                    }
                }
            } else {
                const col = 2 + Math.floor(Math.random() * (this.width - 4));
                const length = 3 + Math.floor(Math.random() * 4);
                const startRow = 1 + Math.floor(Math.random() * (this.height - 1 - length));
                for (let r = startRow; r < startRow + length; r++) {
                    if (grid[r][col] === 1) {
                        grid[r][col] = 3;
                    }
                }
            }
        }

        for (let i = 0; i < 150; i++) {
            const rx = Math.floor(Math.random() * this.width);
            const ry = Math.floor(Math.random() * this.height);
            if (grid[ry][rx] === 0) grid[ry][rx] = 2;
        }

        return grid;
    }

    generateFinishLineOpening() {
        // Make an opening in the outer wall near the bottom right corner, either at bottom row or right column edge

        const margin = 2; // stay inside by this many tiles from corner

        // Try bottom edge opening
        let fx = this.width - 1 - margin;
        let fy = this.height - 1;

        // Carve opening on bottom edge
        this.grid[fy][fx] = 4; // finish tile

        // Also open the tile just inside so player can walk out (bottom row is outer wall)
        this.grid[fy - 1][fx] = 0;

        return { x: fx, y: fy };
    }

    precomputeBamboo() {
        const gridSize = 4; // 4x4 bamboo grid
        const spacing = this.tileSize / gridSize;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x] === 2) {
                    const stalks = [];

                    for (let gy = 0; gy < gridSize; gy++) {
                        for (let gx = 0; gx < gridSize; gx++) {
                            stalks.push({
                                baseX: gx * spacing + spacing / 2,
                                baseY: gy * spacing + spacing / 2,
                                segments: 1,
                                rotation: 0
                            });
                        }
                    }

                    this.bambooData[y][x] = stalks;
                }
            }
        }
    }

    getUnvisitedNeighbors(cell, visited) {
        const neighbors = [];
        const directions = [[0, -2], [0, 2], [-2, 0], [2, 0]];
        for (let [dx, dy] of directions) {
            const newX = cell.x + dx;
            const newY = cell.y + dy;
            if (newX > 0 && newX < this.width - 1 && newY > 0 && newY < this.height - 1 && !visited[newY][newX]) {
                neighbors.push({ x: newX, y: newY });
            }
        }
        return neighbors;
    }

    isWall(x, y) {
        const gridX = Math.floor(x / this.tileSize);
        const gridY = Math.floor(y / this.tileSize);
        if (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) return true;
        const tile = this.grid[gridY][gridX];
        return tile === 1 || tile === 3;
    }

    draw(ctx, frame) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tileX = x * this.tileSize;
                const tileY = y * this.tileSize;
                const tile = this.grid[y][x];

                ctx.save();
                ctx.translate(tileX, tileY);

                function drawIsoEllipseWithOutline(cx, cy, rx, ry, fillStyle) {
                    ctx.fillStyle = fillStyle;
                    ctx.beginPath();
                    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }

                function drawLeafSquiggles(cx, cy, rx, ry, count) {
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 0.6;
                    for (let i = 0; i < count; i++) {
                        const startX = cx + (Math.random() * rx * 1.1 - rx * 0.55);
                        const startY = cy + (Math.random() * ry * 1.1 - ry * 0.55);

                        ctx.beginPath();
                        ctx.moveTo(startX, startY);

                        const segments = 3 + Math.floor(Math.random() * 2);
                        let prevX = startX;
                        let prevY = startY;
                        for (let s = 0; s < segments; s++) {
                            const dx = (Math.random() * 3 - 1.5);
                            const dy = (Math.random() * 1.5 - 0.75);
                            const cpX = prevX + dx / 2;
                            const cpY = prevY + dy / 2;
                            const nextX = prevX + dx;
                            const nextY = prevY + dy;
                            ctx.quadraticCurveTo(cpX, cpY, nextX, nextY);
                            prevX = nextX;
                            prevY = nextY;
                        }
                        ctx.stroke();
                    }
                }

                function drawDiamond(cx, cy, width, height, fillStyle) {
                    ctx.fillStyle = fillStyle;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - height / 2);
                    ctx.lineTo(cx + width / 2, cy);
                    ctx.lineTo(cx, cy + height / 2);
                    ctx.lineTo(cx - width / 2, cy);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }

                function drawFlag(cx, cy) {
                    // Flagpole
                    ctx.fillStyle = '#654321';
                    ctx.fillRect(cx - 1, cy - 14, 2, 14);

                    // Flag
                    ctx.fillStyle = '#ff0000';
                    ctx.beginPath();
                    ctx.moveTo(cx + 1, cy - 14);
                    ctx.lineTo(cx + 10, cy - 10);
                    ctx.lineTo(cx + 1, cy - 6);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                if (tile === 1) {
                    // Wall tile (Pokémon-style brick with depth)
                    ctx.fillStyle = '#3b3b3b'; ctx.fillRect(0, 0, 16, 16);
                    ctx.fillStyle = '#5a5a5a'; ctx.fillRect(0, 0, 16, 6);
                    ctx.fillStyle = '#222'; ctx.fillRect(0, 14, 16, 2);
                    ctx.fillStyle = '#444'; ctx.fillRect(0, 0, 2, 16);
                } else if (tile === 3) {
                    // Darker oak-style isometric tree with outline only on big shapes

                    // Trunk with outline
                    ctx.fillStyle = '#6e4f27';
                    ctx.beginPath();
                    ctx.moveTo(8, 10);
                    ctx.lineTo(11, 12);
                    ctx.lineTo(11, 16);
                    ctx.lineTo(8, 18);
                    ctx.lineTo(5, 16);
                    ctx.lineTo(5, 12);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 0.8;
                    ctx.stroke();

                    ctx.fillStyle = '#8b6437';
                    ctx.beginPath();
                    ctx.moveTo(5, 12);
                    ctx.lineTo(4, 13);
                    ctx.lineTo(4, 17);
                    ctx.lineTo(5, 16);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#563d16';
                    ctx.beginPath();
                    ctx.moveTo(11, 12);
                    ctx.lineTo(12, 13);
                    ctx.lineTo(12, 17);
                    ctx.lineTo(11, 16);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();

                    // Leaves — big ellipses with outline but NO squiggles inside
                    drawIsoEllipseWithOutline(8, 7, 10, 6, '#4c7a3e');

                    ctx.fillStyle = '#36632b';
                    ctx.beginPath();
                    ctx.ellipse(14, 7, 5, 3, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#5c8a48';
                    ctx.beginPath();
                    ctx.ellipse(2, 7, 5, 3, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    drawIsoEllipseWithOutline(8, 4, 7, 4, '#5d8e3f');

                    ctx.fillStyle = '#466e33';
                    ctx.beginPath();
                    ctx.ellipse(13, 4, 4, 2.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#7a9f5b';
                    ctx.beginPath();
                    ctx.ellipse(3, 4, 4, 2.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    drawIsoEllipseWithOutline(8, 1, 4, 2.5, '#6f9a45');

                    ctx.fillStyle = '#528040';
                    ctx.beginPath();
                    ctx.ellipse(12, 1, 2, 1.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#8ca95a';
                    ctx.beginPath();
                    ctx.ellipse(4, 1, 2, 1.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                } else if (tile === 2) {
                    // Bamboo background fill
                    ctx.fillStyle = '#4f8b3b';
                    ctx.fillRect(0, 0, 16, 16);

                    // Draw bamboo stalks
                    const stalks = this.bambooData[y][x];
                    if (stalks) {
                        for (const stalk of stalks) {
                            ctx.save();
                            ctx.translate(stalk.baseX, stalk.baseY);
                            ctx.rotate(stalk.rotation);

                            const diamondWidth = 2.5;
                            const diamondHeight = 5;

                            for (let s = 0; s < stalk.segments; s++) {
                                const cx = 0;
                                const cy = -s * diamondHeight * 0.9;

                                // Diamond main face
                                drawDiamond(cx, cy, diamondWidth, diamondHeight, '#5db36f');

                                // Right side shadow
                                ctx.fillStyle = '#3a7c43';
                                ctx.beginPath();
                                ctx.moveTo(cx, cy - diamondHeight / 2);
                                ctx.lineTo(cx + diamondWidth / 2, cy);
                                ctx.lineTo(cx + diamondWidth / 2, cy + diamondHeight / 2);
                                ctx.lineTo(cx, cy + diamondHeight / 2);
                                ctx.closePath();
                                ctx.fill();
                                ctx.stroke();

                                // Left side highlight
                                ctx.fillStyle = '#81c17d';
                                ctx.beginPath();
                                ctx.moveTo(cx, cy - diamondHeight / 2);
                                ctx.lineTo(cx - diamondWidth / 2, cy);
                                ctx.lineTo(cx - diamondWidth / 2, cy + diamondHeight / 2);
                                ctx.lineTo(cx, cy + diamondHeight / 2);
                                ctx.closePath();
                                ctx.fill();
                                ctx.stroke();

                                // Bamboo joint
                                drawDiamond(cx, cy - diamondHeight / 4, diamondWidth * 1.1, diamondHeight / 4, '#a0d9a3');
                            }

                            ctx.restore();
                        }
                    }
                } else if (tile === 4) {
                    // Finish line flag tile (opening in outer wall)
                    ctx.fillStyle = '#8ed65e'; // grass base under opening
                    ctx.fillRect(0, 0, 16, 16);
                    drawFlag(4, 12);
                } else {
                    // Grass ground
                    ctx.fillStyle = '#8ed65e';
                    ctx.fillRect(0, 0, 16, 16);
                }

                ctx.restore();
            }
        }
    }

    isTallGrass(x, y) {
        const gridX = Math.floor(x / this.tileSize);
        const gridY = Math.floor(y / this.tileSize);
        if (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) return false;
        return this.grid[gridY][gridX] === 2;
    }
}

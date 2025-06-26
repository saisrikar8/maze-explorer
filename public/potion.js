export class Potion {
    constructor(maze) {
        this.types = ['health', 'speed', 'score'];
        this.type = this.types[Math.floor(Math.random() * this.types.length)];

        this.x = (Math.floor(Math.random() * (maze.width - 2)) + 1) * maze.tileSize + maze.tileSize / 2;
        this.y = (Math.floor(Math.random() * (maze.height - 2)) + 1) * maze.tileSize + maze.tileSize / 2;
        this.size = 12;

        while (maze.isWall(this.x, this.y) || maze.isTallGrass(this.x, this.y)) {
            this.x = (Math.floor(Math.random() * (maze.width - 2)) + 1) * maze.tileSize + maze.tileSize / 2;
            this.y = (Math.floor(Math.random() * (maze.height - 2)) + 1) * maze.tileSize + maze.tileSize / 2;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const scale = 0.75;  // scale down overall size
        const baseRadiusX = (this.size / 2) * scale;
        const baseRadiusY = baseRadiusX * 1.1;
        const neckHeight = baseRadiusY * 1.2 * scale;
        const neckWidth = baseRadiusX * 0.6 * scale; // wider neck
        const corkHeight = neckWidth * 0.6;

        // Colors by potion type
        const colorMap = {
            health: '#ff4444',
            speed: '#44ff44',
            score: '#4444ff'
        };
        const liquidColor = colorMap[this.type] || '#0ff';

        // Draw bottle bulb (ellipse)
        ctx.fillStyle = '#ccc';
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;

        ctx.beginPath();
        ctx.ellipse(0, 0, baseRadiusX, baseRadiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw neck
        ctx.beginPath();
        ctx.moveTo(-neckWidth / 2, -baseRadiusY);
        ctx.lineTo(-neckWidth / 2, -baseRadiusY - neckHeight);
        ctx.quadraticCurveTo(0, -baseRadiusY - neckHeight - neckWidth * 0.3, neckWidth / 2, -baseRadiusY - neckHeight);
        ctx.lineTo(neckWidth / 2, -baseRadiusY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw cork
        ctx.fillStyle = '#b5651d'; // cork brown
        ctx.beginPath();
        ctx.rect(-neckWidth / 2, -baseRadiusY - neckHeight - corkHeight, neckWidth, corkHeight);
        ctx.fill();
        ctx.stroke();

        // Draw liquid inside bulb - CLIPPED to bulb ellipse with flat top at liquid level
        const liquidLevelY = baseRadiusY * 0.2; // liquid surface y

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, 0, baseRadiusX, baseRadiusY, 0, 0, Math.PI * 2);
        ctx.clip();

        ctx.fillStyle = liquidColor;
        ctx.beginPath();
        ctx.moveTo(-baseRadiusX, baseRadiusY);
        ctx.ellipse(0, 0, baseRadiusX, baseRadiusY, 0, Math.PI, 0, true);
        ctx.lineTo(baseRadiusX, liquidLevelY);
        ctx.lineTo(-baseRadiusX, liquidLevelY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Draw liquid inside neck
        const neckLiquidHeight = neckHeight * 0.6; // 60% full

        ctx.fillRect(
            -neckWidth / 2,
            -baseRadiusY - neckLiquidHeight,
            neckWidth,
            neckLiquidHeight
        );

        // Shine on bulb
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.ellipse(-baseRadiusX * 0.3, -baseRadiusY * 0.4, baseRadiusX * 0.3, baseRadiusY * 0.6, Math.PI / 8, 0, Math.PI * 2);
        ctx.fill();

        // Shine on neck
        ctx.beginPath();
        ctx.ellipse(0, -baseRadiusY - neckHeight / 2, neckWidth * 0.2, neckHeight * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }


}

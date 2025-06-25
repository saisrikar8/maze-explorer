const { createCanvas } = require('canvas');
const fs = require('fs');

const PIXEL_SIZE = 4;
const SPRITE_WIDTH = 6;
const SPRITE_HEIGHT = 10; // Height to fit tighter

function drawPixel(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
}

function drawProp(ctx, propName) {
    if (!propName) return;

    if (propName === 'hat') {
        // Hat on rows 0 and 1, tight to head
        drawPixel(ctx, 1, 0, '#222');
        drawPixel(ctx, 2, 0, '#444');
        drawPixel(ctx, 3, 0, '#444');
        drawPixel(ctx, 4, 0, '#222');

        drawPixel(ctx, 1, 1, '#222');
        drawPixel(ctx, 4, 1, '#222');
    } else if (propName === 'crown') {
        // Burger King style simple crown: 3 gold bumps with a red jewel in the middle

        // Top row: 3 gold bumps at x=0,2,4 y=0
        drawPixel(ctx, 0.75, 0, '#fc0'); // gold bump left
        drawPixel(ctx, (4.75/2), 0, '#fc0'); // gold bump middle
        drawPixel(ctx, 4, 0, '#fc0'); // gold bump right

        // Bottom row: 5 gold pixels with jewel in the middle (x=2)
        drawPixel(ctx, 0.75, 1, '#fc0'); // gold left edge
        drawPixel(ctx, 1.75, 1, '#fc0');
        drawPixel(ctx, 2.75, 1, '#f00'); // red jewel center
        drawPixel(ctx, 3.75, 1, '#fc0');
        drawPixel(ctx, 4, 1, '#fc0');
    } else if (propName === 'cape') {
        drawPixel(ctx, 0.9, 4, '#a00');
        drawPixel(ctx, 0.7, 5, '#a00');
        drawPixel(ctx, 0.5, 6, '#a00');
        drawPixel(ctx, 0.3, 7, '#a00');
        drawPixel(ctx, 0.1, 8, '#a00');
        drawPixel(ctx, 0, 9, '#a00');


        drawPixel(ctx, 4.1, 4, '#a00');
        drawPixel(ctx, 4.3, 5, '#a00');
        drawPixel(ctx, 4.5, 6, '#a00');
        drawPixel(ctx, 4.7, 7, '#a00');
        drawPixel(ctx, 4.9, 8, '#a00');
        drawPixel(ctx, 5, 9, '#a00');

        drawPixel(ctx, 1, 9, '#a00');
        drawPixel(ctx, 2, 9, '#a00');
        drawPixel(ctx, 3, 9, '#a00');
        drawPixel(ctx, 4, 9, '#a00');
    }
}

function drawPlayer(ctx, expression = 'neutral', skin = '#f1c27d', clothing = '#0033cc', prop = null) {
    // Draw props first, no vertical offset needed for props now
    drawProp(ctx, prop);

    // Head starts at y=2 to sit right below props
    const headYOffset = 2;

    // Head (skin tone)
    for (let px = 1; px <= 4; px++) {
        for (let py = 0; py <= 2; py++) {
            drawPixel(ctx, px, py + headYOffset, skin);
        }
    }

    // Body (clothing color)
    for (let px = 1; px <= 4; px++) {
        for (let py = 3; py <= 6; py++) {
            drawPixel(ctx, px, py + headYOffset, clothing);
        }
    }

    // Eyes
    drawPixel(ctx, 1, 1 + headYOffset, '#000');
    drawPixel(ctx, 4, 1 + headYOffset, '#000');

    // Expressions
    if (expression === 'neutral') {
        drawPixel(ctx, 1, 0 + headYOffset, '#333'); // eyebrows
        drawPixel(ctx, 4, 0 + headYOffset, '#333');
        drawPixel(ctx, 2, 2 + headYOffset, '#900'); // mouth
        drawPixel(ctx, 3, 2 + headYOffset, '#900');
    } else if (expression === 'happy') {
        drawPixel(ctx, 1, 0 + headYOffset, '#666');
        drawPixel(ctx, 4, 0 + headYOffset, '#666');
        drawPixel(ctx, 2, 2 + headYOffset, '#900');
        drawPixel(ctx, 3, 3 + headYOffset, '#900');
        drawPixel(ctx, 4, 2 + headYOffset, '#900');
    } else if (expression === 'angry') {
        drawPixel(ctx, 0, 0 + headYOffset, '#900');
        drawPixel(ctx, 1, 0 + headYOffset, '#900');
        drawPixel(ctx, 3, 0 + headYOffset, '#900');
        drawPixel(ctx, 4, 0 + headYOffset, '#900');
        drawPixel(ctx, 1, 1 + headYOffset, '#900');
        drawPixel(ctx, 2, 1 + headYOffset, '#000');
        drawPixel(ctx, 3, 1 + headYOffset, '#000');
        drawPixel(ctx, 4, 1 + headYOffset, '#900');
        drawPixel(ctx, 2, 2 + headYOffset, '#900');
        drawPixel(ctx, 3, 2 + headYOffset, '#900');
        drawPixel(ctx, 2, 3 + headYOffset, '#900');
        drawPixel(ctx, 3, 3 + headYOffset, '#900');
    } else if (expression === 'hurt') {
        drawPixel(ctx, 0, 0 + headYOffset, '#f00');
        drawPixel(ctx, 1, 1 + headYOffset, '#f00');
        drawPixel(ctx, 1, 0 + headYOffset, '#f00');
        drawPixel(ctx, 0, 1 + headYOffset, '#f00');
        drawPixel(ctx, 3, 0 + headYOffset, '#f00');
        drawPixel(ctx, 4, 1 + headYOffset, '#f00');
        drawPixel(ctx, 4, 0 + headYOffset, '#f00');
        drawPixel(ctx, 3, 1 + headYOffset, '#f00');
        for (let x = 2; x <= 3; x++) {
            drawPixel(ctx, x, 2 + headYOffset, '#f00');
            drawPixel(ctx, x, 3 + headYOffset, '#f00');
        }
    }
}

function exportSprite(drawFunc, filename) {
    const canvas = createCanvas(SPRITE_WIDTH * PIXEL_SIZE, SPRITE_HEIGHT * PIXEL_SIZE);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    drawFunc(ctx);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`Exported ${filename}`);
}

function drawEnemy(ctx, expression = 'neutral') {
    // Simple pixel art enemy: different expressions, fixed colors

    // Body (gray)
    for (let px = 1; px <= 4; px++) {
        for (let py = 3; py <= 7; py++) {
            drawPixel(ctx, px, py, '#555');
        }
    }

    // Head (light gray)
    for (let px = 1; px <= 4; px++) {
        for (let py = 0; py <= 2; py++) {
            drawPixel(ctx, px, py, '#999');
        }
    }

    // Eyes (black)
    drawPixel(ctx, 1, 1, '#000');
    drawPixel(ctx, 4, 1, '#000');

    // Expression details
    if (expression === 'neutral') {
        // neutral mouth
        drawPixel(ctx, 2, 3, '#333');
        drawPixel(ctx, 3, 3, '#333');
    } else if (expression === 'alert') {
        // alert eyes - bright white pixels around eyes
        drawPixel(ctx, 0, 1, '#fff');
        drawPixel(ctx, 5, 1, '#fff');
    } else if (expression === 'angry') {
        // angry eyebrows
        drawPixel(ctx, 1, 0, '#900');
        drawPixel(ctx, 4, 0, '#900');
        // angry mouth
        drawPixel(ctx, 2, 3, '#900');
        drawPixel(ctx, 3, 3, '#900');
    } else if (expression === 'hurt') {
        // hurt red marks
        drawPixel(ctx, 0, 0, '#f00');
        drawPixel(ctx, 1, 0, '#f00');
        drawPixel(ctx, 4, 0, '#f00');
        drawPixel(ctx, 5, 0, '#f00');
    }
}


const expressions = ['neutral', 'happy', 'angry', 'hurt'];
const skinTones = ['#f1c27d', '#e0ac69', '#8d5524'];
const clothes = ['#0033cc', '#8800cc', '#cc0000'];
const props = [null, 'hat', 'crown', 'cape'];

const enemyExpressions = ['neutral', 'alert', 'angry', 'hurt'];

for (const expr of enemyExpressions) {
    const filename = `enemy-${expr}.png`;
    exportSprite(ctx => drawEnemy(ctx, expr), filename);
}

for (const expr of expressions) {
    for (const skin of skinTones) {
        for (const clothing of clothes) {
            for (const prop of props) {
                const filename = `player-${expr}-skin${skin.replace('#', '')}-clothes${clothing.replace('#', '')}${prop ? '-' + prop : ''}.png`;
                exportSprite(ctx => drawPlayer(ctx, expr, skin, clothing, prop), filename);
            }
        }
    }
}

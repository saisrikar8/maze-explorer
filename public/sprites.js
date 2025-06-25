const playerExpressions = ['neutral', 'happy', 'angry', 'hurt'];
const skinTones = ['f1c27d', 'e0ac69', '8d5524'];
const clothes = ['0033cc', '8800cc', 'cc0000'];
const props = [null, 'hat', 'crown', 'cape'];

const enemyExpressions = ['neutral', 'alert', 'angry', 'hurt'];

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}

export const PlayerSprites = {}; // key: `${expr}-skin${skin}-clothes${clothes}[-prop]`
export const EnemySprites = {};

// Load all player sprites based on naming scheme
export async function loadPlayerSprites() {
    const promises = [];

    for (const expr of playerExpressions) {
        for (const skin of skinTones) {
            for (const cloth of clothes) {
                for (const prop of props) {
                    const key = `${expr}-skin${skin}-clothes${cloth}${prop ? '-' + prop : ''}`;
                    const filename = `assets/player-${key}.png`;
                    const path = `./${filename}`; // assumes images are in the same directory

                    const p = loadImage(path)
                        .then(img => PlayerSprites[key] = img)
                        .catch(err => console.warn(`[Missing] ${filename}`));

                    promises.push(p);
                }
            }
        }
    }

    return Promise.all(promises);
}

// Load all basic enemy sprites
export async function loadEnemySprites() {
    const promises = enemyExpressions.map(expr => {
        const path = `assets/enemy-${expr}.png`;
        return loadImage(path)
            .then(img => EnemySprites[expr] = img)
            .catch(err => console.warn(`[Missing] enemy-${expr}.png`));
    });

    return Promise.all(promises);
}

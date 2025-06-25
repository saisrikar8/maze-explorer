import { PlayerSprites, loadPlayerSprites } from './sprites.js';

const skinTones = ['f1c27d', 'e0ac69', '8d5524'];
const clothes = ['0033cc', '8800cc', 'cc0000'];
const props = [null, 'hat', 'crown', 'cape'];

const expression = 'neutral';

const selection = {
    prop: 0,
    skin: 0,
    clothes: 0,
    difficulty: 'easy',  // default difficulty
};

const avatarImg = document.getElementById('avatar-img');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');

function getSpriteKey() {
    let key = `${expression}-skin${skinTones[selection.skin]}-clothes${clothes[selection.clothes]}`;
    if (props[selection.prop]) {
        key += `-${props[selection.prop]}`;
    }
    return key;
}

function updateAvatar() {
    const key = getSpriteKey();
    if (key) {
        avatarImg.src = './assets/player-' + key + '.png';
        avatarImg.alt = 'Avatar: ' + key + ''
    } else {
        avatarImg.src = '';
        console.warn(`Missing sprite for key: ${key}`);
    }
}

function changeSelection(type, delta) {
    let arrLength = 0;
    if (type === 'prop') arrLength = props.length;
    else if (type === 'skin') arrLength = skinTones.length;
    else if (type === 'clothes') arrLength = clothes.length;

    selection[type] = (selection[type] + delta + arrLength) % arrLength;
    updateAvatar();
}

function updateDifficultySelection() {
    difficultyButtons.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.difficulty === selection.difficulty);
    });
}

difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        selection.difficulty = btn.dataset.difficulty;
        updateDifficultySelection();
    });
});

document.querySelectorAll('button.arrow-pixel').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const dir = parseInt(btn.dataset.dir);
        changeSelection(type, dir);
    });
});

document.getElementById('start-game-btn').addEventListener('click', () => {
    console.log(`Starting game with:\nProp: ${props[selection.prop] || 'none'}\nSkin: ${skinTones[selection.skin]}\nClothes: ${clothes[selection.clothes]}\nDifficulty: ${selection.difficulty.toUpperCase()}`);
    window.location.replace(`/game?prop=${props[selection.prop] || 'none'}&skin=${skinTones[selection.skin]}&clothes=${clothes[selection.clothes]}&difficulty=${selection.difficulty.toUpperCase()}`);
});

loadPlayerSprites().then(() => {
    updateAvatar();
    updateDifficultySelection();
}).catch(e => {
    console.error('Error loading sprites:', e);
});
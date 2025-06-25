import { Game } from './game.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const game = new Game(canvas, ctx);
    game.start();
});
const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'customization.html'), { headers: { 'Content-Type': 'text/html' } });
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'), { headers: { 'Content-Type': 'text/html' } });
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

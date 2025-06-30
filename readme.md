# Maze Explorer

A retro-style 2D dungeon crawler game built with vanilla JavaScript and HTML5 Canvas. Customize your character and appearance and navigate through procedurally generated mazes while fighting enemies, collecting keys, and gathering potions. 

## Features

- **Character Customization**: Choose from different skin tones, clothing colors, and accessories (hats, capes, crowns)
- **Procedural Maze Generation**: Each game features a unique bush maze, whose size depends on the difficulty. Generated usind DFS algorithim
- **Combat System**: Fight enemies by punching them (space)
- **Collectibles**: 
  - Health potions for healing
  - Speed boost potions for temporary movement enhancement
- **Retro Pixel Art**: Custom sprite generation system with pixelated graphics
- **Responsive Controls**: Arrow key movement with spacebar for combat

## Game Mechanics

- **Health System**: Start with 100 health, lose health when attacked by enemies
- **Score System**: Earn points for defeating enemies and collecting items
- **Enemy AI**: Enemies patrol the maze (quantity depending on difficuty). Pathfinding using custom A* algorithim
- **Power-ups**: Speed boost and health potions

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript (ES6)
- **Graphics**: HTML Canvas API with custom pixel art rendering
- **Server**: Express.js
- **Sprite Generation**: Node.js Canvas API for dynamic sprite creation
- **Deployment**: Deployed using Vercel

## Prerequisites

- Node.js 
- npm cli

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/saisrikar8/maze-explorer.git
   cd maze-explorer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   node index.cjs
   ```

4. **Open your browser and navigate to**:
   ```
   http://localhost:3000
   ```

## Project Structure

```
maze-explorer/
├── public/                    # Static web assets
│   ├── assets/                # Generated sprite images
│   ├── customization.html     # Character customization screen
│   ├── game.html              # Main game screen
│   ├── game.js                # Core game logic
│   ├── player.js              # Player character class
│   ├── enemy.js               # Enemy AI and behavior
│   ├── bushmaze.js            # Maze generation algorithm
│   ├── key.js                 # Key collectible logic
│   ├── potion.js              # Potion system (health/speed)
│   ├── sprites.js             # Sprite loading utilities
│   ├── customization.js       # Character customization logic
│   ├── maze.js                # Maze rendering utilities
│   ├── main.js                # Game initialization
│   └── utils.js               # Utility functions
├── export-sprites.cjs         # Encoded sprites 
├── index.cjs                  # Express server configuration
├── package.json               # Node.js dependencies
└── README.md                  
```

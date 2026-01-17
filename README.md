# Drifter Star

*This project was made with AI assistance*

A space survival game where you control an asteroid drifting through space. Your goal is to grow by consuming smaller celestial bodies while avoiding larger ones.

## 🎮 How to Play

- **Movement**: Use Arrow Keys or WASD to move
- **Goal**: Reach mass of 100 by consuming smaller bodies
- **Danger**: Avoid larger bodies or you'll be destroyed!

## 🚀 Getting Started

Simply open `index.html` in your web browser. No installation or build process required!

## 🎯 Game Mechanics

- **Mass System**: Start with mass 5, grow by consuming smaller bodies
- **Collision System**: 
  - Consume smaller bodies to gain mass
  - Equal mass collisions result in a bounce (neither destroyed)
  - Colliding with larger bodies destroys you
- **Movement**: Momentum-based movement with drift physics
- **Boundaries**: Wrap-around screen edges
- **Respawn**: Consumed bodies respawn in different locations

## 🛠️ Technology

- Pure HTML5 Canvas
- Vanilla JavaScript (no frameworks)
- Responsive design

## 📁 Project Structure

```
drifter-star-better/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Game styling
├── js/
│   ├── main.js        # Entry point and game loop
│   ├── game.js        # Game manager/state
│   ├── player.js      # Player entity
│   ├── body.js        # Celestial body entity
│   ├── input.js       # Input handling
│   ├── physics.js     # Collision detection
│   ├── renderer.js    # Rendering utilities
│   └── utils.js       # Helper functions
├── assets/            # Assets directory
└── README.md          # This file
```

## 🎨 Visual Design

- **Background**: Dark space with starfield
- **Player**: Cyan glowing asteroid
- **Small Bodies**: Blue (mass 1-3)
- **Medium Bodies**: Orange (mass 4-10)
- **Large Bodies**: Red (mass 11+)

## 📝 Development Status

- ✅ Phase 1: Core Setup (Foundation)
- ✅ Phase 2: Player Movement
- ⏳ Phase 3: Celestial Bodies (In Progress)
- ⏳ Phase 4: Collision System
- ⏳ Phase 5: Game Logic
- ⏳ Phase 6: Polish & Enhancement

## 📄 License

This project is open source and available for personal use.

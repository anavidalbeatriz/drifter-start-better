# Drifter Star - Implementation Plan

## Game Concept Summary
A space survival game where the player controls an asteroid drifting through space. The goal is to grow by consuming smaller celestial bodies while avoiding larger ones. Win condition: reach mass of 100.

---

## Technology Stack

### Recommended Options:
1. **Web-based (HTML5 Canvas + JavaScript/TypeScript)**
   - Framework: Phaser.js, PixiJS, or vanilla Canvas API
   - Pros: Easy to deploy, cross-platform, no installation needed
   - Best for: Quick prototype and web distribution

2. **Python (Pygame)**
   - Pros: Simple, good for prototyping, easy to learn
   - Best for: Rapid development and learning

3. **Unity (C#)**
   - Pros: Professional game engine, great physics, cross-platform
   - Best for: Polished game with advanced features

4. **Godot (GDScript/C#)**
   - Pros: Free, lightweight, good 2D support
   - Best for: Indie game development

**Recommendation: Start with HTML5 Canvas + JavaScript/TypeScript for rapid development and easy sharing.**

---

## Core Game Mechanics

### 1. Player Controls
- **Movement**: Arrow keys or WASD - **full control** (no movement limitations)
- **Physics**: Continuous drift with momentum (asteroid-like movement)
- **Visual**: Player asteroid should be visually distinct (e.g., different color, glow effect)

### 2. Mass System
- Player starts with mass = 5
- All bodies have integer mass values (1, 2, 3, etc.)
- Visual representation: Size scales with mass (e.g., radius = sqrt(mass) * baseSize)
- Display: Show current mass in UI (e.g., "Mass: 5/100")

### 3. Collision System
- **Collision Detection**: Circle-based collision (distance between centers < sum of radii)
- **Collision Resolution**:
  - Player hits smaller body → Player gains mass, smaller body is destroyed and respawns elsewhere
  - Player hits equal mass → Collision occurs, but neither player nor body is destroyed (bounce/repel effect)
  - Player hits larger body → Player is destroyed, game over

### 4. Celestial Bodies Generation
- Random number of bodies (e.g., 15-25 bodies) - **densely packed for compact space**
- Random masses (e.g., 1 to 50, but ensure some are smaller than player initially)
- Random positions (spread across playable area, ensuring good coverage)
- Random velocities (slow drift) - **bodies move continuously**
- Visual variety: Different colors/sizes based on mass
- **Important**: Space should be compact enough that player always has multiple bodies visible on screen
- **Respawn System**: When a body is consumed, it respawns in a different location (away from collision point) to maintain constant body count

### 5. Win/Lose Conditions
- **Win**: Player mass reaches 100 (no time limit)
- **Lose**: Player collides with larger body
- Show appropriate game over screen with restart option

---

## Game Architecture

### Core Components

#### 1. Game Engine/Manager
- Main game loop (update, render)
- State management (menu, playing, game over, win)
- Scene management

#### 2. Physics System
- Position updates
- Velocity and momentum
- Collision detection
- Boundary handling (wrap-around or bounce)

#### 3. Entity System
- **Player Entity**
  - Position, velocity, mass
  - Input handling
  - Render logic
  
- **Celestial Body Entity**
  - Position, velocity, mass
  - Render logic
  - Collision response

#### 4. Rendering System
- Canvas/context management
- Sprite/particle rendering
- UI overlay (mass display, instructions)
- Background (starfield effect)

#### 5. Game State
- Current player mass
- List of active celestial bodies
- Score/timer (optional)
- Game status (playing/paused/game over)

---

## Visual Design

### Visual Elements
1. **Background**: Dark space with starfield (static or parallax)
2. **Player**: Distinctive asteroid (e.g., glowing, different color)
3. **Celestial Bodies**: 
   - Vary colors by mass (e.g., blue = small, yellow = medium, red = large)
   - Size proportional to mass
   - Optional: Rotation animation
4. **UI Elements**:
   - Mass counter (top-left or top-center)
   - Win/lose message overlay
   - Instructions (on start screen)

### Color Scheme Suggestions
- Background: Deep space blue/black (#0a0a1a, #1a1a2e)
- Stars: White/yellow (#ffffff, #ffd700)
- Player: Cyan/Green (#00ffff, #00ff88)
- Small bodies: Blue (#4a90e2)
- Medium bodies: Orange (#ff8800)
- Large bodies: Red (#ff4444)

---

## Implementation Phases

### Phase 1: Core Setup (Foundation)
- [ ] Set up project structure
- [ ] Initialize game canvas/rendering context
- [ ] Create basic game loop (update, render)
- [ ] Implement basic player entity (static, no movement yet)
- [ ] Add simple background/starfield

### Phase 2: Player Movement
- [ ] Implement input handling (keyboard)
- [ ] Add player movement with momentum/drift
- [ ] Add boundary handling (wrap-around or bounce)
- [ ] Visual feedback for movement

### Phase 3: Celestial Bodies
- [ ] Create celestial body entity class
- [ ] Implement random generation system
- [ ] Add rendering for bodies (size based on mass)
- [ ] Implement basic drift movement for bodies

### Phase 4: Collision System
- [ ] Implement circle collision detection
- [ ] Add collision response logic:
  - Player consumes smaller bodies (body respawns elsewhere)
  - Equal mass collisions: bounce/repel effect (neither destroyed)
  - Player destroyed by larger bodies
- [ ] Update mass system on collision
- [ ] Implement respawn system for consumed bodies (spawn away from collision point)
- [ ] Visual feedback (particles, screen shake, etc.)

### Phase 5: Game Logic
- [ ] Implement win condition (mass = 100)
- [ ] Implement lose condition (collision with larger body)
- [ ] Add game state management (menu, playing, game over)
- [ ] Create game over/win screens
- [ ] Add restart functionality

### Phase 6: Polish & Enhancement
- [ ] Add UI elements (mass display, instructions)
- [ ] Improve visuals (particles, effects, animations)
- [ ] Add sound effects (optional)
- [ ] Balance gameplay (spawn rates, body distribution)
- [ ] Add difficulty settings (optional)
- [ ] Performance optimization

---

## Technical Specifications

### Game World
- **Canvas Size**: 600x400 or 640x480 (compact, engaging space)
  - **Rationale**: Smaller space ensures player is always near other bodies, creating constant engagement
  - Avoid large empty areas where player drifts alone
- **Boundary Behavior**: Wrap-around (player and bodies wrap to opposite side)
- **Update Rate**: 60 FPS (or use delta time for frame-independent movement)
- **Space Design**: Compact arena-style play area where bodies are always within reasonable distance

### Physics
- **Movement**: Velocity-based with friction/drag (optional)
- **Collision**: Circle-to-circle distance check
- **Mass Scaling**: `radius = baseRadius * sqrt(mass)` or `radius = baseRadius * mass^0.5`

### Body Generation
- **Initial Count**: 15-25 bodies (higher density for compact space)
- **Mass Distribution**: 
  - 40% small (1-3)
  - 40% medium (4-10)
  - 20% large (11-50)
- **Spawn**: Random positions across entire playable area, ensure no initial collisions
  - **Density Goal**: Ensure at least 3-5 bodies are always visible on screen from any position
  - Bodies should be distributed evenly, avoiding large empty zones
- **Velocity**: Small random drift (0.1-0.5 units/frame)
- **Space Utilization**: Maximize use of available space - bodies should fill the arena, not cluster in corners

### Player Settings
- **Starting Mass**: 5
- **Starting Position**: Center or random
- **Movement Speed**: Moderate (balance between control and drift feel)
- **Acceleration**: Smooth input response

---

## File Structure (Example for Web/JS)

```
drifter-star-better/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js          # Entry point, game loop
│   ├── game.js          # Game manager/state
│   ├── player.js        # Player entity
│   ├── body.js          # Celestial body entity
│   ├── physics.js       # Collision detection
│   ├── renderer.js      # Rendering utilities
│   └── utils.js         # Helper functions
├── assets/
│   ├── images/          # Sprites (if using)
│   └── sounds/          # Audio files (optional)
├── draft.md
└── IMPLEMENTATION_PLAN.md
```

---

## Next Steps

1. ~~**Choose technology stack**~~ ✅ **Chosen: Web-based (HTML5 Canvas + JavaScript/TypeScript)**
2. **Set up project structure** according to chosen stack
3. **Start with Phase 1** - get basic rendering working
4. **Iterate through phases** - test each phase before moving to next
5. **Playtest and balance** - adjust spawn rates, speeds, mass distribution

---

## Optional Enhancements (Future)

- Power-ups (speed boost, temporary invincibility)
- Different body types (planets, comets, stars)
- Obstacles (black holes, asteroid fields)
- Multiplayer mode
- Leaderboard/high scores
- Progressive difficulty (bodies get larger over time)
- Particle effects and visual polish
- Sound design and music
- Mobile touch controls

---

## Design Decisions (Answered)

1. **Equal-mass collisions**: ✅ Collision occurs, but neither player nor celestial body is destroyed (bounce/repel effect)
2. **Body movement**: ✅ Bodies move (not static) - continuous drift with random velocities
3. **Time limit**: ✅ No time limit - just mass goal (reach 100 to win)
4. **Player movement**: ✅ Full control - no movement limitations
5. **Body respawn**: ✅ Yes - bodies respawn after being consumed, in a different location from the collision point

## Space Design Philosophy

**Key Principle**: The playable space should be **compact and engaging**, not vast and empty.

- **Smaller is better**: A 600x400 or 640x480 canvas creates a more action-packed experience
- **Always visible bodies**: From any position, the player should see multiple celestial bodies on screen
- **No empty zones**: Bodies should be distributed to avoid large empty areas where the player drifts alone
- **Dense but playable**: Balance between having enough bodies for engagement and enough space to maneuver
- **Wrap-around benefits**: With wrap-around boundaries, even a small space feels larger while maintaining density

**Recommendation**: Start simple, add complexity later based on playtesting. Test with different canvas sizes (600x400, 640x480, 800x600) to find the sweet spot where the player is always engaged but not overwhelmed.

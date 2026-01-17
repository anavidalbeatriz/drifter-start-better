// Game manager and state

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        if (!this.ctx) {
            console.error('Failed to get 2D context from canvas');
            return;
        }
        
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Game state
        this.state = 'playing'; // playing, gameOver, win
        
        // Initialize input handler
        this.inputHandler = new InputHandler();
        
        // Initialize renderer
        this.renderer = new Renderer(canvas);
        
        // Initialize player (center of canvas)
        this.player = new Player(this.width / 2, this.height / 2);
        
        // Celestial bodies - generate them
        this.bodies = [];
        this.generateBodies();
        
        // UI elements
        this.massDisplay = document.getElementById('mass-display');
    }

    /**
     * Generate random celestial bodies
     */
    generateBodies() {
        // Generate 15-25 bodies (densely packed for compact space)
        const bodyCount = randomInt(15, 25);
        
        for (let i = 0; i < bodyCount; i++) {
            let x, y, mass;
            let attempts = 0;
            let validPosition = false;
            
            // Try to find a valid position (not overlapping with player or other bodies)
            while (!validPosition && attempts < 50) {
                x = random(0, this.width);
                y = random(0, this.height);
                
                // Check distance from player (should be at least player radius + some space)
                const distToPlayer = distance(x, y, this.player.x, this.player.y);
                const minDistFromPlayer = this.player.radius + 30;
                
                if (distToPlayer >= minDistFromPlayer) {
                    // Check distance from other bodies
                    let tooClose = false;
                    for (const body of this.bodies) {
                        const dist = distance(x, y, body.x, body.y);
                        const minDist = 20; // Minimum distance between bodies
                        if (dist < minDist) {
                            tooClose = true;
                            break;
                        }
                    }
                    
                    if (!tooClose) {
                        validPosition = true;
                    }
                }
                
                attempts++;
            }
            
            // If we couldn't find a perfect position, just place it randomly
            if (!validPosition) {
                x = random(0, this.width);
                y = random(0, this.height);
            }
            
            // Generate mass based on distribution:
            // 40% small (1-3), 40% medium (4-10), 20% large (11-50)
            const rand = Math.random();
            if (rand < 0.4) {
                mass = randomInt(1, 3); // Small
            } else if (rand < 0.8) {
                mass = randomInt(4, 10); // Medium
            } else {
                mass = randomInt(11, 50); // Large
            }
            
            // Create body with random drift velocity (small slow drift)
            const body = new CelestialBody(x, y, mass);
            // Small random drift: 6-30 pixels per second (0.1-0.5 units/frame at 60fps)
            body.vx = random(-30, 30);
            body.vy = random(-30, 30);
            
            this.bodies.push(body);
        }
    }

    /**
     * Update game state
     */
    update(deltaTime) {
        if (this.state !== 'playing') return;

        // Update player with input and boundaries
        this.player.update(deltaTime, this.inputHandler, this.width, this.height);
        
        // Update bodies (Phase 3)
        this.bodies.forEach(body => {
            body.update(deltaTime, this.width, this.height);
        });

        // Update UI
        this.updateUI();
    }

    /**
     * Render game
     */
    render() {
        // Clear and draw background (drawn first, behind everything)
        this.renderer.clear();
        // Pass player to skip stars behind it
        this.renderer.drawStarfield(this.player);

        // Render celestial bodies (drawn before player, so player appears on top)
        this.bodies.forEach(body => {
            body.render(this.ctx);
        });

        // Render player last (so it appears in front of everything)
        if (this.player) {
            this.player.render(this.ctx);
        }
        
        // Debug: Draw a test rectangle to verify rendering works
        // this.ctx.fillStyle = '#ff0000';
        // this.ctx.fillRect(10, 10, 50, 50);
    }

    /**
     * Update UI elements
     */
    updateUI() {
        if (this.massDisplay) {
            this.massDisplay.textContent = `Mass: ${this.player.mass}/100`;
        }
    }

    /**
     * Reset game
     */
    reset() {
        this.state = 'playing';
        this.player = new Player(this.width / 2, this.height / 2);
        this.bodies = [];
        this.generateBodies();
    }
}

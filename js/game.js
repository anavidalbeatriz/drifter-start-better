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
        
        // Setup restart key handler
        this.setupRestartHandler();
    }

    /**
     * Setup restart key handler (R key)
     */
    setupRestartHandler() {
        // Use arrow function to preserve 'this' context
        const game = this;
        window.addEventListener('keydown', function(e) {
            if (e.key.toLowerCase() === 'r' && (game.state === 'gameOver' || game.state === 'win')) {
                game.reset();
            }
        });
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
            // 45% small (1-3), 25% medium (4-10), 30% large (11-50)
            const rand = Math.random();
            if (rand < 0.45) {
                mass = randomInt(1, 3); // Small
            } else if (rand < 0.70) {
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
        
        // Update bodies
        this.bodies.forEach(body => {
            body.update(deltaTime, this.width, this.height);
        });

        // Check collisions between player and bodies
        this.checkCollisions();

        // Update UI
        this.updateUI();
    }

    /**
     * Check and handle collisions between player and celestial bodies
     */
    checkCollisions() {
        // Check each body for collision with player
        for (let i = this.bodies.length - 1; i >= 0; i--) {
            const body = this.bodies[i];
            
            if (Physics.checkCollision(this.player, body)) {
                if (this.player.mass > body.mass) {
                    // Player consumes smaller body
                    this.player.mass += body.mass;
                    
                    // Check win condition
                    if (this.player.mass >= 100) {
                        this.state = 'win';
                        return;
                    }
                    
                    // Respawn body in different location
                    this.respawnBody(i);
                } else if (this.player.mass < body.mass) {
                    // Player destroyed by larger body
                    this.state = 'gameOver';
                    return;
                } else {
                    // Equal mass - bounce/repel effect
                    this.handleEqualMassCollision(this.player, body);
                }
            }
        }
    }

    /**
     * Handle equal mass collision (bounce/repel)
     */
    handleEqualMassCollision(player, body) {
        // Calculate direction from body to player
        const dx = player.x - body.x;
        const dy = player.y - body.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 0.01) {
            // Bodies are on top of each other, separate them
            player.x += random(-10, 10);
            player.y += random(-10, 10);
            return;
        }
        
        // Normalize direction
        const nx = dx / dist;
        const ny = dy / dist;
        
        // Bounce strength
        const bounceStrength = 50;
        
        // Apply bounce to player (push away from body)
        player.vx += nx * bounceStrength;
        player.vy += ny * bounceStrength;
        
        // Apply opposite bounce to body (push away from player)
        body.vx -= nx * bounceStrength;
        body.vy -= ny * bounceStrength;
        
        // Separate bodies slightly to prevent getting stuck
        const separation = (player.radius + body.radius) - dist + 5;
        player.x += nx * separation * 0.5;
        player.y += ny * separation * 0.5;
        body.x -= nx * separation * 0.5;
        body.y -= ny * separation * 0.5;
    }

    /**
     * Respawn a consumed body in a different location
     */
    respawnBody(index) {
        const consumedBody = this.bodies[index];
        
        // Remove the consumed body
        this.bodies.splice(index, 1);
        
        // Find a new position away from player and other bodies
        let newX, newY;
        let attempts = 0;
        let validPosition = false;
        
        while (!validPosition && attempts < 50) {
            newX = random(0, this.width);
            newY = random(0, this.height);
            
            // Check distance from player
            const distToPlayer = distance(newX, newY, this.player.x, this.player.y);
            const minDistFromPlayer = this.player.radius + 50;
            
            if (distToPlayer >= minDistFromPlayer) {
                // Check distance from other bodies
                let tooClose = false;
                for (const body of this.bodies) {
                    const dist = distance(newX, newY, body.x, body.y);
                    const minDist = 30;
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
        
        // If we couldn't find a perfect position, use random position
        if (!validPosition) {
            newX = random(0, this.width);
            newY = random(0, this.height);
        }
        
        // Create new body with same mass as consumed one
        const newBody = new CelestialBody(newX, newY, consumedBody.mass);
        newBody.vx = random(-30, 30);
        newBody.vy = random(-30, 30);
        
        this.bodies.push(newBody);
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
        
        // Render game over/win screen
        if (this.state === 'gameOver') {
            this.renderGameOver();
        } else if (this.state === 'win') {
            this.renderWin();
        }
    }

    /**
     * Render game over screen
     */
    renderGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#ff4444';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 40);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '24px Arial';
        this.ctx.fillText('You were consumed by a larger body!', this.width / 2, this.height / 2 + 20);
        this.ctx.fillText('Press R to restart', this.width / 2, this.height / 2 + 60);
    }

    /**
     * Render win screen
     */
    renderWin() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('YOU WIN!', this.width / 2, this.height / 2 - 40);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`You reached mass ${this.player.mass}!`, this.width / 2, this.height / 2 + 20);
        this.ctx.fillText('Press R to play again', this.width / 2, this.height / 2 + 60);
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

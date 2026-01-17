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
        this.state = 'menu'; // menu, playing, gameOver, win
        
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
        
        // Setup input handlers
        this.setupInputHandlers();
    }

    /**
     * Setup input handlers for menu and restart
     */
    setupInputHandlers() {
        const game = this;
        window.addEventListener('keydown', function(e) {
            const key = e.key.toLowerCase();
            
            // Start game from menu
            if (key === ' ' || key === 'enter') {
                if (game.state === 'menu') {
                    game.startGame();
                    e.preventDefault();
                }
            }
            
            // Restart from game over/win
            if (key === 'r' && (game.state === 'gameOver' || game.state === 'win')) {
                game.reset();
                e.preventDefault();
            }
        });
    }

    /**
     * Start the game from menu
     */
    startGame() {
        this.state = 'playing';
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
            
            // Generate mass first (needed to calculate safe distance)
            // 45% small (1-3), 25% medium (4-10), 30% large (11-50)
            const rand = Math.random();
            if (rand < 0.45) {
                mass = randomInt(1, 3); // Small
            } else if (rand < 0.70) {
                mass = randomInt(4, 10); // Medium
            } else {
                mass = randomInt(11, 50); // Large
            }
            
            // Calculate body radius to determine safe distance
            const bodyBaseRadius = 8; // Same as player
            const bodyRadius = bodyBaseRadius * Math.sqrt(mass);
            
            // Try to find a valid position (not overlapping with player or other bodies)
            while (!validPosition && attempts < 50) {
                x = random(0, this.width);
                y = random(0, this.height);
                
                // Check distance from player
                const distToPlayer = distance(x, y, this.player.x, this.player.y);
                
                // Larger bodies need more distance from player
                // Bodies larger than player need significantly more space
                let minDistFromPlayer;
                if (mass > this.player.mass) {
                    // Large bodies: much more distance (at least 100 pixels + their radius)
                    minDistFromPlayer = this.player.radius + bodyRadius + 100;
                } else if (mass === this.player.mass) {
                    // Equal mass: moderate distance
                    minDistFromPlayer = this.player.radius + bodyRadius + 40;
                } else {
                    // Smaller bodies: standard distance
                    minDistFromPlayer = this.player.radius + bodyRadius + 30;
                }
                
                if (distToPlayer >= minDistFromPlayer) {
                    // Check distance from other bodies
                    let tooClose = false;
                    for (const body of this.bodies) {
                        const dist = distance(x, y, body.x, body.y);
                        const minDist = bodyRadius + body.radius + 20; // Minimum distance between bodies
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
            
            // If we couldn't find a perfect position, try one more time with relaxed constraints
            if (!validPosition) {
                // For large bodies, still enforce minimum distance from player
                if (mass > this.player.mass) {
                    // Keep trying with relaxed constraints
                    attempts = 0;
                    while (!validPosition && attempts < 30) {
                        x = random(0, this.width);
                        y = random(0, this.height);
                        const distToPlayer = distance(x, y, this.player.x, this.player.y);
                        const minDistFromPlayer = this.player.radius + bodyRadius + 80; // Slightly relaxed
                        if (distToPlayer >= minDistFromPlayer) {
                            validPosition = true;
                        }
                        attempts++;
                    }
                } else {
                    // For smaller bodies, just place randomly
                    x = random(0, this.width);
                    y = random(0, this.height);
                    validPosition = true;
                }
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
        if (this.state === 'menu' || this.state === 'gameOver' || this.state === 'win') {
            // Don't update game logic when in menu or end screens
            return;
        }

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
        
        // Render menu/end screens
        if (this.state === 'menu') {
            this.renderMenu();
        } else if (this.state === 'gameOver') {
            this.renderGameOver();
        } else if (this.state === 'win') {
            this.renderWin();
        }
    }

    /**
     * Render start menu screen
     */
    renderMenu() {
        // Draw semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Title
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = 'bold 56px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('DRIFTER STAR', this.width / 2, this.height / 2 - 120);
        
        // Instructions
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Consume smaller bodies to grow', this.width / 2, this.height / 2 - 40);
        this.ctx.fillText('Avoid larger bodies or you\'ll be destroyed!', this.width / 2, this.height / 2 - 10);
        this.ctx.fillText('Reach mass 100 to win', this.width / 2, this.height / 2 + 20);
        
        // Controls
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Arrow Keys or WASD to move', this.width / 2, this.height / 2 + 60);
        
        // Start prompt
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('Press SPACE or ENTER to start', this.width / 2, this.height / 2 + 120);
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

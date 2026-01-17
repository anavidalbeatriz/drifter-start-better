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
        
        console.log('Game constructor - Canvas dimensions:', this.width, 'x', this.height);
        
        // Game state
        this.state = 'playing'; // playing, gameOver, win
        
        // Initialize input handler
        this.inputHandler = new InputHandler();
        
        // Initialize renderer
        this.renderer = new Renderer(canvas);
        console.log('Renderer initialized with', this.renderer.stars.length, 'stars');
        
        // Initialize player (center of canvas)
        this.player = new Player(this.width / 2, this.height / 2);
        console.log('Player initialized at:', this.player.x, this.player.y);
        
        // Celestial bodies (empty for Phase 1, will be populated in Phase 3)
        this.bodies = [];
        
        // UI elements
        this.massDisplay = document.getElementById('mass-display');
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
        // Bodies will be generated in Phase 3
    }
}

// Main entry point and game loop

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const canvas = document.getElementById('game-canvas');
        
        if (!canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        // Set canvas size FIRST (before creating Game, so Renderer gets correct dimensions)
        canvas.width = 640;
        canvas.height = 480;
        
        // Create game instance
        const game = new Game(canvas);
        
        // Game loop variables
        let lastTime = 0;
        let isFirstFrame = true;
        
        /**
         * Main game loop
         */
        function gameLoop(currentTime) {
            try {
                // Handle first frame (deltaTime would be huge)
                if (isFirstFrame) {
                    lastTime = currentTime;
                    isFirstFrame = false;
                }
                
                // Calculate delta time
                const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1); // Cap at 0.1s
                lastTime = currentTime;
                
                // Update game
                game.update(deltaTime);
                
                // Render game
                game.render();
                
                // Request next frame
                requestAnimationFrame(gameLoop);
            } catch (error) {
                console.error('Error in game loop:', error);
            }
        }
        
        // Start game loop
        requestAnimationFrame(gameLoop);
        
        // Handle window resize (optional, for responsive design)
        window.addEventListener('resize', () => {
            // Could adjust canvas size here if needed
        });
    } catch (error) {
        console.error('Error initializing game:', error);
    }
});

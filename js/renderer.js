// Rendering utilities

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.initStars();
    }

    /**
     * Initialize starfield background
     */
    initStars() {
        // Ensure canvas has valid dimensions
        if (this.canvas.width === 0 || this.canvas.height === 0) {
            console.warn('Canvas dimensions are 0, using default 640x480');
            this.canvas.width = 640;
            this.canvas.height = 480;
        }
        
        const starCount = 100;
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                brightness: Math.random()
            });
        }
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw the starfield background
     * @param {Player} player - Optional player to skip stars behind it
     */
    drawStarfield(player = null) {
        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(star => {
            // Skip stars that are behind the player (if player exists)
            if (player) {
                const distToPlayer = distance(star.x, star.y, player.x, player.y);
                if (distToPlayer < player.radius) {
                    return; // Skip this star, it's behind the player
                }
            }
            
            const alpha = 0.5 + star.brightness * 0.5;
            this.ctx.globalAlpha = alpha;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1.0;
    }

    /**
     * Draw a circle
     */
    drawCircle(x, y, radius, color, glow = false) {
        if (glow) {
            // Add glow effect
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, color + '80');
            gradient.addColorStop(1, color + '00');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Main render function
     */
    render(game) {
        this.clear();
        this.drawStarfield();
        
        // Render will be called from game.js with entities
        return this;
    }
}

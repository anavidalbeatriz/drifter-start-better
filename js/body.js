// Celestial body entity

class CelestialBody {
    constructor(x, y, mass) {
        this.x = x;
        this.y = y;
        this.vx = 0; // velocity x (will be set in Phase 3)
        this.vy = 0; // velocity y (will be set in Phase 3)
        this.mass = mass;
        this.baseRadius = 8; // Same as player to ensure same mass = same size
        this.radius = this.calculateRadius();
        this.color = this.getColorByMass();
    }

    /**
     * Calculate radius based on mass
     */
    calculateRadius() {
        return this.baseRadius * Math.sqrt(this.mass);
    }

    /**
     * Get color based on mass
     */
    getColorByMass() {
        if (this.mass <= 3) {
            return '#4a90e2'; // Blue - small
        } else if (this.mass <= 10) {
            return '#ff8800'; // Orange - medium
        } else {
            return '#ff4444'; // Red - large
        }
    }

    /**
     * Update body movement
     */
    update(deltaTime, canvasWidth, canvasHeight) {
        // Update position based on velocity
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        
        // Wrap around boundaries
        this.wrapBoundaries(canvasWidth, canvasHeight);
        
        // Update radius (in case mass changed)
        this.radius = this.calculateRadius();
    }

    /**
     * Wrap body position around canvas boundaries
     */
    wrapBoundaries(canvasWidth, canvasHeight) {
        // Wrap horizontally
        if (this.x < -this.radius) {
            this.x = canvasWidth + this.radius;
        } else if (this.x > canvasWidth + this.radius) {
            this.x = -this.radius;
        }
        
        // Wrap vertically
        if (this.y < -this.radius) {
            this.y = canvasHeight + this.radius;
        } else if (this.y > canvasHeight + this.radius) {
            this.y = -this.radius;
        }
    }

    /**
     * Render the celestial body
     */
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Add subtle highlight
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        // Display mass number inside body (for testing)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold ' + Math.max(10, Math.min(this.radius * 0.8, 16)) + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.mass.toString(), this.x, this.y);
    }
}

// Celestial body entity

class CelestialBody {
    constructor(x, y, mass) {
        this.x = x;
        this.y = y;
        this.vx = 0; // velocity x (will be set in Phase 3)
        this.vy = 0; // velocity y (will be set in Phase 3)
        this.mass = mass;
        this.baseRadius = 5;
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
     * Update body (will be used in Phase 3 for movement)
     */
    update(deltaTime, canvasWidth, canvasHeight) {
        // Phase 1: Bodies are static, no movement yet
        this.radius = this.calculateRadius();
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
    }
}

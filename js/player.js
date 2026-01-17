// Player entity

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0; // velocity x
        this.vy = 0; // velocity y
        this.mass = 5; // starting mass
        this.baseRadius = 8;
        this.radius = this.calculateRadius();
        
        // Movement properties
        this.acceleration = 300; // pixels per second squared
        this.maxSpeed = 200; // pixels per second
        this.friction = 0.95; // friction coefficient (0-1, higher = less friction)
        
        // Trail effect for visual feedback
        this.trail = [];
        this.maxTrailLength = 8;
    }

    /**
     * Calculate radius based on mass
     */
    calculateRadius() {
        return this.baseRadius * Math.sqrt(this.mass);
    }

    /**
     * Update player movement
     */
    update(deltaTime, inputHandler, canvasWidth, canvasHeight) {
        // Get input direction
        const direction = inputHandler.getMovementDirection();
        
        // Apply acceleration based on input
        if (direction.x !== 0 || direction.y !== 0) {
            this.vx += direction.x * this.acceleration * deltaTime;
            this.vy += direction.y * this.acceleration * deltaTime;
        }
        
        // Apply friction (momentum/drift effect)
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Limit max speed
        let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
            this.vx = (this.vx / speed) * this.maxSpeed;
            this.vy = (this.vy / speed) * this.maxSpeed;
            speed = this.maxSpeed; // Update speed after limiting
        }
        
        // Update position
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        
        // Wrap around boundaries
        this.wrapBoundaries(canvasWidth, canvasHeight);
        
        // Update trail for visual feedback (reuse speed variable)
        if (speed > 10) { // Only show trail when moving
            this.trail.push({ x: this.x, y: this.y, alpha: 0.3 });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        } else {
            // Clear trail when stopped
            if (this.trail.length > 0) {
                this.trail = [];
            }
        }
        
        // Fade trail
        this.trail.forEach(point => {
            point.alpha *= 0.9;
        });
        this.trail = this.trail.filter(point => point.alpha > 0.05);
        
        // Update radius (in case mass changed)
        this.radius = this.calculateRadius();
    }

    /**
     * Wrap player position around canvas boundaries
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
     * Render the player
     */
    render(ctx) {
        // Draw trail for visual feedback
        if (this.trail.length > 1) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < this.trail.length; i++) {
                const point = this.trail[i];
                ctx.globalAlpha = point.alpha;
                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.stroke();
        }
        
        // Draw player with glow effect (cyan/green)
        const color = '#00ffff';
        
        // Ensure full opacity for player
        ctx.globalAlpha = 1.0;
        
        // Glow effect (semi-transparent outer glow)
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 1.5
        );
        gradient.addColorStop(0, '#00ffff');
        gradient.addColorStop(0.5, '#00ffff80');
        gradient.addColorStop(1, '#00ffff00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Main body (fully opaque, covers any stars behind it)
        ctx.fillStyle = color;
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset alpha
        ctx.globalAlpha = 1.0;
    }
}

// Particle system for visual effects

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = random(-50, 50);
        this.vy = random(-50, 50);
        this.life = 1.0; // Start at full life
        this.decay = random(0.02, 0.05); // How fast it fades
        this.size = random(2, 4);
        this.color = color;
    }

    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.life -= this.decay;
        this.vx *= 0.98; // Friction
        this.vy *= 0.98;
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    /**
     * Create explosion effect at position
     */
    createExplosion(x, y, color, count = 15) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    /**
     * Create consumption effect (smaller particles)
     */
    createConsumption(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            const particle = new Particle(x, y, color);
            particle.size = random(1, 3);
            particle.vx = random(-30, 30);
            particle.vy = random(-30, 30);
            this.particles.push(particle);
        }
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(deltaTime);
            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        this.particles.forEach(particle => {
            particle.render(ctx);
        });
    }
}

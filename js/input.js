// Input handling system

class InputHandler {
    constructor() {
        this.keys = {};
        this.setupEventListeners();
    }

    /**
     * Setup keyboard event listeners
     */
    setupEventListeners() {
        // Key down
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            // Prevent default for arrow keys to avoid scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });

        // Key up
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Handle blur (window loses focus) - clear all keys
        window.addEventListener('blur', () => {
            this.keys = {};
        });
    }

    /**
     * Check if a key is currently pressed
     */
    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] === true;
    }

    /**
     * Get movement direction vector from input
     * Returns {x: -1 to 1, y: -1 to 1}
     */
    getMovementDirection() {
        let dx = 0;
        let dy = 0;

        // Arrow keys or WASD
        if (this.isKeyPressed('ArrowLeft') || this.isKeyPressed('a')) {
            dx -= 1;
        }
        if (this.isKeyPressed('ArrowRight') || this.isKeyPressed('d')) {
            dx += 1;
        }
        if (this.isKeyPressed('ArrowUp') || this.isKeyPressed('w')) {
            dy -= 1;
        }
        if (this.isKeyPressed('ArrowDown') || this.isKeyPressed('s')) {
            dy += 1;
        }

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        return { x: dx, y: dy };
    }
}

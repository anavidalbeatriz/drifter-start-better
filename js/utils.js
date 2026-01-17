// Utility functions

/**
 * Generate a random number between min and max (inclusive)
 */
function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate distance between two points
 */
function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Wrap a value around boundaries (for wrap-around effect)
 */
function wrap(value, min, max) {
    if (value < min) return max;
    if (value > max) return min;
    return value;
}

/**
 * Clamp a value between min and max
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

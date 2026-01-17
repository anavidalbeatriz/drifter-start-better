// Physics and collision detection

class Physics {
    /**
     * Check if two circles are colliding
     */
    static checkCollision(entity1, entity2) {
        const dist = distance(entity1.x, entity1.y, entity2.x, entity2.y);
        const minDist = entity1.radius + entity2.radius;
        return dist < minDist;
    }

    /**
     * Wrap entity position around canvas boundaries
     */
    static wrapPosition(entity, canvasWidth, canvasHeight) {
        entity.x = wrap(entity.x, -entity.radius, canvasWidth + entity.radius);
        entity.y = wrap(entity.y, -entity.radius, canvasHeight + entity.radius);
    }
}

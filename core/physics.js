export class PhysicsParticle {
    constructor(x, y, mass = 1, main = false, fixed = false) {
        this.pos = { x, y };
        this.vel = { x: 0, y: 0 };
        this.mass = mass;
        this.main = main
        this.fixed = fixed;
        this.offsets = { x: 0, y: 0 };
        this.worldUnitRadius = 0;
        this.radius = 1; // dimensions in entity size * world units (tiles)
        this.force = { x: 0, y: 0 };
        this.damping = 0.95;
        this.children = [];
        this.springK = 0.2;
        this.springDamping = 0.85;

    }

    addForce(fx, fy) {
        if (this.fixed) return;
        this.force.x += fx;
        this.force.y += fy;
    }

    integrate(dt) {
        if (this.fixed) return;

        // v = a dt => a = F/m => v += (F/m) * dt
        this.vel.x += (this.force.x / this.mass) * dt;
        this.vel.y += (this.force.y / this.mass) * dt;

        this.vel.x *= this.damping;
        this.vel.y *= this.damping;

        // Integrate velocity into position
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;

        for (const child of this.children) {
            this.applySpringToChild(child, dt);
            child.integrate(dt);
        }

        // Reset forces
        this.force.x = 0;
        this.force.y = 0;
    }

    applySpringToChild(child, dt) {
        const dx = child.pos.x - this.pos.x;
        const dy = child.pos.y - this.pos.y;

        // Current distance
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return;

        // Rest length = distance when created (store it in child)
        const rest = child.restLength || Math.hypot(child.offsets.x, child.offsets.y);
        child.restLength = rest;

        // Hooke's law: F = -k * (x - rest)
        const stretch = dist - rest;
        const k = this.springK;
        const forceMag = -k * stretch;

        // Direction unit vector
        const nx = dx / dist;
        const ny = dy / dist;

        // Damping (relative velocity along the spring)
        const dvx = child.vel.x - this.vel.x;
        const dvy = child.vel.y - this.vel.y;
        const relVel = dvx * nx + dvy * ny;
        const c = this.springDamping;

        const dampingForce = -c * relVel;

        // Net spring + damping force along spring axis
        const fx = (forceMag + dampingForce) * nx;
        const fy = (forceMag + dampingForce) * ny;

        // Apply equal & opposite forces
        child.addForce(fx, fy);
        this.addForce(-fx, -fy);

        // Positional memory to help stabilize the structure
        const targetX = this.pos.x + child.offsets.x;
        const targetY = this.pos.y + child.offsets.y;
        const memK = 0.2; // very low stiffness
        const memDX = targetX - child.pos.x;
        const memDY = targetY - child.pos.y;

        child.addForce(memDX * memK, memDY * memK);
    }

    createChild(offsetX, offsetY, scale = 0.5) {
        const child = new PhysicsParticle(
            this.pos.x + offsetX,
            this.pos.y + offsetY,
            this.mass * scale
        );
        child.offsets = { x: offsetX, y: offsetY };
        child.radius = this.radius * scale;
        this.children.push(child);
        return child;
    }

    updateRadii(circumference, parent_size) {
        this.radius = circumference / 2;
        this.worldUnitRadius = this.radius * parent_size;
    }
}
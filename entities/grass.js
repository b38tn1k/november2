import { BaseEntity } from '../core/BaseEntity.js';

const ROOT_RADIUS = 0.4;
const ROOT_MASS = 10;
const STEM_SEG_LENGTH = 2;
const SPRING_K = .01;
const SPRING_DAMP = 0.1;
const STEM_MASS = 1;

// grass is a type of vegetation that grows in shallow water

export class Grass extends BaseEntity {
    constructor(p, config) {
        super(p);

        this.size = 0.1;
        this.speed = p.shared.settings.ambientSpeed;
        this.sinkancy = p.shared.settings.ambientSinkancy;
        this.baseBuoyancy = p.shared.settings.playerBuoyancy;
        this.color = p.shared.chroma.vegetation;
        this.x = config.x + 0.5;
        this.y = config.y + 1;
        this.visible = true;
        this.direction = config.direction || "up";
        this.bladeWidth = 0.002 + p.random() * 0.002;
        this.left = Math.random() < 0.5;
        this.curve = 0.2 + 0.2 * Math.random();

        this.mainPhysicsParticle = this.createPhysicsParticle(
            this.x, this.y,      // x,y
            1,         // mass
            true,      // main
            true      // fixed
        );

        this.mainPhysicsParticle.updateRadii(ROOT_RADIUS, this.size);
        this.mainPhysicsParticle.addForce(this.p.random(-1, 1) * this.speed, this.p.random(-1, 1) * this.speed);

        const root = this.mainPhysicsParticle;
        root.mass = ROOT_MASS;

        switch (this.direction) {
            case "up":
                const stem1 = root.createChild(0,-STEM_SEG_LENGTH, STEM_SEG_LENGTH);
                stem1.springK = SPRING_K;
                stem1.springDamping = SPRING_DAMP;
                stem1.mass = STEM_MASS;
                stem1.updateRadii(ROOT_RADIUS, this.size);
                stem1.softFactor = 0.002;

                const stem2 = stem1.createChild(0, -STEM_SEG_LENGTH, STEM_SEG_LENGTH);
                stem2.springK = SPRING_K;
                stem2.springDamping = SPRING_DAMP;
                stem2.mass = STEM_MASS;
                stem2.updateRadii(ROOT_RADIUS, this.size);
                stem2.softFactor = 0.002;
                this.physicsParticles.push(stem1, stem2);
                break;
        }

    }

    cleanup() {
        super.cleanup();
    }

    applyForces(dt) {
        super.applyForces(dt);

        const mp = this.mainPhysicsParticle;
        if (!mp) return;
    }

    onCurrent(particle, current) {
        if (current.levelDefinitionCurrent) {
            particle.addForce(current.dx, current.dy);
        }
    }

    postPhysics() {
        const mp = this.mainPhysicsParticle;
        if (!mp) return;
        this.worldPos.x = mp.pos.x;
        this.worldPos.y = mp.pos.y;
        this.pxSize = this.size * this.scene.mapTransform.tileSizePx;
    }

    draw(layer, texture) {
        if (!this.visible || !this.scene) return;
        const { x, y } = this.scene.worldToScreen(this.worldPos);
        // console.log("drawing grass", this.worldPos, x, y);
        const dims = Math.floor(this.pxSize * 6);
        layer.noFill();
        layer.stroke(this.color);
        layer.strokeWeight(this.bladeWidth * layer.width || 4);

        const sp = this.scene.worldToScreen(this.physicsParticles[0].pos); // start
        const mp = this.scene.worldToScreen(this.physicsParticles[1].pos); // mid
        const ep = this.scene.worldToScreen(this.physicsParticles[2].pos); // end

        // Direction from start to end
        const dx = ep.x - sp.x;
        const dy = ep.y - sp.y;

        // Length of frond (for curvature scaling)
        const len = Math.sqrt(dx * dx + dy * dy);

        // Perpendicular normal (dx,dy) rotated 90deg
        const nx = -dy / len;
        const ny = dx / len;

        // Bend amount — tune this for more/less curve
        const curvature = len * this.curve;

        // Control points: mid ± perpendicular offset
        let c1 = { x: mp.x - nx * curvature, y: mp.y - ny * curvature };
        let c2 = { x: mp.x + nx * curvature, y: mp.y + ny * curvature };

        if (this.left) {
            c1 = { x: mp.x + nx * curvature, y: mp.y + ny * curvature };
            c2 = { x: mp.x - nx * curvature, y: mp.y - ny * curvature };
        }

        // Final Bézier draw
        layer.bezier(
            sp.x, sp.y,       // start
            c1.x, c1.y,       // control 1
            c2.x, c2.y,       // control 2
            ep.x, ep.y        // end
        );
    }
}
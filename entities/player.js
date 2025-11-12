import { BaseEntity } from '../core/BaseEntity.js';

export class Player extends BaseEntity {
    constructor(p) {
        super(p);
        this.speed = 3; // tiles per second
        // this.buoyancy = -0.04;
        // this.sinkancy = 0.1;
        this.buoyancy = -1;
        this.sinkancy = 3;
        this.health = 100;
        this.moving = { moveLeft: false, moveRight: false, moveUp: false, moveDown: false, sink: false };
        this.size = 0.5; // in world units (tiles)
        this.pxSize = -1;
        this.mainPhysicsParticle = this.createPhysicsParticle(0, 0, 1, true, false);
        this.mainPhysicsParticle.updateRadii(1, this.size);
        this.mainPhysicsParticle.updateRadii(1, this.size);
        this.physicsParticles.push(this.mainPhysicsParticle);

        // 🌿 arrange fronds along an arc with child + grandchild chains
        const spread = 0.6;   // horizontal spacing
        const height = 0.4;   // how tall the arc is
        // const fronds = [-spread, -spread / 2, 0, spread / 2, spread]; // five fronds
        const fronds = [-spread, 0, spread]; // three fronds

        for (let i = 0; i < fronds.length; i++) {
            const x = fronds[i];
            // sin curve for vertical offset (center higher)
            const y = -0.5 - Math.sin((i / (fronds.length - 1)) * Math.PI) * height;

            // base child (thicker base of frond)
            const child = this.mainPhysicsParticle.createChild(x, y, 0.6);
            child.springK = 0.25;
            child.springDamping = 0.85;
            this.physicsParticles.push(child);

            // frond tip (grandchild)
            const tipX = x * 2; // a little further out
            const tipY = y * 2;
            const grandchild = child.createChild(tipX - x, tipY - y, 0.3);
            grandchild.springK = 0.1;
            grandchild.springDamping = 0.9;
            this.physicsParticles.push(grandchild);
        }
    }

    onActionStart(action) {
        console.log(action);
        if (this.moving[action] !== undefined) this.moving[action] = true;
        this.Debug?.log('player', `Started ${action}`);
    }

    onActionEnd(action) {
        if (this.moving[action] !== undefined) this.moving[action] = false;
        this.Debug?.log('player', `Ended ${action}`);
    }

    update(dt) {
        if (!this.visible) return;

        const mp = this.mainPhysicsParticle;
        const thrust = this.speed; // tune this until it feels good

        // horizontal thrust
        if (this.moving.moveLeft && !this.moving.moveRight) mp.addForce(-thrust, 0);
        else if (this.moving.moveRight && !this.moving.moveLeft) mp.addForce(thrust, 0);

        // vertical buoyancy / sinking
        if (this.moving.sink) mp.addForce(0, this.sinkancy);
        else mp.addForce(0, this.buoyancy);

        for (const particle of this.physicsParticles) {
            particle.integrate(dt);
        }
        this.worldPos.x = mp.pos.x;
        this.worldPos.y = mp.pos.y;
        this.pxSize = this.size * this.scene.mapTransform.tileSizePx;
    }

    drawParticleTree(layer, particle, opts = {}) {
        if (!particle || !this.scene) return;

        const {
            drawNodes = true,
            nodeColor = [0, 255, 0],
            springColor = [0, 255, 0],
            springWeight = 2,
            nodeRadius = 3
        } = opts;

        const { x, y } = this.scene.worldToScreen(particle.pos);

        // Draw springs between parent and children
        if (particle.children && particle.children.length > 0) {
            layer.stroke(...springColor);
            layer.strokeWeight(springWeight);

            for (const child of particle.children) {
                const { x: cx, y: cy } = this.scene.worldToScreen(child.pos);
                layer.line(x, y, cx, cy);
                this.drawParticleTree(layer, child, opts); // recursive call
            }
        }

        // Draw the particle node
        if (drawNodes) {
            // layer.noStroke();
            layer.fill(...nodeColor);
            layer.circle(x, y, nodeRadius * 2);
        }
    }

    draw(layer) {
        if (!this.visible || !this.scene) return;
        const { x, y } = this.scene.worldToScreen(this.worldPos);

        const oldRectMode = layer._rectMode || this.p.CORNER;
        layer.rectMode(this.p.CENTER);
        layer.fill(0, 200, 200);
        layer.square(x, y, this.pxSize);

        // Draw recursive spring structure
        this.drawParticleTree(layer, this.mainPhysicsParticle, {
            drawNodes: true,
            nodeColor: [0, 150, 100],
            springColor: [0, 200, 100],
            springWeight: 2.5,
            nodeRadius: 3
        });

    }
}
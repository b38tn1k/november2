import { PhysicsParticle } from '../core/physics.js';

export class BaseEntity {
  constructor(p) {
    this.p = p;
    this.scene = null;
    this.worldPos = { x: 0, y: 0 };
    this.visible = false;
    this.size = 1; // in world units (tiles)
    this.Debug = p.shared.Debug;
    this.mainPhysicsParticle = null;
    this.physicsParticles = [];
  }

  createPhysicsParticle(x, y, mass = 1, fixed = false) {
    const physicsParticle = new PhysicsParticle(x, y, mass, fixed);
    return physicsParticle;
  }

  setScene(scene) {
    this.scene = scene;
  }

  reset(spawn = { x: 0, y: 0 }) {
    this.worldPos.x = spawn.x;
    this.worldPos.y = spawn.y;
    this.visible = true;
    this.Debug?.log('entity', `Entity reset to world (${spawn.x}, ${spawn.y})`);
    for (const particle of this.physicsParticles) {
      particle.pos.x = spawn.x;
      particle.pos.y = spawn.y;
      particle.vel.x = 0;
      particle.vel.y = 0;
      if (!particle.main) {
        particle.pos.x += particle.offsets.x;
        particle.pos.y += particle.offsets.y;
      }
    }
  }

  update(dt) {
    for (const particle of this.physicsParticles) {
      particle.integrate(dt);
    }

    if (this.mainPhysicsParticle) {
      this.worldPos.x = this.mainPhysicsParticle.pos.x;
      this.worldPos.y = this.mainPhysicsParticle.pos.y;
    }
  }

  draw(layer) {
    if (!this.visible || !this.scene) return;

    const { x, y } = this.scene.worldToScreen(this.worldPos);
    const pxSize = this.size * this.scene.mapTransform.tileSizePx;

    layer.noStroke();
    layer.fill(180, 180, 180);
    layer.rect(x, y, pxSize, pxSize);
  }

  deactivate() {
    this.visible = false;
  }
}
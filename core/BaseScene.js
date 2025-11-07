// core/BaseScene.js
export class BaseScene {
  constructor(p) {
    this.p = p;
    this.Debug = p.shared.Debug;
    this.renderer = p.shared.renderer;
  }

  // ---- Lifecycle ------------------------------------------------------------

  init() {
    this.Debug.log('level', `📜 ${this.constructor.name} initialized`);
  }

  update() {
    // default noop
  }

  draw() {
    // default noop
  }

  cleanup() {
    this.Debug.log('level', `🧹 ${this.constructor.name} cleanup`);
  }

  // ---- Convenience ----------------------------------------------------------

  markDirty(...layers) {
    const r = this.renderer;
    if (!r || !r.layerDirty) return;
    layers.forEach(name => {
      if (r.layerDirty[name] !== undefined) r.layerDirty[name] = true;
    });
  }

  markClean(...layers) {
    const r = this.renderer;
    if (!r || !r.layerDirty) return;
    layers.forEach(name => {
      if (r.layerDirty[name] !== undefined) r.layerDirty[name] = false;
    });
  }

  // ---- Common setup helpers -------------------------------------------------

  setupDefaultShaders() {
    const r = this.renderer;
    if (!r) return;
    r.reset();
    r.deferShader('background', 'default');
    r.deferShader('world', 'default');
    r.setNoShader('entities');
    r.deferShader('ui', 'default');
  }

  resetPlayerToLevel(levelName = 'level1') {
    const levels = this.p.shared.levels;
    const spawn = levels?.[levelName]?.spawn || { x: 0, y: 0 };
    const player = this.p.shared.player;
    if (player) {
      player.reset(spawn);
      this.Debug.log('level', `📍 Player reset to (${spawn.x}, ${spawn.y})`);
    }
  }

  deactivatePlayer() {
    const player = this.p.shared.player;
    if (player) player.deactivate();
  }
}
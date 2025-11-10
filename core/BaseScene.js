// core/BaseScene.js
export class BaseScene {
  constructor(p) {
    this.p = p;
    this.Debug = p.shared.Debug;
    this.renderer = p.shared.renderer;
  }
  init() {
    this.Debug.log('level', `📜 ${this.constructor.name} initialized`);
  }
  update() {
    const r = this.p.shared.renderer;
    const player = this.p.shared.player;
    const dt = this.p.shared.timing.delta;
    if (player?.visible) player.update(dt);
    return [r, player, dt];
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

    const flat = layers.flat();
    flat.forEach(name => {
      if (r.layerDirty[name] !== undefined) {
        r.layerDirty[name] = true;
        this.Debug.log('renderer', `🟠 Marked dirty: ${name}`);
      }
    });
  }

  markClean(...layers) {
    const r = this.renderer;
    if (!r || !r.layerDirty) return;
    layers.forEach(name => {
      if (r.layerDirty[name] !== undefined) r.layerDirty[name] = false;
    });
  }


  drawBlockingBackground(layer, tiles, tileSize = 32) {
    if (!layer) {
      this.Debug.log('level', '⚠️ drawBlockingBackground: No layer provided');
      return;
    }
    if (!tiles || !Array.isArray(tiles)) {
      this.Debug.log('level', '⚠️ drawBlockingBackground: Invalid or missing tiles array');
      return;
    }
    layer.clear();
    layer.noStroke();
    const p = this.p;
    layer.fill(100, 120, 150); // muted blueish gray color
    tiles.forEach(tile => {
      if (tile && typeof tile.x === 'number' && typeof tile.y === 'number') {
        layer.rect(tile.x, tile.y, tileSize, tileSize);
      }
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
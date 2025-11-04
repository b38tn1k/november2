// core/sceneManager.js
export function createSceneManager(p) {
  const manager = {
    scenes: {},
    current: null,

    register(name, scene) {
      this.scenes[name] = scene;
    },

    change(name) {
      const next = this.scenes[name];
      if (!next) {
        console.warn(`⚠️ Scene "${name}" not found`);
        return;
      }

      if (this.current?.cleanup) this.current.cleanup(p);
      this.current = next;
      console.log(`🎬 Switched to scene: ${name}`);
      this.current.init?.(p);
    },

    update() {
      if (this.current?.update) this.current.update(p);
    },

    draw() {
      if (this.current?.draw) this.current.draw(p);
    },
  };

  p.shared.sceneManager = manager;
  return manager;
}
import { BaseScene } from '../core/BaseScene.js';

export class Level1Scene extends BaseScene {
    constructor(p) {
        super(p);
        this.p = p;
    }

    init() {
        super.init();
        this.Debug.log('level', "🎮 Level 1 started");
        const level = this.p.shared.levels.level1;
        Object.assign(this, this.p.shared.parseLevel(level, this.p));
        console.log(this);

        // const this.spawn = levels.level1.this.spawn || { x: 0, y: 0 };
        const player = this.p.shared.player;
        this.Debug.log('level', `Level 1 this.spawn point at (${this.spawn.x}, ${this.spawn.y})`);
        player.reset({ x: this.spawn.x, y: this.spawn.y });

        const r = this.p.shared.renderer;
        r.reset();
    }

    onActionStart(action) {
        const player = this.p.shared.player;
        player?.onActionStart?.(action);
        if (action === "pause") this.p.shared.sceneManager.change("menu");
    }

    onActionEnd(action) {
        const player = this.p.shared.player;
        player?.onActionEnd?.(action);
    }

    onKeyPressed(key, keyCode) {
        if (this.p.keyIsPressed && this.p.key === 'l') {
            this.p.shared.sceneManager.change('gameover');
        }
    }

    update() {
        const [r, player, dt] = super.update();
        r.markDirty('uiLayer');
        r.markDirty('backgroundLayer');
        r.markDirty('entitiesLayer');
    }

    draw() {
        const r = this.p.shared.renderer;
        const ui = this.p.shared.ui;
        const player = this.p.shared.player;
        const layers = r.layers;

        r.use('default');
        r.drawScene(() => {
            this.drawBlockingBackground(layers.backgroundLayer, this.tiles);
            player.draw(layers.entitiesLayer);
            ui.draw(layers.uiLayer);
        });
    }

    cleanup() {
        console.log("🧹 Level 1 cleanup");
        const player = this.p.shared.player;
        player.visible = false;
    }
}
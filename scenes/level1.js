import { BaseScene } from '../core/BaseScene.js';

export class Level1Scene extends BaseScene {
    constructor(p) {
        super(p);
        this.p = p;
    }

    init() {
        super.init();
        this.Debug.log('level', "🎮 Level 1 started");
        const levels = this.p.shared.levels;
        const spawn = levels.level1.spawn || { x: 0, y: 0 };
        const player = this.p.shared.player;
        this.Debug.log('level', `Level 1 spawn point at (${spawn.x}, ${spawn.y})`);
        player.reset({ x: spawn.x, y: spawn.y });

        const r = this.p.shared.renderer;
        r.reset();
        r.deferShader('background', 'default');
        r.deferShader('world', 'default');
        r.setNoShader('entities');
        r.deferShader('ui', 'default');
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
        const r = this.p.shared.renderer;
        const player = this.p.shared.player;
        const dt = this.p.shared.timing.delta;
        if (player?.visible) player.update(dt);
        r.markDirty('entities');
        r.markDirty('ui');
    }

    draw() {
        const r = this.p.shared.renderer;
        const ui = this.p.shared.ui;
        const player = this.p.shared.player;

        r.use('default');

        r.drawScene(({ background, world, entities, ui: uiLayer }) => {
            background.background(50, 0, 200);
            if (player?.visible) {
                player.draw(entities);
            }
            ui.draw(uiLayer);
        });
    }

    cleanup() {
        console.log("🧹 Level 1 cleanup");
        const player = this.p.shared.player;
        player.visible = false;
    }
}
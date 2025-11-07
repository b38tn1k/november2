import { BaseScene } from '../core/BaseScene.js';

export class GameOverScene extends BaseScene {
    init() {
        super.init();
        this.Debug.log('level', "Game Over");
        this.p.shared.ui.hide();
        const r = this.p.shared.renderer;
        const player = this.p.shared.player;
        player.deactivate();
        r.reset();
        r.deferShader('background', 'default');
        r.deferShader('world', 'default');
        r.setNoShader('entities');
        r.setNoShader('ui');
        // r.deferShader('ui', 'default');
    }

    onActionStart(action) {
        if (action === "pause") this.p.shared.sceneManager.change("menu");
    }

    onKeyPressed(key, keyCode) {
        if (this.p.keyIsPressed && this.p.key === 'm') {
            this.p.shared.sceneManager.change('menu');
        }
    }

    update() {
        const r = this.p.shared.renderer;
        r.markDirty('ui');
        r.markDirty('background');
    }

    draw() {
        const r = this.p.shared.renderer;
        r.use('default');

        r.drawScene(({ background, ui }) => {
            // Background layer
            if (r.layerDirty.background) {
                background.background(80, 0, 0);
            }
            // UI layer (text)
            if (r.layerDirty.ui) {
                ui.push();
                ui.textAlign(this.p.CENTER, this.p.CENTER);
                ui.textSize(42);
                ui.fill(255);
                ui.text(`Game Over\nPress ${this.p.shared.controls.map.pause} for Menu`, 0, 0);
                ui.pop();
            }
        });
    }

    cleanup() {
        this.Debug.log('level', "🧹 Game Over cleanup");
    }

    constructor(p) {
        super(p);
    }
}
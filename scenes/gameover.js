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
        r.markDirty('uiLayer');
        r.markDirty('backgroundLayer');
    }

    draw() {
        const r = this.p.shared.renderer;
        r.use('default');

        r.drawScene((layers) => {
            const { backgroundLayer, worldLayer, entitiesLayer, uiLayer } = layers;
            // Background layer
            if (r.layerDirty.backgroundLayer) {
                backgroundLayer.background(80, 0, 0);
            }
            // UI layer (text)
            if (r.layerDirty.uiLayer) {
                uiLayer.textAlign(this.p.CENTER, this.p.CENTER);
                uiLayer.textSize(42);
                uiLayer.fill(255);
                uiLayer.text(`Game Over\nPress ${this.p.shared.controls.map.pause} for Menu`, uiLayer.width/2, uiLayer.height/2);
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
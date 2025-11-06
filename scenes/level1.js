export function loadLevel1(p) {
    return {
        Debug: p.shared.Debug,

        init() {
            console.log("🎮 Level 1 started");
            const levels = p.shared.levels;
            const spawn = levels.level1.spawn || { x: 0, y: 0 };
            const player = p.shared.player;

            this.Debug.log('level', `Level 1 spawn point at (${spawn.x}, ${spawn.y})`);
            player.reset({ x: spawn.x, y: spawn.y })
        },

        onActionStart(action) {
            const player = p.shared.player;
            player?.onActionStart?.(action);
            if (action === "pause") p.shared.sceneManager.change("menu");
        },

        onActionEnd(action) {
            const player = p.shared.player;
            player?.onActionEnd?.(action);
        },

        update() {
            const player = p.shared.player;
            const dt = p.shared.timing.delta;
            if (player?.visible) player.update(dt);
        },

        draw() {
            const r = p.shared.renderer;
            const player = p.shared.player;
            r.use('default');
            r.drawScene(() => {
                p.background(50, 0, 100);
                p.fill(255);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(42);
                p.text("Level 1 Running\nDon't press L", 0, 0);
                if (player?.visible) player.draw(p);
                if (player?.visible) this.Debug.log('level', `Level 1 player position at (${player.x}, ${player.y})`);
            });
        },

        cleanup() {
            console.log("🧹 Level 1 cleanup");
            const player = p.shared.player;
            player.visible = false;
        },
    };
}
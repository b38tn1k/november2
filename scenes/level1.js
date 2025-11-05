

export function loadLevel1(p) {
    return {
        init() {
            console.log("🎮 Level 1 started");
        },


        onKeyPressed(key, keyCode) {
            console.log(`Key pressed in Menu: ${key} (${keyCode})`);
            if (p.keyIsPressed && p.key === 'm') {
                p.shared.sceneManager.change('menu');
            }
            if (p.keyIsPressed && p.key === 'l') {
                p.shared.sceneManager.change('gameover');
            }
        },

        update() {
        },

        draw() {
            const r = p.shared.renderer;
            r.use('default');
            r.drawScene(() => {
                p.push();
                p.background(50, 0, 100);
                p.fill(255);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(42);
                p.text("Level 1 Running\nPress M for Menu\nDon't press L", 0, 0);
                p.pop();
            });
        },

        cleanup() {
            console.log("🧹 Level 1 cleanup");
        },
    };
}
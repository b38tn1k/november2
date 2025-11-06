

export function loadGameOver(p) {
    return {
        init() {
            console.log("💀 Game Over Screen");
        },
        onActionStart(action) {
            if (action === "pause") p.shared.sceneManager.change("menu");
        },

        onKeyPressed(key, keyCode) {
            if (p.keyIsPressed && p.key === 'm') {
                p.shared.sceneManager.change('menu');
            }
        },

        update() {

        },

        draw() {
            const r = p.shared.renderer;
            r.use('default');
            r.drawScene(() => {
                p.push();
                p.background(100, 0, 0);
                p.fill(255);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(42);
                p.text(`Game Over\nPress ${p.shared.controls.map.pause} for Menu`, 0, 0);
                p.pop();
            });
        },

        cleanup() {
            console.log("🧹 Game Over cleanup");
        },
    };
}
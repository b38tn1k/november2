export function loadMenu(p) {
    return {
        init() {
            console.log("📜 Menu initialized");
        },

        onKeyPressed(key, keyCode) {
            console.log(`Key pressed in Menu: ${key} (${keyCode})`);
            p.shared.sceneManager.change('level1');
        },

        update() {
            // Menu update loop (no direct key checks; handled via controls)
        },

        draw() {
            const r = p.shared.renderer;
            r.use('default'); // activate default shader

            // drawScene ensures the draw commands run inside the active shader pass
            r.drawScene(() => {
                p.push();
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(42);
                p.fill(255);
                p.text("Main Menu\nPress any key to start", 0, 0);
                p.pop();
            });
        },

        cleanup() {
            console.log("🧹 Menu cleanup");
        },
    };
}
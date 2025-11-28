// imports.js
import { BaseScene } from '../core/BaseScene.js';
import { MyButton } from '../components/myButton.js';

// levelPainter.js
export class LevelPainterScene extends BaseScene {
    constructor(p, opts = {}) {
        super(p);

        // grid resolution matches your levels (12 rows, 21 cols)
        this.rows = 12;
        this.cols = 21;

        // layers: layout, currents, hazards, entities
        this.layers = {
            layout: this.makeGrid('.'),
            currents: this.makeGrid('.'),
            hazards: this.makeGrid('.'),
            entities: this.makeGrid('.')
        };

        // active brush + active layer
        this.activeLayer = 'layout';
        this.activeBrush = '#';

        // pointer state
        this.isPainting = false;

        // UI DOM
        this.textArea = null;
    }

    // Utility: create an empty grid
    makeGrid(fill) {
        const out = [];
        for (let r = 0; r < this.rows; r++) {
            const row = [];
            for (let c = 0; c < this.cols; c++) row.push(fill);
            out.push(row);
        }
        return out;
    }

    init() {
        // load neutral ambient background level
        this.levelData = this.p.shared.parseLevel(this.p.shared.levels.menu, this.p);
        super.init();

        const uiLayer = this.renderer.layers.uiLayer;
        this.addInGameMenuButtons();

        this.p.shared.player.deactivate();
        if (this.friend) this.friend.deactivate();

        // JSON output area
        this.textArea = this.p.createElement('textarea');
        this.textArea.attribute('spellcheck', 'false');
        this.textArea.style('position', 'absolute');
        this.textArea.style('right', '2%');
        this.textArea.style('top', '10%');
        this.textArea.style('width', '26%');
        this.textArea.style('height', '80%');
        this.textArea.style('font-size', '14px');
        this.textArea.style('padding', '8px');
        this.textArea.style('border', '2px solid #444');
        this.textArea.style('outline', 'none');
        this.textArea.style('resize', 'none');
        this.textArea.value('');

        // Buttons: export, playtest, layer switches
        this.buildUI(uiLayer);
    }

    buildUI(uiLayer) {
        // Export JSON
        const btnExport = new MyButton(
            uiLayer.width * 0.05, uiLayer.height * 0.15,
            uiLayer.width * 0.18, uiLayer.height * 0.07,
            "Export JSON", uiLayer,
            () => this.exportJSON(),
            this.p
        );
        this.registerUI(btnExport);

        // Playtest button
        const btnPlay = new MyButton(
            uiLayer.width * 0.05, uiLayer.height * 0.25,
            uiLayer.width * 0.18, uiLayer.height * 0.07,
            "Play", uiLayer,
            () => this.playtest(),
            this.p
        );
        this.registerUI(btnPlay);

        // Layer switches
        const layerNames = ['layout', 'currents', 'hazards', 'entities'];
        layerNames.forEach((name, idx) => {
            const b = new MyButton(
                uiLayer.width * 0.05,
                uiLayer.height * (0.40 + idx * 0.10),
                uiLayer.width * 0.18,
                uiLayer.height * 0.07,
                name,
                uiLayer,
                () => { this.activeLayer = name; },
                this.p
            );
            this.registerUI(b);
        });

        // Brush palette (basic set; expand easily)
        const brushes = ['#', '.', 'S', 'E', 'a', 'b', 'g', 'l', 'm', 'F', 'I'];
        brushes.forEach((symbol, idx) => {
            const b = new MyButton(
                uiLayer.width * 0.30,
                uiLayer.height * (0.15 + idx * 0.06),
                uiLayer.width * 0.10,
                uiLayer.height * 0.05,
                symbol,
                uiLayer,
                () => { this.activeBrush = symbol; },
                this.p
            );
            this.registerUI(b);
        });
    }


    // -------------------------------
    // Core Painting Logic
    // -------------------------------

    screenToTile(x, y) {
        const tile = this.screenToWorld({ x, y });
        if (!tile) return null;

        const col = Math.floor(tile.x);
        const row = Math.floor(tile.y);

        if (row < 0 || col < 0 || row >= this.rows || col >= this.cols) return null;
        return { row, col };
    }

    paintAt(row, col) {
        this.layers[this.activeLayer][row][col] = this.activeBrush;
        this.renderer.markDirty('worldLayer');
    }

    onMousePressed() {
        const t = this.screenToTile(this.p.mouseX, this.p.mouseY);
        if (!t) return;
        this.isPainting = true;
        this.paintAt(t.row, t.col);
    }

    onMouseDragged() {
        if (!this.isPainting) return;
        const t = this.screenToTile(this.p.mouseX, this.p.mouseY);
        if (!t) return;
        this.paintAt(t.row, t.col);
    }

    onMouseReleased() {
        this.isPainting = false;
    }


    // -------------------------------
    // Export + Playtest
    // -------------------------------

    exportJSON() {
        const levelObj = {
            name: "painted",
            layers: {
                layout: this.layers.layout.map(r => r.join('')),
                currents: this.layers.currents.map(r => r.join('')),
                hazards: this.layers.hazards.map(r => r.join('')),
                entities: this.layers.entities.map(r => r.join(''))
            },
            currentsLegend: this.p.shared.levels.level1.currentsLegend,
            entityLegend: this.p.shared.levels.level1.entityLegend,
            hazardLegend: {}
        };
        this.textArea.value(JSON.stringify(levelObj, null, 2));
    }

    playtest() {
        let parsed = null;
        try {
            parsed = JSON.parse(this.textArea.value());
        } catch (e) {
            console.warn("Invalid JSON for playtest:", e);
            return;
        }

        this.p.shared.sceneManager.register(
            'PAINTED',
            this.p.shared.scenes.Level1Scene,
            { level: parsed, nextScene: 'menu', chapter: 'PAINTED' }
        );

        this.p.shared.sceneManager.change('PAINTED');
    }


    // -------------------------------
    // Draw World
    // -------------------------------

    update() {
        const [r, player, dt] = super.update();

        // Always keep UI redrawn
        r.markDirty('uiLayer');

        // World layer updated while painting
        if (this.isPainting) r.markDirty('worldLayer');

        return [r, player, dt];
    }

    draw() {
        const r = this.renderer;
        const layers = r.layers;

        r.drawScene(() => {
            // draw ambient level boundary if relevant
            if (this.recentlyLaunchedScene || this.recentlyChangedScene) {
                this.drawWorldBoundary(layers.worldLayer);
            }

            // draw the grid + painted tiles
            this.drawGrid(layers.worldLayer);

            super.draw();
        });
    }

    drawGrid(layer) {
        const p = this.p;
        layer.push();
        layer.noStroke();

        // tile drawing (flat colored preview)
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const ch = this.layers[this.activeLayer][r][c];
                if (ch !== '.') {
                    layer.fill(200, 200, 200, 180); // neutral preview
                    layer.rect(c, r, 1, 1);
                }
            }
        }

        // grid lines
        layer.stroke(255, 80);
        layer.strokeWeight(0.03);
        for (let r = 0; r <= this.rows; r++) layer.line(0, r, this.cols, r);
        for (let c = 0; c <= this.cols; c++) layer.line(c, 0, c, this.rows);

        layer.pop();
    }

    cleanup() {
        if (this.textArea) {
            this.textArea.remove();
            this.textArea = null;
        }
        super.cleanup();
    }
}
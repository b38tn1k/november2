import { createTiming } from './core/timing.js';
import { createRenderer } from './core/renderer.js';
import { registerControls } from './core/controls.js';
import { registerSystemEvents } from './core/system.js';
import { createSceneManager } from './core/sceneManager.js';
import { createGameState } from './core/state.js';
import { loadMenu } from './scenes/menu.js';
import { loadLevel1 } from './scenes/level1.js';
import { loadGameOver } from './scenes/gameover.js';
import { createPlayer } from './entities/player.js';
import { Debug } from './core/debug.js';

export const mainSketch = (p) => {
  let testFont;
  let timing;
  p.shared = {};

  p.preload = () => {
    // Load any built-in or custom font to satisfy WebGL text
    testFont = p.loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
    p.shared.levels = p.loadJSON('./config/levels.json');
  };

  p.setup = async () => {
    p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
    p.frameRate(60);
    p.textFont(testFont);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(42);
    
    p.shared.Debug = Debug;
    p.shared.state = createGameState();
    p.shared.renderer = await createRenderer(p);
    p.shared.sceneManager = createSceneManager(p);
    p.shared.player = createPlayer(p);

    registerSystemEvents(p);
    registerControls(p);
    timing = createTiming(p);

    // Register scenes
    p.shared.sceneManager.register('menu', loadMenu(p));
    p.shared.sceneManager.register('level1', loadLevel1(p));
    p.shared.sceneManager.register('gameover', loadGameOver(p));

    // Start with menu
    p.shared.sceneManager.change('menu');
  };

  p.draw = () => {
    timing.update();

    const { renderer, sceneManager } = p.shared;
    if (!renderer || !sceneManager) return;

    while (timing.shouldStep()) {
      sceneManager.update();
    }

    p.background(0);
    renderer.drawScene(() => {
      sceneManager.draw(timing.getAlpha());
    });
  };

};

new p5(mainSketch);
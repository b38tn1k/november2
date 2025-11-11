function systemEventWindowResized(p) {
  if (!p.shared) p.shared = {};
  if (!p.shared.debounce) p.shared.debounce = {};

  clearTimeout(p.shared.debounce.resizeTimer);
  p.shared.debounce.resizeTimer = setTimeout(() => {
    let w = window.innerWidth;
    let h = window.innerHeight;

    if (h > w) {
      // Portrait mode: swap width and height, rotate canvas
      let temp = w;
      w = h;
      h = temp;
      p.shared.isPortrait = true;
      p.resizeCanvas(w, h);
      if (p.shared.mainCanvas && p.shared.mainCanvas.elt) {
        p.shared.mainCanvas.elt.style.transform = 'rotate(90deg)';
        p.shared.mainCanvas.elt.style.transformOrigin = 'top left';
        p.shared.mainCanvas.elt.style.position = 'absolute';
        p.shared.mainCanvas.elt.style.top = '0';
        p.shared.mainCanvas.elt.style.left = '0';
        p.shared.mainCanvas.elt.style.width = `${w}px`;
        p.shared.mainCanvas.elt.style.height = `${h}px`;
        p.shared.mainCanvas.elt.style.margin = '0';
        p.shared.mainCanvas.elt.style.padding = '0';
        p.shared.mainCanvas.elt.style.display = 'block';
        p.shared.mainCanvas.elt.style.translate = `${h}px 0`;
      }
    } else {
      // Landscape mode: no rotation
      p.shared.isPortrait = false;
      p.resizeCanvas(w, h);
      if (p.shared.mainCanvas && p.shared.mainCanvas.elt) {
        p.shared.mainCanvas.elt.style.transform = '';
        p.shared.mainCanvas.elt.style.position = '';
        p.shared.mainCanvas.elt.style.top = '';
        p.shared.mainCanvas.elt.style.left = '';
        p.shared.mainCanvas.elt.style.width = '';
        p.shared.mainCanvas.elt.style.height = '';
        p.shared.mainCanvas.elt.style.margin = '';
        p.shared.mainCanvas.elt.style.padding = '';
        p.shared.mainCanvas.elt.style.display = '';
        p.shared.mainCanvas.elt.style.translate = '';
      }
    }

    p.shared.viewport = { width: w, height: h };
    p.shared.renderer.resize(w, h);
    console.log(`Window resized to ${w}x${h}`);
  }, 150);
}

function systemEventDeviceTurned(p) {
  if (!p.shared) p.shared = {};
  if (!p.shared.debounce) p.shared.debounce = {};

  clearTimeout(p.shared.debounce.deviceTimer);
  p.shared.debounce.deviceTimer = setTimeout(() => {
    let angle = 0;
    let type = 'unknown';

    if (screen.orientation) {
      angle = screen.orientation.angle || 0;
      type = screen.orientation.type || 'unknown';
    } else {
      type = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }

    if (p.onDeviceTurned) p.onDeviceTurned({ angle, type });
    systemEventWindowResized(p);
  }, 150);
}

export function registerSystemEvents(p) {
  window.addEventListener('resize', () => systemEventWindowResized(p));
  window.addEventListener('orientationchange', () => systemEventDeviceTurned(p));
  screen.orientation?.addEventListener('change', () => systemEventDeviceTurned(p));

  window.addEventListener('focus', () => p.onWindowFocus?.());
  window.addEventListener('blur', () => p.onWindowBlur?.());
}

export function setupCanvasWithAdaptation(p) {
  let w = window.innerWidth;
  let h = window.innerHeight;

  if (window.innerHeight > window.innerWidth) {
    p.shared.isPortrait = true;
    p.shared.mainCanvas = p.createCanvas(h, w, p.WEBGL);
    if (p.shared.mainCanvas && p.shared.mainCanvas.elt) {
      p.shared.mainCanvas.elt.style.transform = 'rotate(90deg)';
      p.shared.mainCanvas.elt.style.transformOrigin = 'top left';
      p.shared.mainCanvas.elt.style.position = 'absolute';
      p.shared.mainCanvas.elt.style.top = '0';
      p.shared.mainCanvas.elt.style.left = '0';
      p.shared.mainCanvas.elt.style.width = `${h}px`;
      p.shared.mainCanvas.elt.style.height = `${w}px`;
      p.shared.mainCanvas.elt.style.margin = '0';
      p.shared.mainCanvas.elt.style.padding = '0';
      p.shared.mainCanvas.elt.style.display = 'block';
      p.shared.mainCanvas.elt.style.translate = `${w}px 0`;
    }
  } else {
    p.shared.isPortrait = false;
    p.shared.mainCanvas = p.createCanvas(w, h, p.WEBGL);
    if (p.shared.mainCanvas && p.shared.mainCanvas.elt) {
      p.shared.mainCanvas.elt.style.transform = '';
      p.shared.mainCanvas.elt.style.position = '';
      p.shared.mainCanvas.elt.style.top = '';
      p.shared.mainCanvas.elt.style.left = '';
      p.shared.mainCanvas.elt.style.width = '';
      p.shared.mainCanvas.elt.style.height = '';
      p.shared.mainCanvas.elt.style.margin = '';
      p.shared.mainCanvas.elt.style.padding = '';
      p.shared.mainCanvas.elt.style.display = '';
      p.shared.mainCanvas.elt.style.translate = '';
    }
  }
}
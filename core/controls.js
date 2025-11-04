// core/controls.js
export function registerControls(p) {
  if (!p.shared) p.shared = {};
  if (!p.shared.debounce) p.shared.debounce = {};
  if (!p.shared.debounce.controls) p.shared.debounce.controls = {};
  const delay = 50;

  function debounceControl(eventName, fn) {
    clearTimeout(p.shared.debounce.controls[eventName]);
    p.shared.debounce.controls[eventName] = setTimeout(fn, delay);
  }

  function routeEvent(p, eventName, ...args) {
    const scene = p.shared?.sceneManager?.current;
    const handler = scene?.[eventName];
    if (handler) handler(...args);
  }

  p.mousePressed = () => debounceControl('mousePressed', () => {
    console.log(`Mouse pressed at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onMousePressed', p.mouseX, p.mouseY);
  });

  p.mouseReleased = () => debounceControl('mouseReleased', () => {
    console.log(`Mouse released at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onMouseReleased', p.mouseX, p.mouseY);
  });

  p.mouseMoved = () => debounceControl('mouseMoved', () => {
    console.log(`Mouse moved to (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onMouseMoved', p.mouseX, p.mouseY);
  });

  p.mouseDragged = () => debounceControl('mouseDragged', () => {
    console.log(`Mouse dragged at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onMouseDragged', p.mouseX, p.mouseY);
  });

  p.touchStarted = () => debounceControl('touchStarted', () => {
    console.log(`Touch started at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onTouchStarted', p.mouseX, p.mouseY);
  });

  p.touchEnded = () => debounceControl('touchEnded', () => {
    console.log(`Touch ended at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onTouchEnded', p.mouseX, p.mouseY);
  });

  p.keyPressed = () => debounceControl('keyPressed', () => {
    console.log(`Key pressed: ${p.key} (${p.keyCode})`);
    routeEvent(p, 'onKeyPressed', p.key, p.keyCode);
  });

  p.keyReleased = () => debounceControl('keyReleased', () => {
    console.log(`Key released: ${p.key} (${p.keyCode})`);
    routeEvent(p, 'onKeyReleased', p.key, p.keyCode);
  });
}
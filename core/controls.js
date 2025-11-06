// core/controls.js

export async function registerControls(p) {
  const Debug = p.shared.Debug;
  if (!p.shared) p.shared = {};
  if (!p.shared.debounce) p.shared.debounce = {};
  if (!p.shared.debounce.controls) p.shared.debounce.controls = {};
  // Load key mapping from JSON
  const response = await fetch('./config/controls.json');
  const keyMap = await response.json();
  p.shared.controls = { map: keyMap, state: {} };

  const delay = 25;

  function debounceControl(eventName, fn) {
    clearTimeout(p.shared.debounce.controls[eventName]);
    p.shared.debounce.controls[eventName] = setTimeout(fn, delay);
  }

  function routeEvent(p, eventName, key, keyCode) {
    const scene = p.shared?.sceneManager?.current;
    const player = p.shared?.player;
    const handlers = [scene, player];

    // find which actions this key belongs to
    const actions = Object.entries(p.shared.controls.map)
      .filter(([_, keys]) => keys.includes(key))
      .map(([action]) => action);

    for (const handler of handlers) {
      if (!handler) continue;

      // raw key event
      handler[eventName]?.(key, keyCode);

      // mapped action events
      for (const action of actions) {
        if (eventName === 'onKeyPressed')
          handler.onActionStart?.(action);
        if (eventName === 'onKeyReleased')
          handler.onActionEnd?.(action);
      }
    }
  }

  function setKeyState(key, isDown) {
    for (const action in keyMap) {
      if (keyMap[action].includes(key)) {
        p.shared.controls.state[action] = isDown;
      }
    }
  }

  p.mousePressed = () => debounceControl('mousePressed', () => {
    Debug.log('controls', `Mouse pressed at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onMousePressed', p.mouseX, p.mouseY);
  });

  p.mouseReleased = () => debounceControl('mouseReleased', () => {
    Debug.log('controls', `Mouse released at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onMouseReleased', p.mouseX, p.mouseY);
  });

  p.mouseMoved = () => debounceControl('mouseMoved', () => {
    Debug.log('controls', `Mouse moved to (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onMouseMoved', p.mouseX, p.mouseY);
  });

  p.mouseDragged = () => debounceControl('mouseDragged', () => {
    Debug.log('controls', `Mouse dragged at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onMouseDragged', p.mouseX, p.mouseY);
  });

  p.touchStarted = () => debounceControl('touchStarted', () => {
    Debug.log('controls', `Touch started at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onTouchStarted', p.mouseX, p.mouseY);
  });

  p.touchEnded = () => debounceControl('touchEnded', () => {
    Debug.log('controls', `Touch ended at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onTouchEnded', p.mouseX, p.mouseY);
  });

  p.keyPressed = () => debounceControl('keyPressed', () => {
    Debug.log('controls', `Key pressed: ${p.key} (${p.keyCode})`);
    routeEvent(p, 'onKeyPressed', p.key, p.keyCode);
    setKeyState(p.key, true);
  });

  p.keyReleased = () => debounceControl('keyReleased', () => {
    Debug.log('controls', `Key released: ${p.key} (${p.keyCode})`);
    routeEvent(p, 'onKeyReleased', p.key, p.keyCode);
    setKeyState(p.key, false);
  });
  // allow querying if a mapped control is active
  p.shared.controls.isActive = (action) => !!p.shared.controls.state[action];
}
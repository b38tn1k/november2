import { GeometryTools } from './GeometryTools.js';

export function drawOrganicBlockingBackground(p, layer, mapTransform, tiles, opts = {}) {
  if (!layer || !mapTransform) {
    console.warn('⚠️ drawOrganicBlockingBackground: Missing layer or mapTransform');
    return;
  }

  const { tileSizePx, originPx } = mapTransform;

  layer.clear();
  layer.noStroke();
  layer.fill(p.shared.chroma.terrain);

  const regions = GeometryTools.extractTileRegions(tiles);

  for (const region of regions) {
    const outline = GeometryTools.computeRegionOutline(region);
    if (outline.length === 0) continue;

    const distorted = GeometryTools.distortPolygon(outline, p, opts);

    layer.beginShape();
    for (const pt of distorted) {
      const sx = originPx.x + pt.x * tileSizePx;
      const sy = originPx.y + pt.y * tileSizePx;
      layer.curveVertex(sx, sy);
    }
    layer.endShape(p.CLOSE);
  }
}

export function drawBlockingBackgroundTransformed(p, layer, mapTransform, tiles) {
  if (!layer || !mapTransform) {
    console.warn('⚠️ drawBlockingBackgroundTransformed: Missing layer or mapTransform');
    return;
  }
  const { tileSizePx, originPx } = mapTransform;

  layer.clear();
  layer.noStroke();
  layer.fill(p.shared.chroma.terrain);

  for (const t of tiles) {
    if (t && Number.isFinite(t.x) && Number.isFinite(t.y)) {
      const px = originPx.x + t.x * tileSizePx;
      const py = originPx.y + t.y * tileSizePx;
      layer.rect(px, py, tileSizePx, tileSizePx);
    }
  }
}

export function drawCurrents(p, layer, mapTransform, currents, drawArrows = true) {
  if (!currents) return;

  const { tileSizePx } = mapTransform;

  for (const c of currents) {
    const { x, y, dx, dy } = c;

    const { x: sx, y: sy } = {
      x: mapTransform.originPx.x + x * tileSizePx,
      y: mapTransform.originPx.y + y * tileSizePx
    };

    layer.noStroke();
    layer.fill(p.shared.chroma.current);
    layer.rect(sx, sy, tileSizePx, tileSizePx);

    if (drawArrows) {
      const cx = sx + tileSizePx * 0.5;
      const cy = sy + tileSizePx * 0.5;

      const ax = dx * (tileSizePx * 0.01);
      const ay = dy * (tileSizePx * 0.01);

      layer.stroke(0);
      layer.strokeWeight(1);
      layer.line(cx, cy, cx + ax, cy + ay);

      const angle = Math.atan2(ay, ax);
      const headLen = tileSizePx * 0.15;

      layer.line(
        cx + ax,
        cy + ay,
        cx + ax - headLen * Math.cos(angle - Math.PI / 6),
        cy + ay - headLen * Math.sin(angle - Math.PI / 6)
      );
      layer.line(
        cx + ax,
        cy + ay,
        cx + ax - headLen * Math.cos(angle + Math.PI / 6),
        cy + ay - headLen * Math.sin(angle + Math.PI / 6)
      );
    }
  }
}

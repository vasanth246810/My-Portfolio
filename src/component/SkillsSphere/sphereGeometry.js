/**
 * Mathematical calculations and 3D projection algorithms for the Skills Sphere.
 */

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const clamp01 = (val) => (val < 0 ? 0 : val > 1 ? 1 : val);

export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Distributes n points evenly on a 3D unit sphere using the Fibonacci sphere algorithm.
 * @param {number} count Total number of items
 * @returns {Array<{x: number, y: number, z: number}>} Array of unit 3D coordinates
 */
export function calculateFibonacciSpherePoints(count) {
  if (!count || count <= 0) return [];
  if (count === 1) return [{ x: 0, y: 0, z: -1 }];

  const points = [];
  for (let i = 0; i < count; i++) {
    // Spherical polar coordinate phi (latitude)
    const phi = Math.acos(-1 + (2 * i + 1) / count);
    // Spherical azimuthal coordinate theta (longitude)
    const theta = Math.sqrt(count * Math.PI) * phi;

    const x = Math.cos(theta) * Math.sin(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(phi);

    points.push({ x, y, z });
  }

  return points;
}

/**
 * Rotates a 3D point using pitch (angleX) and yaw (angleY), then projects it onto a 2D viewport.
 * 
 * @param {{x: number, y: number, z: number}} point - Unit sphere coordinate
 * @param {{angleX: number, angleY: number}} angles - Euler angles in radians
 * @param {{rx: number, ry: number}} radii - Sphere radii (horizontal and vertical)
 * @param {{width: number, height: number}} stageSize - Viewport container dimensions
 * @param {number} [fovMultiplier=2.2] - Focal length multiplier (balanced for clear depth without excessive front ballooning)
 * @returns {{
 *   screenX: number,
 *   screenY: number,
 *   scale: number,
 *   opacity: number,
 *   zIndex: number,
 *   Z: number
 * }} Projected 2D attributes
 */
export function rotateAndProjectPoint(point, angles, radii, stageSize, fovMultiplier = 3.8) {
  const { angleX, angleY } = angles;
  const { rx, ry } = radii;
  const { width, height } = stageSize;

  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);

  // 1. Yaw rotation around Y-axis
  const x1 = point.x * cosY - point.z * sinY;
  const z1 = point.x * sinY + point.z * cosY;

  // 2. Pitch rotation around X-axis
  const y2 = point.y * cosX - z1 * sinX;
  const z2 = point.y * sinX + z1 * cosX;

  // 3. Scaled 3D coordinates
  const X = x1 * rx;
  const Y = y2 * ry;
  const Z = z2 * rx;

  // 4. Perspective projection calculation
  // Camera is located at (0, 0, -fov) looking along +Z
  // fovMultiplier = 3.8 provides a balanced scale range (~0.79 to ~1.35) preventing GPU texture blur
  const fov = rx * fovMultiplier;
  const scale = fov / (fov + Z);

  const cx = width / 2;
  const cy = height / 2;

  const screenX = cx + X * scale;
  const screenY = cy + Y * scale;

  // 5. Depth and stacking order calculation
  // High-contrast clarity floor: rear tags remain solid (min opacity 0.68), eliminating washed-out blur
  const depth = clamp01((scale - 0.78) / 0.55);
  const opacity = 0.68 + 0.32 * depth;
  const zIndex = Math.round(scale * 200);

  return {
    screenX,
    screenY,
    scale,
    opacity,
    zIndex,
    Z,
  };
}

/**
 * Calculates optimal sphere horizontal and vertical radii based on viewport size
 * and tag dimensions to prevent boundary clipping while maximizing breathing room.
 * 
 * @param {number} stageWidth - Stage width in pixels
 * @param {number} stageHeight - Stage height in pixels
 * @param {number} [maxTagHalfWidth=25] - Estimated half-width of the widest tag
 * @param {number} [flatThreshold=560] - Width under which flat fallback activates
 * @returns {{rx: number, ry: number, isFlat: boolean}}
 */
export function calculateSphereRadii(stageWidth, stageHeight, maxTagHalfWidth = 25, flatThreshold = 560) {
  const isFlat = stageWidth < flatThreshold;
  if (isFlat) {
    return { rx: 120, ry: 120, isFlat: true };
  }

  // Perspective factor K accounts for projection expansion
  const K = 1.15;
  const OVAL = 1.25; // Wider horizontal spread gives a spacious globe presentation

  const roomX = (stageWidth / 2 - (maxTagHalfWidth || 25) - 20) / (K * OVAL);
  const roomY = (stageHeight / 2 - 28) / K;

  const baseRadius = Math.max(100, Math.min(stageWidth * 0.38, roomX, roomY));

  return {
    rx: baseRadius * OVAL,
    ry: baseRadius,
    isFlat: false,
  };
}

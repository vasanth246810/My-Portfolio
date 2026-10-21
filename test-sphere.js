// Automated verification suite for Skills Sphere mathematics and data
import {
  calculateFibonacciSpherePoints,
  rotateAndProjectPoint,
  calculateSphereRadii,
  lerp,
  clamp01,
} from './src/component/SkillsSphere/sphereGeometry.js';
import {
  CATEGORIES,
  STANDARD_SKILLS,
  PORTFOLIO_SKILLS,
  HIGH_DENSITY_SKILLS,
  LONG_LABELS_SKILLS,
  EMPTY_SKILLS,
} from './src/component/SkillsSphere/skillsData.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

console.log('\n--- 1. Testing Fibonacci Sphere Point Distribution ---');
const emptyPoints = calculateFibonacciSpherePoints(0);
assert(Array.isArray(emptyPoints) && emptyPoints.length === 0, 'Count 0 returns empty array');

const singlePoint = calculateFibonacciSpherePoints(1);
assert(singlePoint.length === 1, 'Count 1 returns 1 point');
const r1 = Math.sqrt(singlePoint[0].x**2 + singlePoint[0].y**2 + singlePoint[0].z**2);
assert(Math.abs(r1 - 1.0) < 1e-4, 'Single point lies on unit sphere');

[12, 36, 54].forEach((count) => {
  const points = calculateFibonacciSpherePoints(count);
  assert(points.length === count, `Fibonacci sphere generates exact point count for ${count}`);

  let onSphere = true;
  for (const p of points) {
    const dist = Math.sqrt(p.x**2 + p.y**2 + p.z**2);
    if (Math.abs(dist - 1.0) > 1e-4) {
      onSphere = false;
      break;
    }
  }
  assert(onSphere, `All ${count} points lie precisely on the unit sphere`);

  // Check no duplicates or extreme clustering
  let minDist = Infinity;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const d = Math.sqrt(
        (points[i].x - points[j].x)**2 +
        (points[i].y - points[j].y)**2 +
        (points[i].z - points[j].z)**2
      );
      if (d < minDist) minDist = d;
    }
  }
  assert(minDist > 0.1, `Points are well-distributed without clustering (min distance: ${minDist.toFixed(3)})`);
});

console.log('\n--- 2. Testing 3D Rotation and Perspective Projection ---');
const radii = { rx: 180, ry: 150 };
const stageSize = { width: 800, height: 600 };

// Camera is at (0, 0, -fov) looking along +Z into the screen.
// Front point (nearest to viewer): z = -1
const frontPoint = { x: 0, y: 0, z: -1 };
// Back point (farthest from viewer): z = +1
const backPoint = { x: 0, y: 0, z: 1 };

const frontProj = rotateAndProjectPoint(frontPoint, { angleX: 0, angleY: 0 }, radii, stageSize);
const backProj = rotateAndProjectPoint(backPoint, { angleX: 0, angleY: 0 }, radii, stageSize);

assert(frontProj.scale > backProj.scale, `Front tag scale (${frontProj.scale.toFixed(2)}) is larger than rear tag scale (${backProj.scale.toFixed(2)})`);
assert(frontProj.opacity > backProj.opacity, `Front tag opacity (${frontProj.opacity.toFixed(2)}) is higher than rear tag opacity (${backProj.opacity.toFixed(2)})`);
assert(frontProj.zIndex > backProj.zIndex, `Front tag zIndex (${frontProj.zIndex}) is higher than rear tag zIndex (${backProj.zIndex})`);
assert(Math.abs(frontProj.screenX - 400) < 1e-2 && Math.abs(frontProj.screenY - 300) < 1e-2, 'Center point projects to stage center');

console.log('\n--- 3. Testing Dynamic Radius and Responsive Thresholds ---');
const desktopRadii = calculateSphereRadii(800, 500, 70);
assert(!desktopRadii.isFlat, 'Desktop width (800px) activates 3D sphere');
assert(desktopRadii.rx > 100 && desktopRadii.ry > 100, `Desktop radii computed safely (rx: ${desktopRadii.rx.toFixed(1)}, ry: ${desktopRadii.ry.toFixed(1)})`);

const mobileRadii = calculateSphereRadii(480, 500, 70);
assert(mobileRadii.isFlat, 'Mobile width (480px < 560px) activates flat fallback mode');

console.log('\n--- 4. Testing Skill Datasets & Category Schema ---');
const validCatIds = new Set(CATEGORIES.map((c) => c.id));

[
  { name: 'STANDARD_SKILLS', data: STANDARD_SKILLS, minLen: 30 },
  { name: 'PORTFOLIO_SKILLS', data: PORTFOLIO_SKILLS, minLen: 12 },
  { name: 'HIGH_DENSITY_SKILLS', data: HIGH_DENSITY_SKILLS, minLen: 50 },
  { name: 'LONG_LABELS_SKILLS', data: LONG_LABELS_SKILLS, minLen: 8 },
  { name: 'EMPTY_SKILLS', data: EMPTY_SKILLS, minLen: 0 },
].forEach(({ name, data, minLen }) => {
  assert(data.length >= minLen, `${name} has sufficient items (${data.length})`);
  let validItems = true;
  for (const item of data) {
    if (!item.name || typeof item.name !== 'string') validItems = false;
    if (!validCatIds.has(item.category)) validItems = false;
    if (typeof item.weight !== 'number' || item.weight < 1 || item.weight > 3) validItems = false;
  }
  assert(validItems, `${name} conforms to skill schema (valid name, category, weight 1..3)`);
});

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);

# Technical & Design Specification: 3D Spherical Skills Visualization

## 1. Design Intent & Reference

This specification defines the architecture, mathematical algorithms, rendering approach, visual design, and accessibility rules for the **3D Spherical Skills Visualization**.

### Reference Analysis
- **Live Reference**: [https://aahana-surya.github.io/](https://aahana-surya.github.io/)
- **Repository**: [https://github.com/aahana-surya/aahana-surya.github.io](https://github.com/aahana-surya/aahana-surya.github.io)
- **Key Characteristics Observed**:
  - Skill badges and labels distributed in 3D around an ellipsoid/sphere.
  - Interactive pointer drag with inertia/momentum and smooth decay back to idle auto-rotation.
  - Perspective projection providing dynamic scaling ($fov / (fov + Z)$) and depth-based opacity.
  - Category filtering with active states, highlighting matching skills with radiant glow and dimming non-matching skills.
  - Responsive fallback on narrow viewports ($< 560\text{px}$) switching from 3D sphere to a clean, wrapped flat tag list.
  - DOM-based rendering with CSS transforms, avoiding the overhead of heavy WebGL/Three.js bundles while keeping labels crisp and accessible.

---

## 2. Component Anatomy

The Skills Sphere component is composed of:
1. **Header & Context**:
   - Section headline and decorative subheading following the portfolio's gradient typography tokens.
2. **Category Filter Toolbar**:
   - Category filter pills with category color indicators (dot or border).
   - "All" pill and category pills with keyboard support, clear `:focus-visible` outlines, and active state styles.
3. **Interactive 3D Stage (`.skills-sphere-stage`)**:
   - Viewport container configured with `overflow: clip` to avoid horizontal page scrolling.
   - Relative positioning, centered coordinate system.
   - Pointer capture for seamless mouse and touch dragging.
4. **Projected Skill Nodes (`.sphere-tag`)**:
   - Individual DOM elements positioned via `left`, `top`, `transform: translate(-50%, -50%) scale(...)`, `z-index`, and `opacity`.
   - Category color accenting, skill weight styling, and glow text-shadows on match.
5. **Interactive Controls & Status**:
   - "Drag to spin" hint and keyboard hint for screen-reader and desktop users.
   - Live ARIA live region (`aria-live="polite"`) announcing active filter and matching count.
6. **Accessible Semantic Alternative**:
   - Screen-reader accessible categorized hierarchy (`.sr-only` or toggleable accessible list) ensuring full WCAG 2.1 AA compliance.

---

## 3. Mathematical Algorithms

### 3.1 Spherical Distribution (Fibonacci Sphere)
To distribute $n$ skill labels uniformly over the surface of a virtual sphere without clumping at the poles or along meridians, the **Fibonacci Sphere** algorithm is utilized:

Given $n$ items, for each index $i \in \{0, 1, \dots, n - 1\}$:
$$ \phi_i = \arccos\left(-1 + \frac{2i + 1}{n}\right) $$
$$ \theta_i = \sqrt{n \pi} \cdot \phi_i $$

The initial 3D coordinates on the unit sphere ($r = 1$) are:
$$ x_0 = \cos(\theta_i) \cdot \sin(\phi_i) $$
$$ y_0 = \sin(\theta_i) \cdot \sin(\phi_i) $$
$$ z_0 = \cos(\phi_i) $$

*Edge cases*:
- For $n = 0$: Returns an empty set safely.
- For $n = 1$: Placed at $(0, 0, 1)$ or centered.

### 3.2 3D Rotation (Euler Angles Pitch & Yaw)
The sphere rotates around the Y-axis (yaw: $\theta_Y$) and X-axis (pitch: $\theta_X$):
1. **Yaw Rotation around Y-axis**:
   $$ x_1 = x_0 \cos(\theta_Y) - z_0 \sin(\theta_Y) $$
   $$ z_1 = x_0 \sin(\theta_Y) + z_0 \cos(\theta_Y) $$
2. **Pitch Rotation around X-axis**:
   $$ y_2 = y_0 \cos(\theta_X) - z_1 \sin(\theta_X) $$
   $$ z_2 = y_0 \sin(\theta_X) + z_1 \cos(\theta_X) $$
3. **Radius Scaling**:
   $$ X = x_1 \cdot R_x $$
   $$ Y = y_2 \cdot R_y $$
   $$ Z = z_2 \cdot R_x $$

### 3.3 Perspective Projection
To project 3D points $(X, Y, Z)$ onto the 2D viewport:
- Let $fov$ be the focal length:
  $$ fov = R_x \times 1.9 $$
- The perspective scale factor:
  $$ \text{scale} = \frac{fov}{fov + Z} $$
- 2D Screen Position relative to stage center $(cx, cy)$:
  $$ \text{screenX} = cx + X \cdot \text{scale} $$
  $$ \text{screenY} = cy + Y \cdot \text{scale} $$

### 3.4 Boundary Clamping and Radius Calculation
Perspective projection shifts extreme points outward up to:
$$ K \approx 1.2 $$
To ensure that tags never collide with stage bounds or clip outside:
- Let $\text{maxHalfWidth}$ be half the width of the widest tag in the dataset.
- Available horizontal radius:
  $$ \text{roomX} = \frac{W / 2 - \text{maxHalfWidth} - 12}{K \times \text{OVAL}} $$
- Available vertical radius:
  $$ \text{roomY} = \frac{H / 2 - 20}{K} $$
- Sizing radius:
  $$ R_y = \max\left(90, \min(W \times 0.35, \text{roomX}, \text{roomY})\right) $$
  $$ R_x = R_y \times \text{OVAL} \quad (\text{where } \text{OVAL} \approx 1.15) $$

### 3.5 Depth & Stacking Rules
- **z-index**:
  $$ z\text{-index} = \text{round}(\text{scale} \cdot 200) $$
- **Opacity**:
  $$ \text{depth} = \text{clamp01}\left(\frac{\text{scale} - 0.5}{0.85}\right) $$
  $$ \text{opacity} = 0.15 + 0.85 \cdot \text{depth}^2 $$
  Near tags ($Z > 0$) have $\text{opacity} \to 1.0$ and $\text{scale} \to 1.6 - 2.1$.
  Far tags ($Z < 0$) have $\text{opacity} \to 0.15 - 0.30$ and $\text{scale} \to 0.65 - 0.85$.

---

## 4. Typography & Skill Weights

Skills support three weight levels indicating proficiency or prominence:
- **Weight 3 (Core / Expert)**:
  - Base font size: `0.92rem` (`14.7px`)
  - Font weight: `600`
  - High prominence in projection
- **Weight 2 (Proficient / Intermediate)**:
  - Base font size: `0.78rem` (`12.5px`)
  - Font weight: `500`
- **Weight 1 (Familiar / Supporting)**:
  - Base font size: `0.65rem` (`10.4px`)
  - Font weight: `400`

---

## 5. Category Taxonomy & Color Tokens

| Category Key | Category Label | Accent Color | Visual Representation |
| :--- | :--- | :--- | :--- |
| `languages` | Programming Languages | `#8fcaff` (Ice Blue) | Dot `#8fcaff`, text `#8fcaff` |
| `frontend_backend` | Frontend & Backend | `#6ee7d5` (Teal) | Dot `#6ee7d5`, text `#6ee7d5` |
| `ai_ml` | AI & Machine Learning | `#c4b5fd` (Lavender) | Dot `#c4b5fd`, text `#c4b5fd` |
| `cloud_infra` | Cloud & Infrastructure | `#fdba74` (Peach/Orange) | Dot `#fdba74`, text `#fdba74` |
| `databases_tools` | Databases & Tools | `#fde047` (Amber/Gold) | Dot `#fde047`, text `#fde047` |

### Filtering Behavior:
- When a category is active:
  - Tags matching the category retain full depth opacity and gain radiant glow (`text-shadow: 0 0 16px currentColor`).
  - Tags not matching the category are de-emphasized to $\text{opacity} = 0.08$ with zero glow.
- When `all` is active:
  - All tags use standard depth-aware opacity.

---

## 6. Motion & Pointer Interactions

- **Idle Auto-Rotation**:
  - Horizontal velocity: $\text{idleVelY} = 0.0022\,\text{rad/frame}$
  - Vertical velocity: $\text{idleVelX} = 0.0008\,\text{rad/frame}$
- **Pointer Drag (Mouse & Touch)**:
  - Dragging applies yaw $\Delta x \times 0.005$ and pitch $-\Delta y \times 0.005$.
  - Fling velocity: $\text{velY} = \Delta x \times 0.0018$, $\text{velX} = -\Delta y \times 0.0018$.
  - On pointer release, velocity decays smoothly back to idle velocity via linear interpolation:
    $$ \text{vel} = \text{lerp}(\text{vel}, \text{idleVel}, 0.03) $$
- **Reduced Motion (`prefers-reduced-motion`)**:
  - If enabled, auto-rotation is paused ($\text{vel} = 0$). Manual dragging remains available.
- **Viewport Visibility**:
  - `IntersectionObserver` halts the animation loop when the stage is off-screen.
  - `document.visibilitychange` halts the loop when the browser tab is hidden.

---

## 7. Responsive & Mobile Design

- **Desktop ($\ge 768\text{px}$)**: Full 3D sphere stage ($500\text{px}$ height, up to $600\text{px}$ width).
- **Tablet ($560\text{px} - 767\text{px}$)**: Stage scales dynamically to $400\text{px}$ height; radii auto-shrink based on container dimensions.
- **Mobile ($< 560\text{px}$)**: Automatic switch to **Responsive Flat Fallback**:
  - Stage height becomes `auto`.
  - Tags render as a wrapped, categorized flex grid of touch-friendly badges.
  - Full filtering and accessible navigation remain fully functional.

---

## 8. Accessibility (a11y) & WCAG Compliance

- **Semantic Fallback**: Hidden or toggleable structured HTML list (`<section role="region" aria-label="Skills directory">` with categorized unordered lists).
- **ARIA Live Regions**: `aria-live="polite"` announces: *"Showing X skills in category [Category]"*.
- **Keyboard Navigation**:
  - Category filter buttons are standard `<button>` elements with clear focus rings.
  - Arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) allow keyboard-only rotation of the 3D sphere.
  - `Space` key pauses and resumes rotation.
- **Color Independence**:
  - Tags display category badges or clear grouped headings in flat and accessible modes, avoiding sole reliance on color.

---

## 9. Edge Cases & Robustness

1. **Empty State**: Renders an accessible empty placeholder message without JavaScript errors.
2. **Very Long Labels**: Labels with $20+$ characters are measured dynamically to prevent boundary clipping.
3. **High Tag Density ($60+$ items)**: Fibonacci distribution smoothly scales angles and scales without visual degradation or performance drop.
4. **Window Resizing**: `ResizeObserver` recalculates radii and center points smoothly.

---

## 10. Acceptance Criteria

- [x] Spherical 3D distribution using Fibonacci algorithm.
- [x] Smooth perspective projection with depth-aware scaling and opacity.
- [x] Idle rotation, pointer drag with pointer capture, and momentum easing.
- [x] Category filtering with active states, glow emphasis, and non-blocking rotation.
- [x] Responsive fallback on viewports $< 560\text{px}$.
- [x] Accessible controls, keyboard navigation, and reduced-motion support.
- [x] Clean lifecycle management (no memory leaks or orphan animation frames).
- [x] Isolated demo playground reviewable without modifying existing portfolio flows.

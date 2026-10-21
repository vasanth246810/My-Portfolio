# 3D Spherical Skills Visualization - Demo & Review Guide

This guide explains how to launch, review, and test the **3D Spherical Skills Visualization** component and its dedicated demo playground, now featuring **Icons & Brand Badges**.

---

## 1. How to Launch the Demo

From the project root:

```bash
cd portfolio
npm run dev
```

Open your browser to the local dev server (default: `http://localhost:5173/`).

### Direct Demo Navigation
You can view the isolated demo in two convenient ways:
1. **Via Navigation Bar**: Click the **"✨ Sphere Demo"** button on the top navigation bar.
2. **Via URL Hash / Query**: Navigate directly to:
   - `http://localhost:5173/?demo=skills-sphere`
   - or `http://localhost:5173/#/demo/skills-sphere`

To return to the main portfolio page at any time, click the **"← Return to Portfolio"** button in the header of the demo page.

---

## 2. Interactive Features to Test

### 1. Icon & Presentation Modes
In the demo control bar, select from the **Content Display Style** dropdown:
- **✨ Icons + Names (Recommended)**: Displays high-res brand icons (from local assets and SVGs) side-by-side with skill labels inside modern glass pills.
- **🎯 Icons Only (Floating 3D Badges)**: Transforms the sphere into a 3D globe of floating circular technology badges with backdrop blur and depth-scaled drop shadows. Hovering over any icon reveals its name in an interactive tooltip!
- **🏷️ Names Only (Text Projection)**: The classic text-only projection mode.

### 2. 3D Globe Projection & Depth
- Notice how labels and icons orbit smoothly in 3D around a virtual sphere.
- As skills rotate to the front, they enlarge, sharpen, and increase opacity.
- As skills rotate to the rear, they scale down and fade gracefully, creating natural spatial depth.

### 3. Pointer & Touch Dragging
- Click and drag anywhere within the sphere container with your mouse.
- On touchscreens (mobile/tablet), touch and swipe in any direction.
- Notice the **natural momentum (fling inertia)** when releasing the drag, followed by a smooth exponential decay back to continuous idle rotation.

### 4. Category Filtering
Click on any category filter in the toolbar above the sphere:
- **All**
- **Programming Languages**
- **Frontend & Backend**
- **AI & Machine Learning**
- **Cloud & Infrastructure**
- **Databases & Tools**

**Observe**:
- Matching skills illuminate with glowing borders and text shadows (`text-shadow: 0 0 18px currentColor, box-shadow: 0 0 20px currentColor`).
- Non-matching skills fade into a subtle background opacity (`~0.08`).
- The sphere **continues rotating seamlessly** while filters change without jarring re-renders or resets.

### 5. Interactive Test Harness (Sidebar / Control Bar)
In the demo playground, use the interactive test panel to evaluate all required edge cases:
- **Dataset Switcher**:
  - `Standard Full Stack (36 skills)`: Realistic multi-category tech stack with icons.
  - `Original Portfolio (12 skills)`: The portfolio owner's existing skills from `Skills.jsx` mapped directly to their local PNG assets.
  - `High Density (51 skills)`: Tests performance and non-clumping distribution at higher item counts.
  - `Long Labels Stress Test`: Verifies that labels like *"Natural Language Processing Pipeline"* do not clip or break formatting.
  - `Empty State (0 skills)`: Verifies graceful degradation and accessible empty state messaging.
- **View Mode**:
  - Toggle between **3D Interactive Sphere** and **Responsive Flat Fallback**.
- **Motion Controls**:
  - Emulate **Reduced Motion** (`prefers-reduced-motion: reduce`) with one click to see how auto-rotation halts while allowing manual interaction.
  - Adjust rotation speed or pause/resume idle spin.
- **Accessible View Toggle**:
  - Inspect the semantic screen-reader hierarchical view.

### 6. Keyboard Accessibility
- Use `Tab` to navigate to the category filter buttons and press `Enter` or `Space` to activate.
- Focus into the sphere stage to rotate using the arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`).
- Press `Space` while focused on the sphere stage to pause/resume auto-rotation.

---

## 3. Architecture & File Structure

| File | Purpose |
| :--- | :--- |
| `src/component/SkillsSphere/sphereGeometry.js` | Pure mathematical module implementing Fibonacci sphere, Euler rotations, and perspective projection. |
| `src/component/SkillsSphere/skillsData.js` | Category configurations, color tokens, and test datasets with icon components and brand colors. |
| `src/component/SkillsSphere/skillAssetIcons.js` | Mapping to authentic PNG image assets from the portfolio. |
| `src/component/SkillsSphere/SkillsSphere.jsx` | Production-ready reusable 3D Skills Sphere component with icon rendering modes, a11y, RAF loop, and drag handlers. |
| `src/component/SkillsSphere/SkillsSphere.css` | High-performance CSS styles for stage, icon badges, projected tags, and responsive flat fallback. |
| `src/component/SkillsSphere/SkillsSphereDemo.jsx` | Dedicated demo playground with test controls, display mode switcher, and edge-case selector. |
| `src/component/SkillsSphere/SkillsSphereDemo.css` | Styles for the isolated demo playground. |
| `docs/design/skills-sphere-spec.md` | Complete architectural and mathematical design specification. |

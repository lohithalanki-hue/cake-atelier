/* ═══════════════════════════════════════════════════════
   CAKE ATELIER — Master 3D WebGL Artisanal Cake Engine
   Faithful recreation of user's reference photographs:
   - Image 2 (Top View): Luscious dark chocolate mirror glaze with
     a hand-set crescent wreath of fresh blueberries, blackberries & mint leaves
   - Image 3 (Side View): Vanilla-speckled buttercream cake on a porcelain pedestal,
     with organic cascading dark chocolate drips & piped buttercream rosettes
   - Full-Screen 3D Stage: The cake takes up the entire screen in open, cinematic space!
   - Starts at top-down view of berry crown, sweeps down to side profile
   - Rotates a full 360° circle on vertical Y-axis driven solely by scroll
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded — skipping WebGL 3D cake.');
    return;
  }

  const container = document.querySelector('#showcase-3d-stage');
  const canvas = document.querySelector('#cake-webgl-canvas');
  const section = document.querySelector('#hero-showcase') || document.querySelector('.showcase');

  if (!container || !canvas || !section) return;

  // ─── Scene & Camera Setup ───
  const scene = new THREE.Scene();

  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);

  // Initial Top-Down viewpoint looking down at the chocolate glaze & berry crescent
  camera.position.set(0, 6.8, 0.02);
  camera.lookAt(0, 0.08, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.30;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ─── PBR Artisanal Materials (Matching User Photos 2 & 3) ───
  // 1. Liquid Dark Chocolate Ganache Drip & Mirror Glaze (Photo 2 & 3)
  const chocolateGlazeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1A0B06,
    roughness: 0.08,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    reflectivity: 0.95
  });

  // 2. Creamy Vanilla Speckled Buttercream (Photo 3)
  const buttercreamMaterial = new THREE.MeshStandardMaterial({
    color: 0xF7F3E9,
    roughness: 0.44,
    metalness: 0.02
  });

  // 3. Clean White Porcelain Cake Pedestal Stand (Photo 3)
  const porcelainStandMaterial = new THREE.MeshStandardMaterial({
    color: 0xFAF8F5,
    roughness: 0.20,
    metalness: 0.04
  });

  // 4. Piped Whipped Buttercream Rosettes (Photo 3)
  const whippedCreamMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFEFA,
    roughness: 0.28,
    metalness: 0.01
  });

  // 5. Fresh Ripe Blueberries with frosted bloom (Photo 2)
  const blueberryMaterial = new THREE.MeshStandardMaterial({
    color: 0x222A42,
    roughness: 0.36,
    metalness: 0.06
  });

  // 6. Glistening Fresh Blackberries (Photo 2)
  const blackberryMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x13070E,
    roughness: 0.12,
    metalness: 0.04,
    clearcoat: 0.90,
    clearcoatRoughness: 0.08
  });

  // 7. Vibrant Fresh Mint Leaves (Photo 2)
  const mintLeafMaterial = new THREE.MeshStandardMaterial({
    color: 0x2C6B3A,
    roughness: 0.30,
    metalness: 0.02,
    side: THREE.DoubleSide
  });

  // 8. Fine Cacao Speckles (embedded on buttercream, Photo 3)
  const cacaoSpeckleMaterial = new THREE.MeshStandardMaterial({
    color: 0x24130C,
    roughness: 0.55
  });

  // ─── Build the 3D Cake Hierarchy ───
  const cakeGroup = new THREE.Group();
  scene.add(cakeGroup);

  // ── 1. Elegant Porcelain Pedestal Cake Stand (Photo 3) ──
  const standGroup = new THREE.Group();

  // Wide beveled base foot
  const standBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.65, 1.82, 0.05, 64),
    porcelainStandMaterial
  );
  standBase.position.y = -1.22;
  standBase.receiveShadow = true;
  standGroup.add(standBase);

  // Slender architectural pedestal stem
  const standStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.30, 0.38, 0.34, 32),
    porcelainStandMaterial
  );
  standStem.position.y = -1.04;
  standStem.receiveShadow = true;
  standGroup.add(standStem);

  // Revolving top platter plate
  const standPlatter = new THREE.Mesh(
    new THREE.CylinderGeometry(2.15, 2.15, 0.045, 64),
    porcelainStandMaterial
  );
  standPlatter.position.y = -0.86;
  standPlatter.receiveShadow = true;
  standGroup.add(standPlatter);

  cakeGroup.add(standGroup);

  // ── 2. Creamy Vanilla Buttercream Body (Photo 3) ──
  const cakeRadius = 1.76;
  const cakeHeight = 1.38;
  const cakeBody = new THREE.Mesh(
    new THREE.CylinderGeometry(cakeRadius, cakeRadius, cakeHeight, 64),
    buttercreamMaterial
  );
  cakeBody.position.y = -0.17;
  cakeBody.castShadow = true;
  cakeBody.receiveShadow = true;
  cakeGroup.add(cakeBody);

  // Embedded cacao nib speckles on buttercream wall (Photo 3)
  const speckleGeo = new THREE.SphereGeometry(0.016, 6, 6);
  const speckleCount = 72;
  for (let i = 0; i < speckleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const y = -0.80 + Math.random() * 1.25;
    const speckle = new THREE.Mesh(speckleGeo, cacaoSpeckleMaterial);
    speckle.position.set(
      Math.cos(angle) * (cakeRadius + 0.005),
      y,
      Math.sin(angle) * (cakeRadius + 0.005)
    );
    cakeGroup.add(speckle);
  }

  // ── 3. Glossy Dark Chocolate Ganache Top & Cascading Drips (Photo 3) ──
  const glazeY = 0.525;

  // Liquid top glaze disc
  const glazeTop = new THREE.Mesh(
    new THREE.CylinderGeometry(cakeRadius + 0.01, cakeRadius + 0.01, 0.035, 64),
    chocolateGlazeMaterial
  );
  glazeTop.position.y = glazeY;
  glazeTop.receiveShadow = true;
  cakeGroup.add(glazeTop);

  // Rounded smooth glaze rim
  const glazeLip = new THREE.Mesh(
    new THREE.TorusGeometry(cakeRadius + 0.005, 0.028, 16, 64),
    chocolateGlazeMaterial
  );
  glazeLip.rotation.x = Math.PI / 2;
  glazeLip.position.y = glazeY;
  cakeGroup.add(glazeLip);

  // Organic Cascading Drips of varied lengths (Photo 3)
  // Pre-configured realistic drip heights around 36 radial positions
  const dripLengths = [
    0.28, 0.52, 0.18, 0.68, 0.35, 0.22, 0.58, 0.82,
    0.24, 0.44, 0.16, 0.62, 0.30, 0.72, 0.20, 0.48,
    0.34, 0.18, 0.60, 0.78, 0.26, 0.40, 0.15, 0.55,
    0.32, 0.66, 0.22, 0.46, 0.18, 0.75, 0.28, 0.50,
    0.38, 0.20, 0.64, 0.84
  ];

  const dripGroup = new THREE.Group();
  const dripCount = dripLengths.length;

  for (let i = 0; i < dripCount; i++) {
    const angle = (i / dripCount) * Math.PI * 2;
    const len = dripLengths[i];
    const r = cakeRadius + 0.008;

    // Drip tapered stem
    const stemGeo = new THREE.CylinderGeometry(0.026, 0.016, len, 10);
    const stem = new THREE.Mesh(stemGeo, chocolateGlazeMaterial);
    stem.position.set(
      Math.cos(angle) * r,
      glazeY - len / 2,
      Math.sin(angle) * r
    );
    dripGroup.add(stem);

    // Rounded droplet bead at bottom of drip
    const dropGeo = new THREE.SphereGeometry(0.032, 12, 12);
    const drop = new THREE.Mesh(dropGeo, chocolateGlazeMaterial);
    drop.scale.set(1.0, 1.35, 0.85);
    drop.position.set(
      Math.cos(angle) * r,
      glazeY - len,
      Math.sin(angle) * r
    );
    dripGroup.add(drop);
  }
  cakeGroup.add(dripGroup);

  // ── 4. Piped Whipped Buttercream Swirls (along top rim, Photo 3) ──
  const rosetteCount = 10;
  const rosetteGeo = new THREE.TorusGeometry(0.12, 0.055, 16, 24);
  const rosetteConeGeo = new THREE.ConeGeometry(0.08, 0.12, 16);

  for (let i = 0; i < rosetteCount; i++) {
    const angle = (i / rosetteCount) * Math.PI * 2;
    const r = 1.48;

    const rosette = new THREE.Mesh(rosetteGeo, whippedCreamMaterial);
    rosette.rotation.x = Math.PI / 2;
    rosette.position.set(Math.cos(angle) * r, glazeY + 0.04, Math.sin(angle) * r);
    cakeGroup.add(rosette);

    const tip = new THREE.Mesh(rosetteConeGeo, whippedCreamMaterial);
    tip.position.set(Math.cos(angle) * r, glazeY + 0.09, Math.sin(angle) * r);
    cakeGroup.add(tip);
  }

  // ── 5. Fresh Berry Crescent & Mint Leaves (Directly from Photo 2!) ──
  const berryGroup = new THREE.Group();

  // A. Fresh Blueberries (Photo 2)
  const blueberryCount = 28;
  for (let i = 0; i < blueberryCount; i++) {
    // Crescent curve angles: from -0.95*PI to +0.25*PI
    const t = i / (blueberryCount - 1);
    const angle = -Math.PI * 0.95 + t * Math.PI * 1.20;
    const r = 0.55 + Math.sin(t * Math.PI) * 0.70 + (Math.random() - 0.5) * 0.25;
    const size = 0.075 + Math.random() * 0.035;

    const bGeo = new THREE.SphereGeometry(size, 16, 16);
    const blueberry = new THREE.Mesh(bGeo, blueberryMaterial);
    blueberry.scale.set(1.0, 0.85, 1.0); // Slight natural berry flattening

    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = glazeY + size * 0.85 + (i % 2 === 0 ? 0.03 : 0);

    blueberry.position.set(x, y, z);
    blueberry.castShadow = true;
    berryGroup.add(blueberry);
  }

  // B. Glistening Blackberries (composed of clusters of tiny drupelet spheres, Photo 2)
  const blackberryCount = 10;
  const drupeletGeo = new THREE.SphereGeometry(0.024, 10, 10);

  for (let i = 0; i < blackberryCount; i++) {
    const t = (i + 0.5) / blackberryCount;
    const angle = -Math.PI * 0.90 + t * Math.PI * 1.15;
    const r = 0.65 + Math.sin(t * Math.PI) * 0.60 + (Math.random() - 0.5) * 0.18;
    const centerX = Math.cos(angle) * r;
    const centerZ = Math.sin(angle) * r;
    const centerY = glazeY + 0.08;

    const blackberry = new THREE.Group();
    // Cluster 14 micro drupelets into one blackberry
    for (let d = 0; d < 14; d++) {
      const u = Math.random() * Math.PI * 2;
      const v = (Math.random() - 0.5) * Math.PI * 0.8;
      const dR = 0.055;
      const drupelet = new THREE.Mesh(drupeletGeo, blackberryMaterial);
      drupelet.position.set(
        Math.cos(u) * Math.cos(v) * dR,
        Math.sin(v) * 0.075,
        Math.sin(u) * Math.cos(v) * dR
      );
      blackberry.add(drupelet);
    }
    blackberry.position.set(centerX, centerY, centerZ);
    blackberry.rotation.y = Math.random() * Math.PI * 2;
    blackberry.rotation.z = (Math.random() - 0.5) * 0.3;
    blackberry.castShadow = true;
    berryGroup.add(blackberry);
  }

  // C. Fresh Green Mint Leaves (Photo 2)
  const mintPositions = [
    { angle: -Math.PI * 0.80, r: 1.05, rotZ: 0.25 },
    { angle: -Math.PI * 0.50, r: 1.25, rotZ: -0.35 },
    { angle: -Math.PI * 0.20, r: 1.15, rotZ: 0.40 },
    { angle: 0.05, r: 0.85, rotZ: -0.20 },
    { angle: -Math.PI * 0.65, r: 0.45, rotZ: 0.30 },
    { angle: -Math.PI * 0.35, r: 0.50, rotZ: -0.25 }
  ];

  // Leaf shape geometry
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.quadraticCurveTo(0.08, 0.12, 0, 0.24);
  leafShape.quadraticCurveTo(-0.08, 0.12, 0, 0);

  const leafGeo = new THREE.ShapeGeometry(leafShape);

  mintPositions.forEach(pos => {
    const mintPair = new THREE.Group();

    // Leaf 1
    const leaf1 = new THREE.Mesh(leafGeo, mintLeafMaterial);
    leaf1.rotation.x = -Math.PI / 2.6;
    leaf1.rotation.z = pos.rotZ;
    mintPair.add(leaf1);

    // Leaf 2
    const leaf2 = new THREE.Mesh(leafGeo, mintLeafMaterial);
    leaf2.scale.set(0.8, 0.8, 0.8);
    leaf2.rotation.x = -Math.PI / 2.4;
    leaf2.rotation.z = pos.rotZ + 0.65;
    mintPair.add(leaf2);

    mintPair.position.set(
      Math.cos(pos.angle) * pos.r,
      glazeY + 0.07,
      Math.sin(pos.angle) * pos.r
    );
    berryGroup.add(mintPair);
  });

  cakeGroup.add(berryGroup);

  // ─── Studio Lighting (Warm, Natural & High-Contrast) ───
  // Soft warm ambient fill
  const ambientLight = new THREE.AmbientLight(0xFFF7ED, 1.8);
  scene.add(ambientLight);

  // Studio Key Light (upper-right-front)
  const keyLight = new THREE.DirectionalLight(0xFFFAF2, 2.8);
  keyLight.position.set(4.5, 9.0, 5.0);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  // Warm Bounce / Fill Light (lower-left)
  const fillLight = new THREE.DirectionalLight(0xF4E4D0, 2.2);
  fillLight.position.set(-5.0, 4.0, -3.5);
  scene.add(fillLight);

  // Overhead Warm Spotlight (creates glassy reflection on mirror glaze in top view)
  const overheadSpot = new THREE.PointLight(0xFFE0A0, 3.4, 10);
  overheadSpot.position.set(0, 4.8, 0.1);
  scene.add(overheadSpot);

  // Subtle Backlight for rim definition
  const rimLight = new THREE.DirectionalLight(0xEDE2D4, 1.8);
  rimLight.position.set(0, 3.0, -6.0);
  scene.add(rimLight);

  // ─── Full-Screen Responsive Camera Framing ───
  // The cake occupies the full screen dynamically on all resolutions
  function updateCameraFraming() {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    const aspect = width / height;
    camera.aspect = aspect;

    // Responsive FOV: expands on portrait/narrow mobile screens so cake is never cut off
    if (aspect < 1.0) {
      camera.fov = 36 / aspect;
    } else {
      camera.fov = 36;
    }

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  updateCameraFraming();

  // ─── Scroll-Driven Animation Choreography (No Cursor Drag) ───
  let scrollProgress = 0;
  let targetRotationY = 0;
  let currentRotationY = 0;

  const introOverlay = document.querySelector('#hero-3d-intro');
  const leftCards = document.querySelectorAll('.hero-showcase__column--left .showcase-box');
  const rightCards = document.querySelectorAll('.hero-showcase__column--right .showcase-box');
  const flavourTabs = document.querySelectorAll('.flavour-tab');

  function updateFlavourStep(step) {
    leftCards.forEach(c => {
      c.classList.toggle('active', c.dataset.step === String(step));
    });
    rightCards.forEach(c => {
      c.classList.toggle('active', c.dataset.step === String(step));
    });
    flavourTabs.forEach(t => {
      const active = t.dataset.step === String(step);
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
  }

  // Hook into ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        scrollProgress = self.progress;

        // Phase 1: 0.0 -> 0.25:
        // Cake occupies full screen! Camera swoops down from top-down berry view to side view.
        // Intro overlay header fades out
        if (introOverlay) {
          const introOpacity = Math.max(0, 1 - (scrollProgress / 0.18));
          introOverlay.style.opacity = introOpacity;
          introOverlay.style.pointerEvents = introOpacity < 0.1 ? 'none' : 'auto';
        }

        // Phase 2: 0.25 -> 0.88: Cake rotates full 360° circle in XZ plane
        // Floating side boxes slide in over the open full-screen stage
        if (scrollProgress < 0.25) {
          targetRotationY = 0;
          // Hide side cards while at top-down view (cake commands full screen!)
          leftCards.forEach(c => c.classList.remove('active'));
          rightCards.forEach(c => c.classList.remove('active'));
        } else if (scrollProgress <= 0.88) {
          const rotProgress = (scrollProgress - 0.25) / 0.63;
          targetRotationY = rotProgress * Math.PI * 2;

          // Update flavour info boxes as cake spins
          if (rotProgress < 0.33) {
            updateFlavourStep(1);
          } else if (rotProgress < 0.67) {
            updateFlavourStep(2);
          } else {
            updateFlavourStep(3);
          }
        } else {
          // 0.88 -> 1.00: Full 360 circle complete! Keep final position and unpin
          targetRotationY = Math.PI * 2;
          updateFlavourStep(3);
        }
      }
    });
  }

  // Tab click navigation to rotate directly to flavour
  flavourTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const step = parseInt(tab.dataset.step, 10);
      if (!step) return;

      const secRect = section.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const secTop = secRect.top + scrollTop;
      const travel = section.offsetHeight - window.innerHeight;

      // Target progress for each flavour step:
      const stepProgressMap = { 1: 0.32, 2: 0.55, 3: 0.78 };
      const targetP = stepProgressMap[step] || 0.32;

      window.scrollTo({
        top: secTop + targetP * travel,
        behavior: 'smooth'
      });
    });
  });

  // ─── Render Loop ───
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth lerp rotation following scroll progress
    currentRotationY += (targetRotationY - currentRotationY) * 0.09;
    cakeGroup.rotation.y = currentRotationY;

    // ─── Camera Swoop: Top-Down to Full Side View ───
    // At scrollProgress = 0: camera is at TOP-DOWN view (y: 6.8, z: 0.02) looking at (0, 0.08, 0)
    // As user scrolls from 0 to 0.25: camera sweeps down to side profile (y: 0.25, z: 5.8) looking at (0, -0.15, 0)
    const cameraT = Math.min(scrollProgress / 0.25, 1.0);
    const smoothT = 0.5 - 0.5 * Math.cos(cameraT * Math.PI);

    const startY = 6.8;
    const endY = 0.25;
    const currentCamY = startY + (endY - startY) * smoothT;

    const startZ = 0.02;
    const endZ = 5.8;
    const currentCamZ = startZ + (endZ - startZ) * smoothT;

    camera.position.set(0, currentCamY, currentCamZ);

    // Look target smoothly transitions from top face to center of cake
    const lookTargetY = 0.08 - smoothT * 0.23;
    camera.lookAt(0, lookTargetY, 0);

    // Subtle natural breathing motion
    cakeGroup.position.y = Math.sin(elapsedTime * 1.0) * 0.02;

    renderer.render(scene, camera);
  }

  animate();

  // ─── Window Resize Listener ───
  window.addEventListener('resize', updateCameraFraming, { passive: true });

  console.log('🎂 Cake Atelier — Full-Screen Artisanal Cake Engine Active (Photos 2 & 3)');
})();

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

  var width = container.clientWidth || window.innerWidth;
  var height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);

  // Initial Top-Down viewpoint — offset along +Z so cake sits in the
  // LOWER 60% of the screen, leaving the top 40% as clean warm ivory
  // ground where the headline text sits with zero overlap on dark cake.
  camera.position.set(0, 7.4, 0.80);
  camera.lookAt(0, 0, 0.80);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ─── PBR Artisanal Materials (Matching User Photos 2 & 3) ───

  // 1. Rich Valrhona Dark Chocolate Mirror Glaze — warm, mouth-watering,
  //    with high clearcoat for that liquid-glass editorial sheen
  var chocolateGlazeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x24120B,
    roughness: 0.12,
    metalness: 0.04,
    clearcoat: 0.95,
    clearcoatRoughness: 0.05,
    reflectivity: 0.90
  });

  // 2. Creamy Vanilla Speckled Buttercream (Photo 3)
  var buttercreamMaterial = new THREE.MeshStandardMaterial({
    color: 0xF7F3E9,
    roughness: 0.44,
    metalness: 0.02
  });

  // 3. Clean White Porcelain Cake Pedestal Stand (Photo 3)
  var porcelainStandMaterial = new THREE.MeshStandardMaterial({
    color: 0xFAF8F5,
    roughness: 0.20,
    metalness: 0.04
  });

  // 4. Fresh Ripe Blueberries with frosted bloom (Photo 2)
  var blueberryMaterial = new THREE.MeshStandardMaterial({
    color: 0x222A42,
    roughness: 0.36,
    metalness: 0.06
  });

  // 5. Glistening Fresh Blackberries (Photo 2)
  var blackberryMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x13070E,
    roughness: 0.12,
    metalness: 0.04,
    clearcoat: 0.90,
    clearcoatRoughness: 0.08
  });

  // 6. Vibrant Fresh Mint Leaves (Photo 2)
  var mintLeafMaterial = new THREE.MeshStandardMaterial({
    color: 0x2E723E,
    roughness: 0.30,
    metalness: 0.02,
    side: THREE.DoubleSide
  });

  // 7. Fine Cacao Speckles (embedded on buttercream, Photo 3)
  var cacaoSpeckleMaterial = new THREE.MeshStandardMaterial({
    color: 0x24130C,
    roughness: 0.55
  });

  // 8. Gold accent material (for gold foil flakes on top)
  var goldFoilMaterial = new THREE.MeshStandardMaterial({
    color: 0xD4A852,
    roughness: 0.18,
    metalness: 0.85,
    emissive: 0x3A2800,
    emissiveIntensity: 0.15
  });

  // ─── Build the 3D Cake Hierarchy ───
  var cakeGroup = new THREE.Group();
  scene.add(cakeGroup);

  // ── 1. Elegant Porcelain Pedestal Cake Stand (Photo 3) ──
  var standGroup = new THREE.Group();

  // Wide beveled base foot
  var standBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.65, 1.82, 0.05, 64),
    porcelainStandMaterial
  );
  standBase.position.y = -1.22;
  standBase.receiveShadow = true;
  standGroup.add(standBase);

  // Slender architectural pedestal stem
  var standStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.30, 0.38, 0.34, 32),
    porcelainStandMaterial
  );
  standStem.position.y = -1.04;
  standStem.receiveShadow = true;
  standGroup.add(standStem);

  // Revolving top platter plate
  var standPlatter = new THREE.Mesh(
    new THREE.CylinderGeometry(2.15, 2.15, 0.045, 64),
    porcelainStandMaterial
  );
  standPlatter.position.y = -0.86;
  standPlatter.receiveShadow = true;
  standGroup.add(standPlatter);

  cakeGroup.add(standGroup);

  // ── 2. Creamy Vanilla Buttercream Body (Photo 3) ──
  var cakeRadius = 1.76;
  var cakeHeight = 1.38;
  var cakeBody = new THREE.Mesh(
    new THREE.CylinderGeometry(cakeRadius, cakeRadius, cakeHeight, 64),
    buttercreamMaterial
  );
  cakeBody.position.y = -0.17;
  cakeBody.castShadow = true;
  cakeBody.receiveShadow = true;
  cakeGroup.add(cakeBody);

  // Embedded cacao nib speckles on buttercream wall (Photo 3)
  var speckleGeo = new THREE.SphereGeometry(0.016, 6, 6);
  var speckleCount = 72;
  for (var i = 0; i < speckleCount; i++) {
    var angle = Math.random() * Math.PI * 2;
    var y = -0.80 + Math.random() * 1.25;
    var speckle = new THREE.Mesh(speckleGeo, cacaoSpeckleMaterial);
    speckle.position.set(
      Math.cos(angle) * (cakeRadius + 0.005),
      y,
      Math.sin(angle) * (cakeRadius + 0.005)
    );
    cakeGroup.add(speckle);
  }

  // ── 3. Glossy Dark Chocolate Ganache Top & Cascading Drips (Photo 3) ──
  var glazeY = 0.525;

  // Liquid top glaze disc — slightly thicker for realism
  var glazeTop = new THREE.Mesh(
    new THREE.CylinderGeometry(cakeRadius + 0.01, cakeRadius + 0.01, 0.045, 64),
    chocolateGlazeMaterial
  );
  glazeTop.position.y = glazeY;
  glazeTop.receiveShadow = true;
  cakeGroup.add(glazeTop);

  // Rounded smooth glaze rim
  var glazeLip = new THREE.Mesh(
    new THREE.TorusGeometry(cakeRadius + 0.005, 0.028, 16, 64),
    chocolateGlazeMaterial
  );
  glazeLip.rotation.x = Math.PI / 2;
  glazeLip.position.y = glazeY;
  cakeGroup.add(glazeLip);

  // Organic Cascading Drips of varied lengths (Photo 3)
  var dripLengths = [
    0.28, 0.52, 0.18, 0.68, 0.35, 0.22, 0.58, 0.82,
    0.24, 0.44, 0.16, 0.62, 0.30, 0.72, 0.20, 0.48,
    0.34, 0.18, 0.60, 0.78, 0.26, 0.40, 0.15, 0.55,
    0.32, 0.66, 0.22, 0.46, 0.18, 0.75, 0.28, 0.50,
    0.38, 0.20, 0.64, 0.84
  ];

  var dripGroup = new THREE.Group();
  var dripCount = dripLengths.length;

  for (var di = 0; di < dripCount; di++) {
    var dAngle = (di / dripCount) * Math.PI * 2;
    var len = dripLengths[di];
    var r = cakeRadius + 0.008;

    // Drip tapered stem
    var stemGeo = new THREE.CylinderGeometry(0.026, 0.016, len, 10);
    var stem = new THREE.Mesh(stemGeo, chocolateGlazeMaterial);
    stem.position.set(
      Math.cos(dAngle) * r,
      glazeY - len / 2,
      Math.sin(dAngle) * r
    );
    dripGroup.add(stem);

    // Rounded droplet bead at bottom of drip
    var dropGeo = new THREE.SphereGeometry(0.032, 12, 12);
    var drop = new THREE.Mesh(dropGeo, chocolateGlazeMaterial);
    drop.scale.set(1.0, 1.35, 0.85);
    drop.position.set(
      Math.cos(dAngle) * r,
      glazeY - len,
      Math.sin(dAngle) * r
    );
    dripGroup.add(drop);
  }
  cakeGroup.add(dripGroup);

  // ══ REMOVED: 10 White Torus Rosettes ══
  // These TorusGeometry meshes flattened into harsh paper-disc circles
  // in the pure top-down camera view. Removed to match Photo 2 precisely.

  // ── 4. Fresh Berry Crescent & Mint Leaves (Directly from Photo 2!) ──
  var berryGroup = new THREE.Group();

  // A. Fresh Blueberries (Photo 2) — 36 plump berries in a dense crescent
  var blueberryCount = 36;
  for (var bi = 0; bi < blueberryCount; bi++) {
    var bt = bi / (blueberryCount - 1);
    var bAngle = -Math.PI * 0.95 + bt * Math.PI * 1.20;
    var bR = 0.50 + Math.sin(bt * Math.PI) * 0.75 + (Math.random() - 0.5) * 0.22;
    var bSize = 0.070 + Math.random() * 0.030;

    var bGeo = new THREE.SphereGeometry(bSize, 16, 16);
    var blueberry = new THREE.Mesh(bGeo, blueberryMaterial);
    blueberry.scale.set(1.0, 0.85, 1.0);

    var bx = Math.cos(bAngle) * bR;
    var bz = Math.sin(bAngle) * bR;
    var by = glazeY + bSize * 0.85 + (bi % 2 === 0 ? 0.03 : 0);

    blueberry.position.set(bx, by, bz);
    blueberry.castShadow = true;
    berryGroup.add(blueberry);
  }

  // B. Glistening Blackberries (composed of clusters of tiny drupelet spheres, Photo 2)
  var blackberryCount = 12;
  var drupeletGeo = new THREE.SphereGeometry(0.024, 10, 10);

  for (var bbi = 0; bbi < blackberryCount; bbi++) {
    var bbt = (bbi + 0.5) / blackberryCount;
    var bbAngle = -Math.PI * 0.90 + bbt * Math.PI * 1.15;
    var bbR = 0.60 + Math.sin(bbt * Math.PI) * 0.65 + (Math.random() - 0.5) * 0.18;
    var centerX = Math.cos(bbAngle) * bbR;
    var centerZ = Math.sin(bbAngle) * bbR;
    var centerY = glazeY + 0.08;

    var blackberry = new THREE.Group();
    // Cluster 16 micro drupelets into one blackberry
    for (var d = 0; d < 16; d++) {
      var u = Math.random() * Math.PI * 2;
      var v = (Math.random() - 0.5) * Math.PI * 0.8;
      var dR = 0.058;
      var drupelet = new THREE.Mesh(drupeletGeo, blackberryMaterial);
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

  // C. Fresh Green Mint Leaves (Photo 2) — 8 arched leaves
  var mintPositions = [
    { angle: -Math.PI * 0.85, r: 1.05, rotZ: 0.25 },
    { angle: -Math.PI * 0.70, r: 0.40, rotZ: -0.30 },
    { angle: -Math.PI * 0.55, r: 1.20, rotZ: -0.35 },
    { angle: -Math.PI * 0.40, r: 0.55, rotZ: 0.40 },
    { angle: -Math.PI * 0.25, r: 1.10, rotZ: 0.30 },
    { angle: -Math.PI * 0.10, r: 0.80, rotZ: -0.20 },
    { angle: 0.05, r: 0.45, rotZ: 0.35 },
    { angle: -Math.PI * 0.65, r: 0.90, rotZ: -0.25 }
  ];

  // Leaf shape geometry
  var leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.quadraticCurveTo(0.08, 0.12, 0, 0.24);
  leafShape.quadraticCurveTo(-0.08, 0.12, 0, 0);

  var leafGeo = new THREE.ShapeGeometry(leafShape);

  mintPositions.forEach(function (pos) {
    var mintPair = new THREE.Group();

    // Leaf 1
    var leaf1 = new THREE.Mesh(leafGeo, mintLeafMaterial);
    leaf1.rotation.x = -Math.PI / 2.6;
    leaf1.rotation.z = pos.rotZ;
    mintPair.add(leaf1);

    // Leaf 2
    var leaf2 = new THREE.Mesh(leafGeo, mintLeafMaterial);
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

  // D. Delicate 24K Gold Foil Flakes scattered on the glaze
  var goldFlakeGeo = new THREE.PlaneGeometry(0.045, 0.035);
  for (var gi = 0; gi < 18; gi++) {
    var gAngle = Math.random() * Math.PI * 2;
    var gR = Math.random() * 1.3;
    var flake = new THREE.Mesh(goldFlakeGeo, goldFoilMaterial);
    flake.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
    flake.rotation.z = Math.random() * Math.PI;
    flake.position.set(
      Math.cos(gAngle) * gR,
      glazeY + 0.025,
      Math.sin(gAngle) * gR
    );
    berryGroup.add(flake);
  }

  cakeGroup.add(berryGroup);

  // ─── Studio Lighting (Warm, Soft & High-Contrast — No Harsh PointLight) ───

  // Soft warm ambient fill
  var ambientLight = new THREE.AmbientLight(0xFFF6EA, 1.9);
  scene.add(ambientLight);

  // Studio Key Light — broad diagonal gleam across mirror glaze (upper-right-front)
  var keyLight = new THREE.DirectionalLight(0xFFFAF2, 2.8);
  keyLight.position.set(4.5, 9.0, 5.0);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  // Warm Bounce / Fill Light (lower-left)
  var fillLight = new THREE.DirectionalLight(0xF6E8D6, 2.2);
  fillLight.position.set(-5.0, 4.0, -3.5);
  scene.add(fillLight);

  // ══ REMOVED: overheadSpot PointLight ══
  // The PointLight(0xFFE0A0, 3.4, 10) at (0, 4.8, 0.1) created a harsh,
  // blinding yellow flashlight dot on the mirror glaze. Replaced with
  // a broad, soft top HemisphereLight for even warmth.

  // Broad soft hemisphere light — simulates studio bounce ceiling
  var hemiLight = new THREE.HemisphereLight(0xFFF8EE, 0xE8D6C0, 1.6);
  hemiLight.position.set(0, 6, 0);
  scene.add(hemiLight);

  // Subtle Backlight for rim definition
  var rimLight = new THREE.DirectionalLight(0xEDE2D4, 1.8);
  rimLight.position.set(0, 3.0, -6.0);
  scene.add(rimLight);

  // ─── Full-Screen Responsive Camera Framing ───
  function updateCameraFraming() {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    var aspect = width / height;
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
  var scrollProgress = 0;
  var targetRotationY = 0;
  var currentRotationY = 0;

  var introOverlay = document.querySelector('#hero-3d-intro');
  var leftCards = document.querySelectorAll('.hero-showcase__column--left .showcase-box');
  var rightCards = document.querySelectorAll('.hero-showcase__column--right .showcase-box');
  var flavourTabs = document.querySelectorAll('.flavour-tab');

  function updateFlavourStep(step) {
    leftCards.forEach(function (c) {
      c.classList.toggle('active', c.dataset.step === String(step));
    });
    rightCards.forEach(function (c) {
      c.classList.toggle('active', c.dataset.step === String(step));
    });
    flavourTabs.forEach(function (t) {
      var active = t.dataset.step === String(step);
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
      onUpdate: function (self) {
        scrollProgress = self.progress;

        // Phase 1: 0.0 -> 0.25:
        // Cake occupies full screen! Camera swoops down from top-down berry view to side view.
        // Intro overlay header fades out
        if (introOverlay) {
          var introOpacity = Math.max(0, 1 - (scrollProgress / 0.18));
          introOverlay.style.opacity = introOpacity;
          introOverlay.style.pointerEvents = introOpacity < 0.1 ? 'none' : 'auto';
        }

        // Phase 2: 0.25 -> 0.88: Cake rotates full 360° circle in XZ plane
        // Floating side boxes slide in over the open full-screen stage
        if (scrollProgress < 0.25) {
          targetRotationY = 0;
          // Hide side cards while at top-down view (cake commands full screen!)
          leftCards.forEach(function (c) { c.classList.remove('active'); });
          rightCards.forEach(function (c) { c.classList.remove('active'); });
        } else if (scrollProgress <= 0.88) {
          var rotProgress = (scrollProgress - 0.25) / 0.63;
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
  flavourTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var step = parseInt(tab.dataset.step, 10);
      if (!step) return;

      var secRect = section.getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var secTop = secRect.top + scrollTop;
      var travel = section.offsetHeight - window.innerHeight;

      // Target progress for each flavour step:
      var stepProgressMap = { 1: 0.32, 2: 0.55, 3: 0.78 };
      var targetP = stepProgressMap[step] || 0.32;

      window.scrollTo({
        top: secTop + targetP * travel,
        behavior: 'smooth'
      });
    });
  });

  // ─── Render Loop ───
  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    var elapsedTime = clock.getElapsedTime();

    // Smooth lerp rotation following scroll progress
    currentRotationY += (targetRotationY - currentRotationY) * 0.09;
    cakeGroup.rotation.y = currentRotationY;

    // ─── Camera Swoop: Top-Down to Full Side View ───
    // At scrollProgress = 0: camera at (0, 7.4, 0.80) looking at (0, 0, 0.80)
    //   → Cake top is centered in lower ~60% of screen, text sits in clean upper ivory space
    // At scrollProgress = 0.25: camera at (0, 0.25, 6.0) looking at (0, -0.15, 0)
    //   → Full side profile, headline has faded out

    var cameraT = Math.min(scrollProgress / 0.25, 1.0);
    var smoothT = 0.5 - 0.5 * Math.cos(cameraT * Math.PI); // ease-in-out

    // Camera Y: 7.4 → 0.25
    var currentCamY = 7.4 + (0.25 - 7.4) * smoothT;
    // Camera Z: 0.80 → 6.0
    var currentCamZ = 0.80 + (6.0 - 0.80) * smoothT;

    camera.position.set(0, currentCamY, currentCamZ);

    // Look target: (0, 0, 0.80) → (0, -0.15, 0)
    var lookY = 0 + (-0.15 - 0) * smoothT;
    var lookZ = 0.80 + (0 - 0.80) * smoothT;
    camera.lookAt(0, lookY, lookZ);

    // Subtle natural breathing motion
    cakeGroup.position.y = Math.sin(elapsedTime * 1.0) * 0.02;

    renderer.render(scene, camera);
  }

  animate();

  // ─── Window Resize Listener ───
  window.addEventListener('resize', updateCameraFraming, { passive: true });

  console.log('🎂 Cake Atelier — Full-Screen Artisanal Cake Engine Active (Photos 2 & 3)');
})();

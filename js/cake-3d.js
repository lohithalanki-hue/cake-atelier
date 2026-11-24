/* ═══════════════════════════════════════════════════════
   CAKE ATELIER — Master 3D WebGL Artisanal Cake Engine
   Photorealistic Haute Pâtisserie Recreation:
   - PBR Studio Environment Map (PMREM generated softbox reflections)
   - Real Valrhona 70% Dark Chocolate Mirror Glaze (liquid glass obsidian sheen)
   - Realistic Hand-Crafted Fruit: Oblate blueberries with dusty bloom & star calyxes,
     plump juicy blackberries with glistening micro-drupelets, and curved fresh mint leaves
   - Artisanal Hand-Frosted Vanilla Buttercream with Madagascar vanilla bean speckles
   - Perfectly Framed: Fills the screen with commanding presence, strictly contained
     without clipping or overflow ("take the full screen not more than the required space")
   - Pure High-Contrast Luminous Typography centered over the dark mirror glaze
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

  // FOV 34° provides natural food photography perspective without wide-angle distortion
  const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);

  // Initial Top-Down View: Perfectly centered directly over cake origin
  // Distance 6.4 puts the 3.44 diameter cake at ~85% viewport height
  // filling the screen cleanly with elegant breathing room
  camera.position.set(0, 6.4, 0.01);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ─── Procedural Studio Softbox Environment Map ───
  // Real food photography looks realistic because of what the glossy surfaces REFLECT.
  // We generate a custom studio environment with diffused softbox banks.
  function createStudioEnvironment(renderer) {
    var pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    var envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    var ctx = envCanvas.getContext('2d');

    // Studio wall ambient gradient (soft warm ivory ceiling to deep shadow floor)
    var bgGrad = ctx.createLinearGradient(0, 0, 0, envCanvas.height);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(0.35, '#EBE3D8');
    bgGrad.addColorStop(0.7, '#241B16');
    bgGrad.addColorStop(1, '#0D0806');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, envCanvas.width, envCanvas.height);

    // Softbox 1: Main Overhead Key Bank (large diffused rectangular softbox)
    var keyGrad = ctx.createRadialGradient(700, 140, 15, 700, 140, 260);
    keyGrad.addColorStop(0, 'rgba(255, 252, 245, 1.0)');
    keyGrad.addColorStop(0.4, 'rgba(255, 244, 228, 0.85)');
    keyGrad.addColorStop(0.8, 'rgba(255, 238, 218, 0.35)');
    keyGrad.addColorStop(1, 'rgba(255, 238, 218, 0.0)');
    ctx.fillStyle = keyGrad;
    ctx.beginPath();
    ctx.arc(700, 140, 260, 0, Math.PI * 2);
    ctx.fill();

    // Softbox 2: Broad Fill Window (soft diffused left illumination)
    var fillGrad = ctx.createRadialGradient(280, 160, 20, 280, 160, 220);
    fillGrad.addColorStop(0, 'rgba(245, 248, 255, 0.75)');
    fillGrad.addColorStop(0.5, 'rgba(230, 238, 252, 0.40)');
    fillGrad.addColorStop(1, 'rgba(230, 238, 252, 0.0)');
    ctx.fillStyle = fillGrad;
    ctx.beginPath();
    ctx.arc(280, 160, 220, 0, Math.PI * 2);
    ctx.fill();

    // Subtle Rim Light Bank (back highlight for edges)
    var rimGrad = ctx.createLinearGradient(0, 0, envCanvas.width, 0);
    rimGrad.addColorStop(0.45, 'rgba(255, 240, 225, 0)');
    rimGrad.addColorStop(0.50, 'rgba(255, 248, 235, 0.6)');
    rimGrad.addColorStop(0.55, 'rgba(255, 240, 225, 0)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(0, 20, envCanvas.width, 100);

    var envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    var envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    pmremGenerator.dispose();
    envTexture.dispose();
    return envMap;
  }

  scene.environment = createStudioEnvironment(renderer);

  // ─── Procedural Artisanal Textures ───

  // 1. Madagascar Vanilla Bean Buttercream Texture
  function createButtercreamTexture() {
    var c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    var ctx = c.getContext('2d');

    // Base warm vanilla cream
    ctx.fillStyle = '#F8F4EC';
    ctx.fillRect(0, 0, c.width, c.height);

    // Subtle horizontal artisanal spatula texture
    for (var y = 0; y < c.height; y += 4) {
      var wave = Math.sin(y * 0.04) * 8;
      ctx.fillStyle = (y % 8 === 0) ? 'rgba(255, 255, 255, 0.25)' : 'rgba(238, 230, 218, 0.22)';
      ctx.fillRect(0, y + wave, c.width, 3);
    }

    // Crushed real Bourbon vanilla bean caviar speckles
    var speckleCount = 420;
    for (var i = 0; i < speckleCount; i++) {
      var sx = Math.random() * c.width;
      var sy = Math.random() * c.height;
      var sr = 0.8 + Math.random() * 2.2;
      var alpha = 0.45 + Math.random() * 0.50;
      ctx.fillStyle = 'rgba(38, 21, 14, ' + alpha + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(2, 1);
    return tex;
  }

  // 2. Realistic Chocolate Glaze Normal Texture (micro surface tension)
  function createGlazeTexture() {
    var c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    var ctx = c.getContext('2d');

    // Deep obsidian cacao base with soft radial gradient
    var rad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    rad.addColorStop(0, '#1E0E08');
    rad.addColorStop(0.7, '#150804');
    rad.addColorStop(1, '#0D0402');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle liquid swirl flow
    for (var r = 30; r < 240; r += 24) {
      ctx.strokeStyle = 'rgba(48, 26, 16, 0.12)';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(256, 256, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    var tex = new THREE.CanvasTexture(c);
    return tex;
  }

  var buttercreamTexture = createButtercreamTexture();
  var glazeTexture = createGlazeTexture();

  // ─── PBR Artisanal Materials ───

  // 1. Authentic Valrhona 70% Guanaja Mirror Glaze
  //    Deep obsidian dark chocolate — NOT muddy orange brown, NO fake glow.
  //    Liquid-glass mirror finish that catches softbox highlights with clarity.
  var chocolateGlazeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x140704,
    map: glazeTexture,
    roughness: 0.05,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    reflectivity: 0.96,
    sheen: 0.25,
    sheenColor: new THREE.Color(0x35190E)
  });

  // 2. Vanilla Bean Buttercream
  var buttercreamMaterial = new THREE.MeshStandardMaterial({
    color: 0xF7F3EA,
    map: buttercreamTexture,
    roughness: 0.48,
    metalness: 0.01
  });

  // 3. Fine French Porcelain Pedestal Stand
  var porcelainStandMaterial = new THREE.MeshStandardMaterial({
    color: 0xFCFAF7,
    roughness: 0.16,
    metalness: 0.02
  });

  // 4. Wild Blueberries with Dusty Frosted Bloom
  var blueberryMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1E243A,
    roughness: 0.52,
    metalness: 0.02,
    clearcoat: 0.35,
    clearcoatRoughness: 0.35
  });

  // Dark calyx center for blueberry crown
  var calyxMaterial = new THREE.MeshStandardMaterial({
    color: 0x10131F,
    roughness: 0.70
  });

  // 5. Glistening Blackberries (glossy juicy micro-drupelets)
  var blackberryMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0A0206,
    roughness: 0.07,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03
  });

  // 6. Fresh Garden Mint (curled leaves with realistic satin sheen)
  var mintLeafMaterial = new THREE.MeshStandardMaterial({
    color: 0x2A6F3A,
    roughness: 0.28,
    metalness: 0.0,
    side: THREE.DoubleSide
  });

  // ─── Build the 3D Cake Hierarchy ───
  var cakeGroup = new THREE.Group();
  scene.add(cakeGroup);

  // Exact Cake Dimensions — calibrated so cake takes ~85% of screen height
  var cakeRadius = 1.72;
  var cakeHeight = 1.36;
  var glazeY = 0.52;

  // ── 1. Elegant Porcelain Pedestal Cake Stand ──
  var standGroup = new THREE.Group();

  // Wide beveled base foot
  var standBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.68, 1.88, 0.055, 64),
    porcelainStandMaterial
  );
  standBase.position.y = -1.24;
  standBase.receiveShadow = true;
  standGroup.add(standBase);

  // Base decorative stepped ring
  var standBaseRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.65, 0.03, 16, 64),
    porcelainStandMaterial
  );
  standBaseRing.rotation.x = Math.PI / 2;
  standBaseRing.position.y = -1.21;
  standGroup.add(standBaseRing);

  // Slender architectural pedestal stem
  var standStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.42, 0.36, 32),
    porcelainStandMaterial
  );
  standStem.position.y = -1.04;
  standStem.receiveShadow = true;
  standGroup.add(standStem);

  // Revolving top platter plate
  var standPlatter = new THREE.Mesh(
    new THREE.CylinderGeometry(2.18, 2.18, 0.048, 64),
    porcelainStandMaterial
  );
  standPlatter.position.y = -0.85;
  standPlatter.receiveShadow = true;
  standGroup.add(standPlatter);

  cakeGroup.add(standGroup);

  // ── 2. Vanilla Bean Buttercream Body ──
  var cakeBody = new THREE.Mesh(
    new THREE.CylinderGeometry(cakeRadius, cakeRadius, cakeHeight, 64),
    buttercreamMaterial
  );
  cakeBody.position.y = -0.16;
  cakeBody.castShadow = true;
  cakeBody.receiveShadow = true;
  cakeGroup.add(cakeBody);

  // ── 3. Glossy Dark Chocolate Ganache Top & Organic Drips ──

  // Mirror Glaze Top Disc
  var glazeTop = new THREE.Mesh(
    new THREE.CylinderGeometry(cakeRadius + 0.015, cakeRadius + 0.015, 0.042, 64),
    chocolateGlazeMaterial
  );
  glazeTop.position.y = glazeY;
  glazeTop.receiveShadow = true;
  cakeGroup.add(glazeTop);

  // Rounded smooth glaze rim (realistic liquid surface meniscus)
  var glazeLip = new THREE.Mesh(
    new THREE.TorusGeometry(cakeRadius + 0.01, 0.032, 16, 64),
    chocolateGlazeMaterial
  );
  glazeLip.rotation.x = Math.PI / 2;
  glazeLip.position.y = glazeY;
  cakeGroup.add(glazeLip);

  // Organic Cascading Drips of varied heights (Photo 3)
  var dripLengths = [
    0.32, 0.58, 0.18, 0.72, 0.38, 0.24, 0.62, 0.88,
    0.26, 0.48, 0.16, 0.68, 0.34, 0.76, 0.22, 0.52,
    0.36, 0.18, 0.64, 0.82, 0.28, 0.44, 0.15, 0.58,
    0.34, 0.70, 0.24, 0.48, 0.20, 0.78, 0.30, 0.54,
    0.40, 0.22, 0.66, 0.86
  ];

  var dripGroup = new THREE.Group();
  var dripCount = dripLengths.length;

  for (var di = 0; di < dripCount; di++) {
    var dAngle = (di / dripCount) * Math.PI * 2;
    var len = dripLengths[di];
    var r = cakeRadius + 0.009;

    // Organic tapered stem
    var stemGeo = new THREE.CylinderGeometry(0.028, 0.017, len, 12);
    var stem = new THREE.Mesh(stemGeo, chocolateGlazeMaterial);
    stem.position.set(
      Math.cos(dAngle) * r,
      glazeY - len / 2,
      Math.sin(dAngle) * r
    );
    dripGroup.add(stem);

    // Natural teardrop bottom bead
    var dropGeo = new THREE.SphereGeometry(0.034, 12, 12);
    var drop = new THREE.Mesh(dropGeo, chocolateGlazeMaterial);
    drop.scale.set(1.0, 1.30, 0.90);
    drop.position.set(
      Math.cos(dAngle) * r,
      glazeY - len,
      Math.sin(dAngle) * r
    );
    dripGroup.add(drop);
  }
  cakeGroup.add(dripGroup);

  // ── 4. Realistic Wild Forest Berry Crown (Photo 2) ──
  // Placed in an elegant crescent along the upper rim (angles -0.90π to +0.22π, r = 1.25 to 1.68)
  // leaving the central area (r < 1.15) open for pristine mirror glaze and centered typography!
  var berryGroup = new THREE.Group();

  // Helper: Build a realistic blueberry with indented 5-point star calyx crown
  function createRealisticBlueberry(size) {
    var bGroup = new THREE.Group();

    // Oblate flattened sphere
    var bGeo = new THREE.SphereGeometry(size, 16, 14);
    var bMesh = new THREE.Mesh(bGeo, blueberryMaterial);
    bMesh.scale.set(1.0, 0.84, 1.0);
    bMesh.castShadow = true;
    bGroup.add(bMesh);

    // Calyx indentation ring on top
    var calyxRing = new THREE.Mesh(
      new THREE.TorusGeometry(size * 0.32, size * 0.07, 8, 10),
      calyxMaterial
    );
    calyxRing.rotation.x = Math.PI / 2;
    calyxRing.position.y = size * 0.78;
    bGroup.add(calyxRing);

    return bGroup;
  }

  // A. 40 Plump Blueberries stacked in natural mounds
  var blueberryCount = 40;
  for (var bi = 0; bi < blueberryCount; bi++) {
    var bt = bi / (blueberryCount - 1);
    // Upper crescent from 9 o'clock to 2 o'clock
    var bAngle = -Math.PI * 0.92 + bt * Math.PI * 1.18;
    var bR = 1.28 + Math.sin(bt * Math.PI) * 0.36 + (Math.random() - 0.5) * 0.16;
    var bSize = 0.075 + Math.random() * 0.035;

    var bb = createRealisticBlueberry(bSize);
    var bx = Math.cos(bAngle) * bR;
    var bz = Math.sin(bAngle) * bR;
    // Layering: alternate between base berries and elevated top berries
    var isStacked = (bi % 3 === 0);
    var by = glazeY + bSize * 0.80 + (isStacked ? 0.045 : 0.005);

    bb.position.set(bx, by, bz);
    bb.rotation.x = (Math.random() - 0.5) * 0.4;
    bb.rotation.z = (Math.random() - 0.5) * 0.4;
    berryGroup.add(bb);
  }

  // B. 12 Ripe Juicy Blackberries (clusters of 22 glossy micro-drupelets)
  var blackberryCount = 12;
  var drupeletGeo = new THREE.SphereGeometry(0.025, 10, 10);

  for (var bbi = 0; bbi < blackberryCount; bbi++) {
    var bbt = (bbi + 0.5) / blackberryCount;
    var bbAngle = -Math.PI * 0.88 + bbt * Math.PI * 1.12;
    var bbR = 1.35 + Math.sin(bbt * Math.PI) * 0.28 + (Math.random() - 0.5) * 0.14;

    var blackberry = new THREE.Group();
    // 22 drupelets packed tightly around an ovoid fruit core
    for (var d = 0; d < 22; d++) {
      var du = (d / 22) * Math.PI * 4;
      var dv = ((d / 22) - 0.5) * Math.PI * 0.85;
      var dRad = 0.058;
      var drupelet = new THREE.Mesh(drupeletGeo, blackberryMaterial);
      drupelet.position.set(
        Math.cos(du) * Math.cos(dv) * dRad,
        Math.sin(dv) * 0.082,
        Math.sin(du) * Math.cos(dv) * dRad
      );
      blackberry.add(drupelet);
    }

    var bbx = Math.cos(bbAngle) * bbR;
    var bbz = Math.sin(bbAngle) * bbR;
    var bby = glazeY + 0.085;

    blackberry.position.set(bbx, bby, bbz);
    blackberry.rotation.y = Math.random() * Math.PI * 2;
    blackberry.rotation.z = (Math.random() - 0.5) * 0.35;
    blackberry.castShadow = true;
    berryGroup.add(blackberry);
  }

  // C. Fresh Curved Mint Leaves (Photo 2)
  var mintConfigs = [
    { angle: -Math.PI * 0.85, r: 1.55, rotZ: 0.35, rotX: -0.85 },
    { angle: -Math.PI * 0.68, r: 1.22, rotZ: -0.40, rotX: -0.90 },
    { angle: -Math.PI * 0.52, r: 1.62, rotZ: 0.25, rotX: -0.80 },
    { angle: -Math.PI * 0.36, r: 1.30, rotZ: -0.30, rotX: -0.95 },
    { angle: -Math.PI * 0.20, r: 1.56, rotZ: 0.45, rotX: -0.85 },
    { angle: 0.02, r: 1.34, rotZ: -0.20, rotX: -0.90 }
  ];

  // Natural leaf shape with center crease
  var leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.quadraticCurveTo(0.08, 0.10, 0, 0.22);
  leafShape.quadraticCurveTo(-0.08, 0.10, 0, 0);
  var leafGeo = new THREE.ShapeGeometry(leafShape);

  mintConfigs.forEach(function (cfg) {
    var sprig = new THREE.Group();

    // Leaf 1
    var l1 = new THREE.Mesh(leafGeo, mintLeafMaterial);
    l1.rotation.x = cfg.rotX;
    l1.rotation.z = cfg.rotZ;
    sprig.add(l1);

    // Leaf 2
    var l2 = new THREE.Mesh(leafGeo, mintLeafMaterial);
    l2.scale.set(0.75, 0.75, 0.75);
    l2.rotation.x = cfg.rotX + 0.15;
    l2.rotation.z = cfg.rotZ + 0.75;
    sprig.add(l2);

    sprig.position.set(
      Math.cos(cfg.angle) * cfg.r,
      glazeY + 0.065,
      Math.sin(cfg.angle) * cfg.r
    );
    berryGroup.add(sprig);
  });

  cakeGroup.add(berryGroup);

  // ─── Studio Direct Lighting ───

  // Soft warm ambient base
  var ambientLight = new THREE.AmbientLight(0xFFF7F0, 1.6);
  scene.add(ambientLight);

  // Studio Key Light (diffused softbox angle from upper right)
  var keyLight = new THREE.DirectionalLight(0xFFFAF2, 2.2);
  keyLight.position.set(4.0, 8.5, 4.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  // Soft Fill Light (gentle warm bounce from left)
  var fillLight = new THREE.DirectionalLight(0xF4EADA, 1.4);
  fillLight.position.set(-4.5, 5.5, 2.5);
  scene.add(fillLight);

  // Top Diffused Soft Light (soft overhead illumination, no harsh pinpoint)
  var topSoft = new THREE.DirectionalLight(0xFFF6EC, 1.6);
  topSoft.position.set(0, 9.0, 0.5);
  scene.add(topSoft);

  // Rim Definition Light
  var rimLight = new THREE.DirectionalLight(0xEDE4D8, 1.5);
  rimLight.position.set(0, 3.5, -5.5);
  scene.add(rimLight);

  // ─── Responsive Camera Framing ───
  // Strictly guarantees the cake occupies ~85% of screen height (or width on mobile)
  // so it takes the full screen without overflowing or clipping!
  function updateCameraFraming() {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    var aspect = width / height;
    camera.aspect = aspect;

    if (aspect < 1.0) {
      // Mobile / portrait: scale FOV so cake width is comfortably contained
      camera.fov = 34 / aspect;
    } else {
      // Desktop / landscape: standard FOV ensures diameter takes ~85% height
      camera.fov = 34;
    }

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  updateCameraFraming();

  // ─── Scroll-Driven Animation Choreography ───
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
        // Top-down berry crown view sweeps down to full side profile.
        // Intro overlay header fades out smoothly.
        if (introOverlay) {
          var introOpacity = Math.max(0, 1 - (scrollProgress / 0.16));
          introOverlay.style.opacity = introOpacity;
          introOverlay.style.pointerEvents = introOpacity < 0.1 ? 'none' : 'auto';
        }

        // Phase 2: 0.25 -> 0.88: Cake rotates full 360° circle in XZ plane
        if (scrollProgress < 0.25) {
          targetRotationY = 0;
          leftCards.forEach(function (c) { c.classList.remove('active'); });
          rightCards.forEach(function (c) { c.classList.remove('active'); });
        } else if (scrollProgress <= 0.88) {
          var rotProgress = (scrollProgress - 0.25) / 0.63;
          targetRotationY = rotProgress * Math.PI * 2;

          if (rotProgress < 0.33) {
            updateFlavourStep(1);
          } else if (rotProgress < 0.67) {
            updateFlavourStep(2);
          } else {
            updateFlavourStep(3);
          }
        } else {
          targetRotationY = Math.PI * 2;
          updateFlavourStep(3);
        }
      }
    });
  }

  // Tab click navigation
  flavourTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var step = parseInt(tab.dataset.step, 10);
      if (!step) return;

      var secRect = section.getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var secTop = secRect.top + scrollTop;
      var travel = section.offsetHeight - window.innerHeight;

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

    // ─── Camera Swoop: Top-Down to Full Side Profile ───
    // At scrollProgress = 0: Camera is at (0, 6.4, 0.01) looking at (0, 0, 0)
    //   → Cake is DEAD CENTER, circular face occupies ~85% viewport height
    // At scrollProgress = 0.25: Camera at (0, 0.30, 5.8) looking at (0, -0.15, 0)
    //   → Full eye-level side profile on porcelain pedestal stand
    var cameraT = Math.min(scrollProgress / 0.25, 1.0);
    var smoothT = 0.5 - 0.5 * Math.cos(cameraT * Math.PI); // ease-in-out

    var currentCamY = 6.4 + (0.30 - 6.4) * smoothT;
    var currentCamZ = 0.01 + (5.8 - 0.01) * smoothT;
    camera.position.set(0, currentCamY, currentCamZ);

    var lookY = 0 + (-0.15 - 0) * smoothT;
    camera.lookAt(0, lookY, 0);

    // Subtle natural breathing float
    cakeGroup.position.y = Math.sin(elapsedTime * 1.0) * 0.018;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', updateCameraFraming, { passive: true });

  console.log('🎂 Cake Atelier — Photorealistic 3D Artisanal Cake Engine Active');
})();

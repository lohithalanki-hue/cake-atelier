/* ═══════════════════════════════════════════════════════
   CAKE ATELIER — True 3D WebGL Cake Engine (Three.js)
   Top-down to side-view camera choreography + XZ spin on scroll
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded — skipping WebGL 3D cake.');
    return;
  }

  const container = document.querySelector('#showcase-3d-stage');
  const canvas = document.querySelector('#cake-webgl-canvas');
  const showcase = document.querySelector('.showcase');

  if (!container || !canvas || !showcase) return;

  // ─── Three.js Scene Setup ───
  const scene = new THREE.Scene();

  const width = container.clientWidth || 440;
  const height = container.clientHeight || 440;

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  // Start from top-down perspective looking straight down at the top of the cake
  camera.position.set(0, 7.8, 0.6);
  camera.lookAt(0, 1.2, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ─── Luxury Materials ───
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xF3C969,
    metalness: 0.92,
    roughness: 0.18
  });

  const darkGanacheMaterial = new THREE.MeshStandardMaterial({
    color: 0x22130E,
    roughness: 0.14,
    metalness: 0.22
  });

  const mirrorGlazeMaterial = new THREE.MeshStandardMaterial({
    color: 0x1A0F0B,
    roughness: 0.05,
    metalness: 0.35
  });

  const vanillaFondantMaterial = new THREE.MeshStandardMaterial({
    color: 0xF4ECE1,
    roughness: 0.28,
    metalness: 0.06
  });

  const caramelDripMaterial = new THREE.MeshStandardMaterial({
    color: 0xB8834E,
    roughness: 0.12,
    metalness: 0.28
  });

  const brassPedestalMaterial = new THREE.MeshStandardMaterial({
    color: 0x8E7558,
    roughness: 0.25,
    metalness: 0.88
  });

  const marbleMaterial = new THREE.MeshStandardMaterial({
    color: 0xE8DFD5,
    roughness: 0.35,
    metalness: 0.05
  });

  const berryMaterial = new THREE.MeshStandardMaterial({
    color: 0x4B1220,
    roughness: 0.2,
    metalness: 0.12
  });

  const petalMaterial = new THREE.MeshStandardMaterial({
    color: 0xE5B887,
    roughness: 0.4,
    metalness: 0.15,
    side: THREE.DoubleSide
  });

  // ─── Cake & Pedestal Hierarchy ───
  const cakeGroup = new THREE.Group();
  scene.add(cakeGroup);

  // 1. Pedestal / Stand
  const pedestalGroup = new THREE.Group();

  const basePlate = new THREE.Mesh(
    new THREE.CylinderGeometry(2.35, 2.5, 0.14, 64),
    brassPedestalMaterial
  );
  basePlate.position.y = -1.45;
  basePlate.receiveShadow = true;
  pedestalGroup.add(basePlate);

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.52, 0.65, 32),
    brassPedestalMaterial
  );
  stem.position.y = -1.1;
  pedestalGroup.add(stem);

  const topPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(2.3, 2.3, 0.1, 64),
    brassPedestalMaterial
  );
  topPlate.position.y = -0.73;
  pedestalGroup.add(topPlate);

  const marbleDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.2, 0.04, 64),
    marbleMaterial
  );
  marbleDisc.position.y = -0.67;
  marbleDisc.receiveShadow = true;
  pedestalGroup.add(marbleDisc);

  cakeGroup.add(pedestalGroup);

  // 2. Bottom Tier (Dark Valrhona Ganache)
  const tier1Mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(1.9, 1.9, 0.95, 64),
    darkGanacheMaterial
  );
  tier1Mesh.position.y = -0.18;
  tier1Mesh.castShadow = true;
  tier1Mesh.receiveShadow = true;
  cakeGroup.add(tier1Mesh);

  // Piped cream pearls around Tier 1 base
  const pearlGeo = new THREE.SphereGeometry(0.065, 16, 16);
  const pearlCount1 = 36;
  for (let i = 0; i < pearlCount1; i++) {
    const angle = (i / pearlCount1) * Math.PI * 2;
    const pearl = new THREE.Mesh(pearlGeo, vanillaFondantMaterial);
    pearl.position.set(Math.cos(angle) * 1.9, -0.62, Math.sin(angle) * 1.9);
    cakeGroup.add(pearl);
  }

  // 3. Middle Tier (Tahitian Vanilla Fondant with Gold Inlay)
  const tier2Mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.4, 0.85, 64),
    vanillaFondantMaterial
  );
  tier2Mesh.position.y = 0.68;
  tier2Mesh.castShadow = true;
  tier2Mesh.receiveShadow = true;
  cakeGroup.add(tier2Mesh);

  // Gold inlay ribbon between Tier 1 and Tier 2
  const goldBand = new THREE.Mesh(
    new THREE.CylinderGeometry(1.42, 1.42, 0.05, 64),
    goldMaterial
  );
  goldBand.position.y = 0.28;
  cakeGroup.add(goldBand);

  // Caramel drip accent ring at top of Tier 2
  const caramelDrip = new THREE.Mesh(
    new THREE.TorusGeometry(1.39, 0.045, 16, 64),
    caramelDripMaterial
  );
  caramelDrip.rotation.x = Math.PI / 2;
  caramelDrip.position.y = 1.08;
  cakeGroup.add(caramelDrip);

  // 4. Top Tier (Valrhona Mirror Glaze)
  const tier3Mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.96, 0.96, 0.75, 64),
    darkGanacheMaterial
  );
  tier3Mesh.position.y = 1.48;
  tier3Mesh.castShadow = true;
  tier3Mesh.receiveShadow = true;
  cakeGroup.add(tier3Mesh);

  // High-gloss mirror glaze cap on top tier
  const mirrorCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.965, 0.965, 0.04, 64),
    mirrorGlazeMaterial
  );
  mirrorCap.position.y = 1.86;
  cakeGroup.add(mirrorCap);

  // 5. Crown Ornaments (SPECTACULAR FROM TOP-DOWN VIEW)
  const crownGroup = new THREE.Group();
  crownGroup.position.y = 1.88;

  // Sculpted chocolate sails / shards
  const sailGeo = new THREE.BoxGeometry(0.025, 0.72, 0.42);
  const sailAngles = [0, 48, 96, 150, 215, 280];
  sailAngles.forEach((deg, i) => {
    const rad = (deg * Math.PI) / 180;
    const sail = new THREE.Mesh(sailGeo, darkGanacheMaterial);
    sail.position.set(Math.cos(rad) * 0.28, 0.32, Math.sin(rad) * 0.28);
    sail.rotation.y = rad + 0.3;
    sail.rotation.z = (Math.PI / 18) * ((i % 2 === 0) ? 1 : -1);
    sail.rotation.x = (Math.PI / 24) * ((i % 3 === 0) ? 1 : -1);
    sail.castShadow = true;
    crownGroup.add(sail);

    // Gold tip on every second sail
    if (i % 2 === 0) {
      const goldTip = new THREE.Mesh(
        new THREE.BoxGeometry(0.028, 0.15, 0.43),
        goldMaterial
      );
      goldTip.position.set(Math.cos(rad) * 0.28, 0.6, Math.sin(rad) * 0.28);
      goldTip.rotation.copy(sail.rotation);
      crownGroup.add(goldTip);
    }
  });

  // Ring of berries and cocoa truffles on top
  const berryCount = 9;
  for (let i = 0; i < berryCount; i++) {
    const angle = (i / berryCount) * Math.PI * 2;
    const isBerry = i % 2 === 0;
    const garnish = new THREE.Mesh(
      new THREE.SphereGeometry(isBerry ? 0.09 : 0.075, 16, 16),
      isBerry ? berryMaterial : darkGanacheMaterial
    );
    const radDist = 0.62 + (i % 3) * 0.08;
    garnish.position.set(Math.cos(angle) * radDist, 0.08, Math.sin(angle) * radDist);
    garnish.castShadow = true;
    crownGroup.add(garnish);
  }

  // 24K Gold Leaf Flakes on the top mirror glaze
  const flakeGeo = new THREE.CircleGeometry(0.07, 6);
  const flakeCount = 14;
  for (let i = 0; i < flakeCount; i++) {
    const angle = (i / flakeCount) * Math.PI * 2 + (i * 0.3);
    const r = 0.35 + (i % 4) * 0.12;
    const flake = new THREE.Mesh(flakeGeo, goldMaterial);
    flake.rotation.x = -Math.PI / 2;
    flake.rotation.z = i * 0.8;
    flake.position.set(Math.cos(angle) * r, 0.015, Math.sin(angle) * r);
    crownGroup.add(flake);
  }

  cakeGroup.add(crownGroup);

  // 6. Floating Gold & Botanical Particles
  const particleGroup = new THREE.Group();
  const particleCount = 28;
  const particleGeo = new THREE.OctahedronGeometry(0.045, 0);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const pMesh = new THREE.Mesh(
      particleGeo,
      i % 2 === 0 ? goldMaterial : petalMaterial
    );
    const radius = 2.4 + Math.random() * 1.4;
    const angle = Math.random() * Math.PI * 2;
    const y = -0.8 + Math.random() * 3.2;

    pMesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    pMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    particleGroup.add(pMesh);
    particles.push({
      mesh: pMesh,
      baseAngle: angle,
      radius: radius,
      speed: 0.2 + Math.random() * 0.4,
      yOffset: y,
      bobSpeed: 1 + Math.random() * 2
    });
  }
  cakeGroup.add(particleGroup);

  // ─── Studio Lighting ───
  const ambientLight = new THREE.AmbientLight(0xFFF4E5, 1.3);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xFFF8EB, 2.8);
  keyLight.position.set(4.5, 9.0, 5.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xE5D5C2, 1.2);
  fillLight.position.set(-5.0, 3.5, -4.5);
  scene.add(fillLight);

  // Overhead point light for dramatic top-down specular reflection on gold & mirror glaze
  const topGlint = new THREE.PointLight(0xFFE4A0, 2.2, 8);
  topGlint.position.set(0, 3.8, 0.4);
  scene.add(topGlint);

  // ─── Camera Choreography & Scroll Tracking ───
  // Initial viewpoint: top-down aerial view looking at top of cake
  // As user scrolls: camera moves down to eye-level side view showing the layers & tiers
  // As user continues scrolling: cake spins in XZ plane along vertical Y axis, and info updates!

  let scrollProgress = 0;
  let targetRotationY = 0;
  let currentRotationY = 0;
  let dragDeltaX = 0;
  let mouseTiltX = 0;
  let mouseTiltY = 0;
  let isDragging = false;
  let dragStartX = 0;

  const leftCards = document.querySelectorAll('.showcase__column--left .showcase__card');
  const rightCards = document.querySelectorAll('.showcase__column--right .showcase__card');
  const progressTabs = document.querySelectorAll('.progress-tab');

  function updateActiveChapter(chapter) {
    leftCards.forEach(c => {
      c.classList.toggle('active', c.dataset.chapter === String(chapter));
    });
    rightCards.forEach(c => {
      c.classList.toggle('active', c.dataset.chapter === String(chapter));
    });
    progressTabs.forEach(t => {
      const active = t.dataset.step === String(chapter);
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
  }

  // Hook into GSAP ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined' && window.innerWidth > 1024) {
    ScrollTrigger.create({
      trigger: showcase,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        scrollProgress = self.progress;

        // Rotation along vertical axis (Y-axis) in XZ direction
        // As you scroll down, cake spins continuously:
        targetRotationY = scrollProgress * Math.PI * 4;

        // Chapter state for side text cards:
        if (scrollProgress < 0.33) {
          updateActiveChapter(1);
        } else if (scrollProgress < 0.67) {
          updateActiveChapter(2);
        } else {
          updateActiveChapter(3);
        }
      }
    });
  }

  // ─── Interactive Mouse Drag & Parallax ───
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    container.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const delta = (e.clientX - dragStartX) * 0.012;
      dragDeltaX += delta;
      dragStartX = e.clientX;
    } else {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      mouseTiltX = nx * 0.35;
      mouseTiltY = -ny * 0.25;
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      container.style.cursor = 'grab';
    }
  });

  // Touch support for drag
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      dragStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const delta = (e.touches[0].clientX - dragStartX) * 0.012;
      dragDeltaX += delta;
      dragStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Progress tab clicks
  progressTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const step = parseInt(tab.dataset.step, 10);
      if (!step) return;

      const showcaseRect = showcase.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const showcaseTop = showcaseRect.top + scrollTop;
      const scrollDistance = showcase.offsetHeight - window.innerHeight;

      const targetP = (step - 1) / 2;
      window.scrollTo({
        top: showcaseTop + targetP * scrollDistance,
        behavior: 'smooth'
      });
    });
  });

  // ─── Animation Render Loop ───
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth lerp for rotation
    currentRotationY += (targetRotationY + dragDeltaX - currentRotationY) * 0.08;
    cakeGroup.rotation.y = currentRotationY;

    // Decay manual drag back towards scroll angle slowly
    if (!isDragging) {
      dragDeltaX *= 0.95;
    }

    // ─── Camera Choreography ───
    // Camera transitions from top-down to side profile based on scroll progress:
    // When progress = 0: camera is at top view (y: 7.8, z: 0.6)
    // When progress >= 0.28: camera descends down to side view (y: 1.6, z: 6.2)
    const cameraT = Math.min(scrollProgress / 0.28, 1.0);
    // Smooth cosine interpolation
    const smoothT = 0.5 - 0.5 * Math.cos(cameraT * Math.PI);

    const startY = 7.8;
    const endY = 1.6 + Math.sin(scrollProgress * Math.PI) * 0.2;
    const currentCamY = startY + (endY - startY) * smoothT + mouseTiltY;

    const startZ = 0.6;
    const endZ = 6.2 - Math.sin(scrollProgress * Math.PI * 2) * 0.2;
    const currentCamZ = startZ + (endZ - startZ) * smoothT;

    const currentCamX = Math.sin(mouseTiltX) * 1.5;

    camera.position.set(currentCamX, currentCamY, currentCamZ);

    // Look target transitions from top surface (y: 1.6) to center of cake (y: 0.4)
    const lookTargetY = 1.6 - smoothT * 1.1;
    camera.lookAt(0, lookTargetY, 0);

    // Subtle cake floating breath
    cakeGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.04;

    // Orbit and bob floating gold & botanical particles
    particles.forEach((p, idx) => {
      const curAngle = p.baseAngle + elapsedTime * (p.speed * 0.3) + currentRotationY * 0.2;
      p.mesh.position.x = Math.cos(curAngle) * p.radius;
      p.mesh.position.z = Math.sin(curAngle) * p.radius;
      p.mesh.position.y = p.yOffset + Math.sin(elapsedTime * p.bobSpeed + idx) * 0.12;
      p.mesh.rotation.y += 0.015;
      p.mesh.rotation.x += 0.01;
    });

    renderer.render(scene, camera);
  }

  animate();

  // ─── Resize Handling ───
  function handleResize() {
    const w = container.clientWidth || 440;
    const h = container.clientHeight || 440;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', handleResize, { passive: true });

  console.log('🎂 Cake Atelier — Three.js WebGL 3D Cake Initialized successfully');
})();

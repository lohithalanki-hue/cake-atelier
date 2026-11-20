/* ═══════════════════════════════════════════════════════
   CAKE ATELIER — Master 3D WebGL Cake Engine (Three.js)
   True 3D procedural cake modeled after reference video:
   - Starts at top-down view of the cake
   - Sweeps down to side view on scroll
   - Info boxes flank the cake
   - Spins a full 360° circle on vertical axis (XZ plane)
   - Unpins and scrolls down into the normal website!
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

  let width = container.clientWidth || 500;
  let height = container.clientHeight || 500;

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  // Start from DIRECT TOP-DOWN viewpoint looking straight down at the top of the cake
  camera.position.set(0, 7.8, 0.02);
  camera.lookAt(0, 0.1, 0);

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

  // ─── PBR Materials (Matching Video Aesthetic) ───
  // Soft pale-cream buttercream frosting
  const buttercreamMaterial = new THREE.MeshStandardMaterial({
    color: 0xF8F3E4,
    roughness: 0.36,
    metalness: 0.04
  });

  // Whiter whipped cream for piped swirls & rosettes
  const whippedCreamMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFDF8,
    roughness: 0.32,
    metalness: 0.02
  });

  // Glazed caramelized golden-brown sweets (Gulab Jamun / caramelized bonbons)
  const caramelizedSweetMaterial = new THREE.MeshStandardMaterial({
    color: 0x542314,
    roughness: 0.12,
    metalness: 0.16
  });

  // Brilliant 24K edible gold pearls & dragees
  const goldPearlMaterial = new THREE.MeshStandardMaterial({
    color: 0xF5D061,
    metalness: 0.94,
    roughness: 0.12
  });

  // Gold metallic round cake board (under the cake on turntable)
  const goldBoardMaterial = new THREE.MeshStandardMaterial({
    color: 0xDDAA4C,
    metalness: 0.92,
    roughness: 0.18
  });

  // Clean white porcelain turntable revolving stand
  const turntableMaterial = new THREE.MeshStandardMaterial({
    color: 0xF7F4EE,
    roughness: 0.25,
    metalness: 0.08
  });

  // ─── Build the 3D Cake Hierarchy (Matching Video) ───
  const cakeGroup = new THREE.Group();
  scene.add(cakeGroup);

  // 1. Revolving Turntable Stand
  const turntableGroup = new THREE.Group();

  // White base plate of the turntable
  const ttBase = new THREE.Mesh(
    new THREE.CylinderGeometry(2.5, 2.7, 0.2, 64),
    turntableMaterial
  );
  ttBase.position.y = -1.2;
  ttBase.receiveShadow = true;
  turntableGroup.add(ttBase);

  // Turntable stem / bevel
  const ttStem = new THREE.Mesh(
    new THREE.CylinderGeometry(2.7, 2.5, 0.12, 64),
    turntableMaterial
  );
  ttStem.position.y = -1.05;
  turntableGroup.add(ttStem);

  // 2. Gold Cake Board (Circular golden base board under the cake)
  const goldBoard = new THREE.Mesh(
    new THREE.CylinderGeometry(2.4, 2.4, 0.05, 64),
    goldBoardMaterial
  );
  goldBoard.position.y = -0.97;
  goldBoard.receiveShadow = true;
  turntableGroup.add(goldBoard);

  cakeGroup.add(turntableGroup);

  // 3. Main Cake Cylinder Body
  const cakeBody = new THREE.Mesh(
    new THREE.CylinderGeometry(2.02, 2.02, 1.28, 64),
    buttercreamMaterial
  );
  cakeBody.position.y = -0.32;
  cakeBody.castShadow = true;
  cakeBody.receiveShadow = true;
  cakeGroup.add(cakeBody);

  // 4. Scalloped Shell-Piped Border (around the base rim on gold board)
  const shellGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const shellCount = 40;
  for (let i = 0; i < shellCount; i++) {
    const angle = (i / shellCount) * Math.PI * 2;
    const shell = new THREE.Mesh(shellGeo, whippedCreamMaterial);
    shell.scale.set(1.4, 0.8, 1.0);
    shell.position.set(
      Math.cos(angle) * 2.05,
      -0.92,
      Math.sin(angle) * 2.05
    );
    shell.rotation.y = angle;
    turntableGroup.add(shell);
  }

  // 5. Halved Caramelized Sweets around the Vertical Sides
  // (Matching the side slices visible in frame 7 & 10 of the video)
  const sideSliceGeo = new THREE.SphereGeometry(0.24, 16, 16, 0, Math.PI);
  const sideCount = 8;
  for (let i = 0; i < sideCount; i++) {
    const angle = (i / sideCount) * Math.PI * 2;
    const slice = new THREE.Mesh(sideSliceGeo, caramelizedSweetMaterial);
    slice.scale.set(1.0, 1.3, 0.5);
    slice.position.set(
      Math.cos(angle) * 2.03,
      -0.34,
      Math.sin(angle) * 2.03
    );
    slice.rotation.y = angle + Math.PI / 2;
    slice.rotation.x = Math.PI / 12;
    slice.castShadow = true;
    cakeGroup.add(slice);
  }

  // 6. Top Surface Rim: Piped Rosettes + Round Caramelized Sweets + Gold Pearls
  // (Matching the top view in frame 1 of the video)
  const topCount = 10;
  const rosetteGeo = new THREE.TorusGeometry(0.16, 0.07, 16, 32);
  const sweetGeo = new THREE.SphereGeometry(0.22, 24, 24);
  const pearlGeo = new THREE.SphereGeometry(0.065, 16, 16);

  for (let i = 0; i < topCount; i++) {
    const angle = (i / topCount) * Math.PI * 2;
    const radDist = 1.68;
    const x = Math.cos(angle) * radDist;
    const z = Math.sin(angle) * radDist;

    // Whipped cream rosette swirl
    const rosette = new THREE.Mesh(rosetteGeo, whippedCreamMaterial);
    rosette.rotation.x = Math.PI / 2;
    rosette.position.set(x, 0.33, z);
    cakeGroup.add(rosette);

    // Glazed caramelized round sweet (Gulab Jamun / round confectionery)
    const sweet = new THREE.Mesh(sweetGeo, caramelizedSweetMaterial);
    sweet.position.set(x, 0.46, z);
    sweet.castShadow = true;
    cakeGroup.add(sweet);

    // Shiny gold pearl on top of each sweet
    const pearl = new THREE.Mesh(pearlGeo, goldPearlMaterial);
    pearl.position.set(x, 0.70, z);
    cakeGroup.add(pearl);
  }

  // 7. Center Scattered Edible Gold Dragees / Pearls
  // (Matching the scattered gold pearls in the center of frame 1 of the video)
  const centerPearlGeo = new THREE.SphereGeometry(0.042, 12, 12);
  const centerPearlCount = 48;
  for (let i = 0; i < centerPearlCount; i++) {
    const r = Math.sqrt(Math.random()) * 1.25;
    const theta = Math.random() * Math.PI * 2;
    const cPearl = new THREE.Mesh(centerPearlGeo, goldPearlMaterial);
    cPearl.position.set(
      Math.cos(theta) * r,
      0.33,
      Math.sin(theta) * r
    );
    cakeGroup.add(cPearl);
  }

  // 8. Subtle Floating Ambient Gold Dust Particles
  const particleGroup = new THREE.Group();
  const particleCount = 24;
  const particleGeo = new THREE.OctahedronGeometry(0.04, 0);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const pMesh = new THREE.Mesh(particleGeo, goldPearlMaterial);
    const r = 2.4 + Math.random() * 1.3;
    const ang = Math.random() * Math.PI * 2;
    const y = -0.8 + Math.random() * 2.8;

    pMesh.position.set(Math.cos(ang) * r, y, Math.sin(ang) * r);
    particleGroup.add(pMesh);
    particles.push({
      mesh: pMesh,
      baseAngle: ang,
      radius: r,
      yOffset: y,
      speed: 0.15 + Math.random() * 0.3,
      bobSpeed: 1 + Math.random() * 2
    });
  }
  cakeGroup.add(particleGroup);

  // ─── Studio Lighting ───
  const ambientLight = new THREE.AmbientLight(0xFFF6EA, 1.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xFFF9EE, 2.6);
  mainLight.position.set(4.5, 9.5, 5.0);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  mainLight.shadow.bias = -0.001;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xEADECA, 1.2);
  fillLight.position.set(-5.0, 4.0, -4.0);
  scene.add(fillLight);

  // Overhead point light for dramatic specular shine on top view
  const topLight = new THREE.PointLight(0xFFE8B2, 2.4, 9);
  topLight.position.set(0, 4.2, 0.1);
  scene.add(topLight);

  // ─── Scroll-Driven Animation Choreography ───
  let scrollProgress = 0;
  let targetRotationY = 0;
  let currentRotationY = 0;
  let dragDeltaX = 0;
  let mouseTiltX = 0;
  let mouseTiltY = 0;
  let isDragging = false;
  let dragStartX = 0;

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

        // Phase 1: 0.0 -> 0.25: Camera glides down from top-down to side profile
        // Intro overlay header fades out
        if (introOverlay) {
          const introOpacity = Math.max(0, 1 - (scrollProgress / 0.18));
          introOverlay.style.opacity = introOpacity;
          introOverlay.style.pointerEvents = introOpacity < 0.1 ? 'none' : 'auto';
        }

        // Phase 2: 0.25 -> 0.88: Cake rotates full 360° circle in XZ plane
        if (scrollProgress < 0.25) {
          targetRotationY = 0;
          // Hide cards while at top-down view
          leftCards.forEach(c => c.classList.remove('active'));
          rightCards.forEach(c => c.classList.remove('active'));
        } else if (scrollProgress <= 0.88) {
          // Normalize rotation progress from 0 to 1 over the 0.25 to 0.88 scroll window
          const rotProgress = (scrollProgress - 0.25) / 0.63;
          // Full 360° circle rotation:
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

  // ─── Interactive Mouse Drag & Touch Orbit ───
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
      mouseTiltX = nx * 0.3;
      mouseTiltY = -ny * 0.2;
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      container.style.cursor = 'grab';
    }
  });

  // Touch drag support
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
      // Step 1: 0.32, Step 2: 0.55, Step 3: 0.78
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

    // Lerp rotation smoothly
    currentRotationY += (targetRotationY + dragDeltaX - currentRotationY) * 0.08;
    cakeGroup.rotation.y = currentRotationY;

    // Decay drag back to scroll angle
    if (!isDragging) {
      dragDeltaX *= 0.94;
    }

    // ─── Camera Swoop: Top-Down to Side View ───
    // At scrollProgress = 0: camera is at TOP-DOWN view (y: 7.8, z: 0.02)
    // As user scrolls from 0 to 0.25: camera sweeps down to side view (y: 1.4, z: 6.2)
    const cameraT = Math.min(scrollProgress / 0.25, 1.0);
    // Smooth easeInOut curve
    const smoothT = 0.5 - 0.5 * Math.cos(cameraT * Math.PI);

    const startY = 7.8;
    const endY = 1.4;
    const currentCamY = startY + (endY - startY) * smoothT + mouseTiltY;

    const startZ = 0.02;
    const endZ = 6.2;
    const currentCamZ = startZ + (endZ - startZ) * smoothT;

    const currentCamX = Math.sin(mouseTiltX) * 1.2;

    camera.position.set(currentCamX, currentCamY, currentCamZ);

    // Look target smoothly lowers from top face to center of cake
    const lookTargetY = 0.1 - smoothT * 0.35;
    camera.lookAt(0, lookTargetY, 0);

    // Gentle organic breathing animation
    cakeGroup.position.y = Math.sin(elapsedTime * 1.1) * 0.035;

    // Floating gold particle animation
    particles.forEach((p, idx) => {
      const curAng = p.baseAngle + elapsedTime * (p.speed * 0.3) + currentRotationY * 0.2;
      p.mesh.position.x = Math.cos(curAng) * p.radius;
      p.mesh.position.z = Math.sin(curAng) * p.radius;
      p.mesh.position.y = p.yOffset + Math.sin(elapsedTime * p.bobSpeed + idx) * 0.1;
      p.mesh.rotation.y += 0.012;
      p.mesh.rotation.x += 0.008;
    });

    renderer.render(scene, camera);
  }

  animate();

  // ─── Responsive Resize ───
  function onResize() {
    width = container.clientWidth || 500;
    height = container.clientHeight || 500;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onResize, { passive: true });

  console.log('🎂 Cake Atelier — 3D Video-Inspired Cake Engine Active');
})();

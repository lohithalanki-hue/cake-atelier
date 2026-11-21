/* ═══════════════════════════════════════════════════════
   CAKE ATELIER — Master 3D WebGL Chocolate Cake Engine
   Haute Chocolaterie Procedural 3D Model:
   - Valrhona dark chocolate mirror glaze with clearcoat sheen
   - Sculpted chocolate shards & 24K edible gold leaf flakes
   - Slender, aesthetic, non-chunky proportions & slim bronze stand
   - Starts at top-down view of the chocolate mirror crown
   - Camera glides down to side view on scroll
   - Rotates a full 360° circle on vertical Y-axis (XZ plane)
   - Cursor drag rotation disabled (scroll-driven precision)
   - Unpins smoothly into the streamlined atelier website
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

  let width = container.clientWidth || 600;
  let height = container.clientHeight || 600;

  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
  // Start from DIRECT TOP-DOWN viewpoint looking straight down at the chocolate glaze crown
  camera.position.set(0, 8.0, 0.02);
  camera.lookAt(0, 0.15, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ─── Haute Chocolaterie PBR Materials ───
  // 1. High-Gloss Dark Chocolate Mirror Glaze (Guanaja 70%)
  const chocolateGlazeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x140A06,
    roughness: 0.10,
    metalness: 0.06,
    clearcoat: 0.95,
    clearcoatRoughness: 0.08,
    reflectivity: 0.85
  });

  // 2. Velvet Dark Chocolate Ganache Body
  const chocolateGanacheMaterial = new THREE.MeshStandardMaterial({
    color: 0x22130C,
    roughness: 0.28,
    metalness: 0.03
  });

  // 3. Crisp Sculpted Tempered Chocolate Shards
  const chocolateShardMaterial = new THREE.MeshStandardMaterial({
    color: 0x180D07,
    roughness: 0.18,
    metalness: 0.06
  });

  // 4. Brilliant 24K Edible Gold Leaf & Pearls
  const goldLeafMaterial = new THREE.MeshStandardMaterial({
    color: 0xF5D061,
    metalness: 0.96,
    roughness: 0.12
  });

  // 5. Polished 24K Gold Cake Presentation Board
  const goldBoardMaterial = new THREE.MeshStandardMaterial({
    color: 0xD8A84E,
    metalness: 0.94,
    roughness: 0.14
  });

  // 6. Sleek Brushed Champagne Bronze Turntable Pedestal (Non-chunky)
  const bronzeStandMaterial = new THREE.MeshStandardMaterial({
    color: 0x36281E,
    roughness: 0.25,
    metalness: 0.75
  });

  // ─── Build the 3D Chocolate Cake Hierarchy ───
  const cakeGroup = new THREE.Group();
  scene.add(cakeGroup);

  // ── 1. Sleek, Slim Turntable Pedestal (Elegant & Slender) ──
  const turntableGroup = new THREE.Group();

  // Minimalist beveled base plate
  const standFoot = new THREE.Mesh(
    new THREE.CylinderGeometry(1.85, 1.95, 0.04, 64),
    bronzeStandMaterial
  );
  standFoot.position.y = -1.15;
  standFoot.receiveShadow = true;
  turntableGroup.add(standFoot);

  // Slender architectural stem
  const standStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.36, 0.26, 32),
    bronzeStandMaterial
  );
  standStem.position.y = -1.01;
  standStem.receiveShadow = true;
  turntableGroup.add(standStem);

  // Razor-thin revolving platter
  const standPlatter = new THREE.Mesh(
    new THREE.CylinderGeometry(2.35, 2.35, 0.03, 64),
    bronzeStandMaterial
  );
  standPlatter.position.y = -0.87;
  standPlatter.receiveShadow = true;
  turntableGroup.add(standPlatter);

  // Ultra-thin 24K Gold Mirror Board under cake
  const goldBoard = new THREE.Mesh(
    new THREE.CylinderGeometry(2.24, 2.24, 0.022, 64),
    goldBoardMaterial
  );
  goldBoard.position.y = -0.845;
  goldBoard.receiveShadow = true;
  turntableGroup.add(goldBoard);

  cakeGroup.add(turntableGroup);

  // ── 2. Sleek Dark Chocolate Cake Cylinder ──
  // Proportions: Graceful diameter (1.98 radius) & height (1.42), not a chunky block
  const cakeBody = new THREE.Mesh(
    new THREE.CylinderGeometry(1.98, 1.98, 1.42, 64),
    chocolateGanacheMaterial
  );
  cakeBody.position.y = -0.13;
  cakeBody.castShadow = true;
  cakeBody.receiveShadow = true;
  cakeGroup.add(cakeBody);

  // ── 3. Poured Dark Chocolate Mirror Glaze Crown ──
  // Smooth glossy mirror top cap
  const glazeCap = new THREE.Mesh(
    new THREE.CylinderGeometry(1.99, 1.99, 0.03, 64),
    chocolateGlazeMaterial
  );
  glazeCap.position.y = 0.585;
  glazeCap.receiveShadow = true;
  cakeGroup.add(glazeCap);

  // Rounded liquid mirror glaze bevel lip around top rim
  const glazeRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.97, 0.025, 16, 64),
    chocolateGlazeMaterial
  );
  glazeRim.rotation.x = Math.PI / 2;
  glazeRim.position.y = 0.585;
  cakeGroup.add(glazeRim);

  // ── 4. Mid-Waist 24K Gold Leaf Inlay Ribbon ──
  const goldInlayBand = new THREE.Mesh(
    new THREE.CylinderGeometry(1.988, 1.988, 0.015, 64),
    goldLeafMaterial
  );
  goldInlayBand.position.y = -0.12;
  cakeGroup.add(goldInlayBand);

  // ── 5. Fine Bottom Chocolate Pearl String (60 micro beads) ──
  const pearlGeo = new THREE.SphereGeometry(0.045, 14, 14);
  const basePearlCount = 60;
  for (let i = 0; i < basePearlCount; i++) {
    const angle = (i / basePearlCount) * Math.PI * 2;
    const pearl = new THREE.Mesh(pearlGeo, chocolateShardMaterial);
    pearl.position.set(
      Math.cos(angle) * 2.01,
      -0.815,
      Math.sin(angle) * 2.01
    );
    turntableGroup.add(pearl);
  }

  // ── 6. Top Surface: Sculpted Tempered Chocolate Shards & Quenelles ──
  // (Spectacular aesthetic seen from top-down and side profile)
  const shardCount = 8;
  const shardGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.55, 16, 1, true, 0, Math.PI * 0.72);
  const quenelleGeo = new THREE.SphereGeometry(0.16, 20, 20);
  const goldDotGeo = new THREE.SphereGeometry(0.045, 12, 12);

  for (let i = 0; i < shardCount; i++) {
    const angle = (i / shardCount) * Math.PI * 2;
    const rShard = 1.32;
    const rQuenelle = 1.62;

    // Sculpted curved chocolate shard
    const shard = new THREE.Mesh(shardGeo, chocolateShardMaterial);
    shard.scale.set(1.0, 1.2, 0.85);
    shard.position.set(
      Math.cos(angle) * rShard,
      0.82,
      Math.sin(angle) * rShard
    );
    shard.rotation.y = angle + Math.PI / 4;
    shard.rotation.x = 0.22;
    shard.rotation.z = -0.15;
    shard.castShadow = true;
    cakeGroup.add(shard);

    // Delicate dark chocolate quenelle / bonbon on the outer top perimeter
    const quenelle = new THREE.Mesh(quenelleGeo, chocolateGlazeMaterial);
    quenelle.scale.set(1.15, 0.8, 0.9);
    quenelle.position.set(
      Math.cos(angle + Math.PI / shardCount) * rQuenelle,
      0.68,
      Math.sin(angle + Math.PI / shardCount) * rQuenelle
    );
    quenelle.rotation.y = angle;
    quenelle.castShadow = true;
    cakeGroup.add(quenelle);

    // 24K Edible Gold Leaf crowning each quenelle
    const goldLeaf = new THREE.Mesh(goldDotGeo, goldLeafMaterial);
    goldLeaf.scale.set(1.1, 0.5, 1.1);
    goldLeaf.position.set(
      Math.cos(angle + Math.PI / shardCount) * rQuenelle,
      0.81,
      Math.sin(angle + Math.PI / shardCount) * rQuenelle
    );
    cakeGroup.add(goldLeaf);
  }

  // ── 7. Center 24K Edible Gold Leaf Specks & Micro Dragees ──
  // (Cluster of brilliant gold flecks catching the overhead light in top view)
  const centerGoldCount = 42;
  const flakeGeo = new THREE.OctahedronGeometry(0.038, 0);
  for (let i = 0; i < centerGoldCount; i++) {
    const r = Math.sqrt(Math.random()) * 0.95;
    const theta = Math.random() * Math.PI * 2;
    const flake = new THREE.Mesh(flakeGeo, goldLeafMaterial);
    flake.scale.set(
      0.6 + Math.random() * 0.8,
      0.25 + Math.random() * 0.35,
      0.6 + Math.random() * 0.8
    );
    flake.position.set(
      Math.cos(theta) * r,
      0.605,
      Math.sin(theta) * r
    );
    flake.rotation.y = Math.random() * Math.PI;
    flake.rotation.z = Math.random() * 0.2;
    cakeGroup.add(flake);
  }

  // ── 8. Ambient Golden Cacao Particle Mist ──
  const particleGroup = new THREE.Group();
  const particleCount = 20;
  const particleGeo = new THREE.OctahedronGeometry(0.032, 0);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const pMesh = new THREE.Mesh(particleGeo, goldLeafMaterial);
    const r = 2.3 + Math.random() * 1.2;
    const ang = Math.random() * Math.PI * 2;
    const y = -0.7 + Math.random() * 2.5;

    pMesh.position.set(Math.cos(ang) * r, y, Math.sin(ang) * r);
    particleGroup.add(pMesh);
    particles.push({
      mesh: pMesh,
      baseAngle: ang,
      radius: r,
      yOffset: y,
      speed: 0.12 + Math.random() * 0.25,
      bobSpeed: 1 + Math.random() * 1.8
    });
  }
  cakeGroup.add(particleGroup);

  // ─── Studio Lighting (Tuned for Dark Chocolate Depth) ───
  const ambientLight = new THREE.AmbientLight(0xFFF7EC, 1.4);
  scene.add(ambientLight);

  // Key Light from upper right
  const mainLight = new THREE.DirectionalLight(0xFFFAF2, 2.8);
  mainLight.position.set(4.5, 9.5, 4.8);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  mainLight.shadow.bias = -0.001;
  scene.add(mainLight);

  // Back Rim Light to sculpt dark chocolate edges against background
  const rimLight = new THREE.DirectionalLight(0xEAE0D2, 1.5);
  rimLight.position.set(-5.0, 5.0, -4.5);
  scene.add(rimLight);

  // Overhead Warm Spotlight for specular mirror glaze reflection in top view
  const overheadSpot = new THREE.PointLight(0xFFE5B4, 3.2, 10);
  overheadSpot.position.set(0, 4.5, 0.1);
  scene.add(overheadSpot);

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

    // Smooth lerp rotation following scroll progress
    currentRotationY += (targetRotationY - currentRotationY) * 0.09;
    cakeGroup.rotation.y = currentRotationY;

    // ─── Camera Swoop: Top-Down to Side View ───
    // At scrollProgress = 0: camera is at TOP-DOWN view (y: 8.0, z: 0.02)
    // As user scrolls from 0 to 0.25: camera sweeps down to side view (y: 1.25, z: 5.4)
    const cameraT = Math.min(scrollProgress / 0.25, 1.0);
    // Smooth easeInOut curve
    const smoothT = 0.5 - 0.5 * Math.cos(cameraT * Math.PI);

    const startY = 8.0;
    const endY = 1.25;
    const currentCamY = startY + (endY - startY) * smoothT;

    const startZ = 0.02;
    const endZ = 5.4;
    const currentCamZ = startZ + (endZ - startZ) * smoothT;

    camera.position.set(0, currentCamY, currentCamZ);

    // Look target smoothly lowers from top face to center of cake
    const lookTargetY = 0.15 - smoothT * 0.25;
    camera.lookAt(0, lookTargetY, 0);

    // Subtle organic breathing motion
    cakeGroup.position.y = Math.sin(elapsedTime * 1.0) * 0.025;

    // Floating gold particle dust animation
    particles.forEach((p, idx) => {
      const curAng = p.baseAngle + elapsedTime * (p.speed * 0.25) + currentRotationY * 0.15;
      p.mesh.position.x = Math.cos(curAng) * p.radius;
      p.mesh.position.z = Math.sin(curAng) * p.radius;
      p.mesh.position.y = p.yOffset + Math.sin(elapsedTime * p.bobSpeed + idx) * 0.08;
      p.mesh.rotation.y += 0.012;
      p.mesh.rotation.x += 0.008;
    });

    renderer.render(scene, camera);
  }

  animate();

  // ─── Responsive Resize ───
  function onResize() {
    width = container.clientWidth || 600;
    height = container.clientHeight || 600;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onResize, { passive: true });

  console.log('🎂 Cake Atelier — Haute Chocolaterie 3D Engine Active');
})();

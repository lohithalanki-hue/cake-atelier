/* ═══════════════════════════════════════════════════════
   CAKE ATELIER — Master 3D WebGL Chocolate Cake Engine
   Haute Chocolaterie Procedural 3D Model:
   - Complete cake 100% visible with elegant framing (zero clipping)
   - Organic, non-boxy artisan silhouette with tapered body & beveled shoulders
   - Sculpted curved chocolate petals arcing inward like a cacao flower
   - Liquid poured Valrhona mirror glaze with clearcoat specular sheen
   - Hand-piped ganache quenelles with 24K edible gold leaf
   - Brushed champagne-bronze revolving turntable & gold mirror board
   - Starts at top-down view of mirror crown, sweeps down to side profile
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

  let width = container.clientWidth || 580;
  let height = container.clientHeight || 580;

  const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);

  // Initial Top-Down viewpoint looking directly down at the mirror glaze crown
  camera.position.set(0, 7.6, 0.02);
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
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ─── PBR Haute Chocolaterie Materials ───
  // 1. Liquid Dark Chocolate Mirror Glaze (Valrhona Guanaja 70%)
  const chocolateGlazeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x200E08,
    roughness: 0.08,
    metalness: 0.06,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    reflectivity: 0.90
  });

  // 2. Velvet Dark Chocolate Ganache Body (Warm Cocoa Tones — NOT pitch-black)
  const chocolateGanacheMaterial = new THREE.MeshStandardMaterial({
    color: 0x321910,
    roughness: 0.32,
    metalness: 0.04
  });

  // 3. Sculpted Tempered Chocolate Petals / Sails
  const chocolatePetalMaterial = new THREE.MeshStandardMaterial({
    color: 0x2A150D,
    roughness: 0.16,
    metalness: 0.08
  });

  // 4. Edible 24K Gold Leaf & Micro Dragees
  const goldLeafMaterial = new THREE.MeshStandardMaterial({
    color: 0xF5D061,
    metalness: 0.96,
    roughness: 0.10
  });

  // 5. Polished 24K Gold Mirror Cake Presentation Board
  const goldBoardMaterial = new THREE.MeshStandardMaterial({
    color: 0xE2B056,
    metalness: 0.94,
    roughness: 0.15
  });

  // 6. Brushed Champagne Bronze Revolving Pedestal
  const bronzeStandMaterial = new THREE.MeshStandardMaterial({
    color: 0x423224,
    roughness: 0.28,
    metalness: 0.75
  });

  // ─── Build the 3D Chocolate Cake Hierarchy ───
  const cakeGroup = new THREE.Group();
  scene.add(cakeGroup);

  // ── 1. Elegant Revolving Turntable Stand & 24K Gold Board ──
  const turntableGroup = new THREE.Group();

  // Beveled pedestal foot
  const standFoot = new THREE.Mesh(
    new THREE.CylinderGeometry(1.42, 1.54, 0.04, 64),
    bronzeStandMaterial
  );
  standFoot.position.y = -1.22;
  standFoot.receiveShadow = true;
  turntableGroup.add(standFoot);

  // Slender architectural stem
  const standStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.28, 0.22, 32),
    bronzeStandMaterial
  );
  standStem.position.y = -1.09;
  standStem.receiveShadow = true;
  turntableGroup.add(standStem);

  // Revolving turntable platter with beveled edge
  const standPlatter = new THREE.Mesh(
    new THREE.CylinderGeometry(1.82, 1.82, 0.035, 64),
    bronzeStandMaterial
  );
  standPlatter.position.y = -0.96;
  standPlatter.receiveShadow = true;
  turntableGroup.add(standPlatter);

  // Wafer-thin 24K Gold Mirror Board under cake
  const goldBoard = new THREE.Mesh(
    new THREE.CylinderGeometry(1.74, 1.74, 0.025, 64),
    goldBoardMaterial
  );
  goldBoard.position.y = -0.93;
  goldBoard.receiveShadow = true;
  turntableGroup.add(goldBoard);

  cakeGroup.add(turntableGroup);

  // ── 2. Organic, Tapered Chocolate Cake Body (Non-Boxy) ──
  // Gentle organic taper: radius 1.50 at base to 1.42 at top shoulder
  const cakeBody = new THREE.Mesh(
    new THREE.CylinderGeometry(1.42, 1.50, 1.24, 64),
    chocolateGanacheMaterial
  );
  cakeBody.position.y = -0.29;
  cakeBody.castShadow = true;
  cakeBody.receiveShadow = true;
  cakeGroup.add(cakeBody);

  // Soft rounded ganache shoulder (eliminates harsh 90° boxy edge!)
  const roundedShoulder = new THREE.Mesh(
    new THREE.TorusGeometry(1.40, 0.045, 16, 64),
    chocolateGanacheMaterial
  );
  roundedShoulder.rotation.x = Math.PI / 2;
  roundedShoulder.position.y = 0.33;
  roundedShoulder.castShadow = true;
  cakeGroup.add(roundedShoulder);

  // Liquid poured chocolate mirror glaze top reservoir
  const glazeTop = new THREE.Mesh(
    new THREE.CylinderGeometry(1.41, 1.41, 0.02, 64),
    chocolateGlazeMaterial
  );
  glazeTop.position.y = 0.335;
  glazeTop.receiveShadow = true;
  cakeGroup.add(glazeTop);

  // Flowing organic chocolate glaze scallops along top shoulder
  const scallopCount = 8;
  const scallopGeo = new THREE.SphereGeometry(0.12, 16, 16);
  for (let i = 0; i < scallopCount; i++) {
    const angle = (i / scallopCount) * Math.PI * 2;
    const scallop = new THREE.Mesh(scallopGeo, chocolateGlazeMaterial);
    scallop.scale.set(1.4, 0.5, 0.8);
    scallop.position.set(
      Math.cos(angle) * 1.41,
      0.31,
      Math.sin(angle) * 1.41
    );
    scallop.rotation.y = angle;
    cakeGroup.add(scallop);
  }

  // Mid-waist 24K gold leaf hairline ribbon
  const goldWaistBand = new THREE.Mesh(
    new THREE.CylinderGeometry(1.472, 1.472, 0.012, 64),
    goldLeafMaterial
  );
  goldWaistBand.position.y = -0.30;
  cakeGroup.add(goldWaistBand);

  // Bottom delicate hand-piped chocolate pearls (48 micro beads on gold board)
  const pearlGeo = new THREE.SphereGeometry(0.04, 14, 14);
  const basePearlCount = 48;
  for (let i = 0; i < basePearlCount; i++) {
    const angle = (i / basePearlCount) * Math.PI * 2;
    const pearl = new THREE.Mesh(pearlGeo, chocolatePetalMaterial);
    pearl.position.set(
      Math.cos(angle) * 1.54,
      -0.89,
      Math.sin(angle) * 1.54
    );
    turntableGroup.add(pearl);
  }

  // ── 3. Top Crown: Sculpted Curved Chocolate Petals & Quenelles ──
  // 8 graceful curved chocolate petals arcing inward like an opening cacao blossom
  const petalCount = 8;
  const petalGeo = new THREE.CylinderGeometry(0.32, 0.46, 0.52, 16, 1, true, 0, Math.PI * 0.70);
  const quenelleGeo = new THREE.SphereGeometry(0.13, 20, 20);
  const goldDotGeo = new THREE.SphereGeometry(0.038, 12, 12);

  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2;
    const rPetal = 0.90;
    const rQuenelle = 1.18;

    // Sculpted curved chocolate petal sail
    const petal = new THREE.Mesh(petalGeo, chocolatePetalMaterial);
    petal.scale.set(0.95, 1.1, 0.75);
    petal.position.set(
      Math.cos(angle) * rPetal,
      0.58,
      Math.sin(angle) * rPetal
    );
    petal.rotation.y = angle + Math.PI / 3;
    petal.rotation.x = 0.28;
    petal.rotation.z = -0.18;
    petal.castShadow = true;
    cakeGroup.add(petal);

    // Hand-piped dark chocolate ganache quenelle (teardrop form)
    const quenelle = new THREE.Mesh(quenelleGeo, chocolateGlazeMaterial);
    quenelle.scale.set(1.2, 0.75, 0.8);
    quenelle.position.set(
      Math.cos(angle + Math.PI / petalCount) * rQuenelle,
      0.44,
      Math.sin(angle + Math.PI / petalCount) * rQuenelle
    );
    quenelle.rotation.y = angle;
    quenelle.castShadow = true;
    cakeGroup.add(quenelle);

    // Shimmering 24K Edible Gold Leaf flake crowning each quenelle
    const goldLeaf = new THREE.Mesh(goldDotGeo, goldLeafMaterial);
    goldLeaf.scale.set(1.0, 0.35, 1.0);
    goldLeaf.position.set(
      Math.cos(angle + Math.PI / petalCount) * rQuenelle,
      0.54,
      Math.sin(angle + Math.PI / petalCount) * rQuenelle
    );
    cakeGroup.add(goldLeaf);
  }

  // ── 4. Center 24K Edible Gold Leaf Constellation ──
  // 36 irregular gold leaf flecks clustered on the dark mirror glaze
  const centerGoldCount = 36;
  const flakeGeo = new THREE.OctahedronGeometry(0.032, 0);
  for (let i = 0; i < centerGoldCount; i++) {
    const r = Math.sqrt(Math.random()) * 0.72;
    const theta = Math.random() * Math.PI * 2;
    const flake = new THREE.Mesh(flakeGeo, goldLeafMaterial);
    flake.scale.set(
      0.6 + Math.random() * 0.7,
      0.22 + Math.random() * 0.3,
      0.6 + Math.random() * 0.7
    );
    flake.position.set(
      Math.cos(theta) * r,
      0.355,
      Math.sin(theta) * r
    );
    flake.rotation.y = Math.random() * Math.PI;
    flake.rotation.z = Math.random() * 0.2;
    cakeGroup.add(flake);
  }

  // ── 5. Ambient Floating Golden Particles ──
  const particleGroup = new THREE.Group();
  const particleCount = 18;
  const particleGeo = new THREE.OctahedronGeometry(0.028, 0);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const pMesh = new THREE.Mesh(particleGeo, goldLeafMaterial);
    const r = 2.0 + Math.random() * 1.0;
    const ang = Math.random() * Math.PI * 2;
    const y = -0.7 + Math.random() * 2.1;

    pMesh.position.set(Math.cos(ang) * r, y, Math.sin(ang) * r);
    particleGroup.add(pMesh);
    particles.push({
      mesh: pMesh,
      baseAngle: ang,
      radius: r,
      yOffset: y,
      speed: 0.12 + Math.random() * 0.22,
      bobSpeed: 1.0 + Math.random() * 1.6
    });
  }
  cakeGroup.add(particleGroup);

  // ─── Studio Lighting (Multi-Point Warm Cocoa Depth) ───
  // Warm ivory ambient light (prevents harsh pitch-black shadows)
  const ambientLight = new THREE.AmbientLight(0xFFF6E8, 1.9);
  scene.add(ambientLight);

  // Key light from top-front-right
  const mainLight = new THREE.DirectionalLight(0xFFFAF0, 3.0);
  mainLight.position.set(4.5, 9.0, 5.0);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  mainLight.shadow.bias = -0.001;
  scene.add(mainLight);

  // Fill / Bounce Light from lower-left (lifts shadows, illuminates chocolate & stand)
  const fillLight = new THREE.DirectionalLight(0xF5E0C6, 2.4);
  fillLight.position.set(-5.0, 4.0, -3.5);
  scene.add(fillLight);

  // Overhead Warm Spotlight for mirror glaze reflection in top view
  const overheadSpot = new THREE.PointLight(0xFFE2A0, 3.6, 10);
  overheadSpot.position.set(0, 4.5, 0.1);
  scene.add(overheadSpot);

  // Subtle back rim light for silhouette definition
  const rimLight = new THREE.DirectionalLight(0xEFE0D0, 2.0);
  rimLight.position.set(0, 3.0, -6.0);
  scene.add(rimLight);

  // ─── Responsive Camera Framing (Guaranteed 100% Full Visibility) ───
  function updateCameraFraming() {
    width = container.clientWidth || 580;
    height = container.clientHeight || 580;
    const aspect = width / height;
    camera.aspect = aspect;

    // If container is narrower than 1:1, expand FOV proportionally so horizontal edges never crop
    if (aspect < 1.0) {
      camera.fov = 34 / aspect;
    } else {
      camera.fov = 34;
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
    // At scrollProgress = 0: camera is at TOP-DOWN view (y: 7.6, z: 0.02) looking at (0, 0, 0)
    // As user scrolls from 0 to 0.25: camera sweeps down to side profile (y: 0.25, z: 6.8) looking at (0, -0.22, 0)
    const cameraT = Math.min(scrollProgress / 0.25, 1.0);
    // Smooth easeInOut curve
    const smoothT = 0.5 - 0.5 * Math.cos(cameraT * Math.PI);

    const startY = 7.6;
    const endY = 0.25;
    const currentCamY = startY + (endY - startY) * smoothT;

    const startZ = 0.02;
    const endZ = 6.8;
    const currentCamZ = startZ + (endZ - startZ) * smoothT;

    camera.position.set(0, currentCamY, currentCamZ);

    // Look target smoothly lowers from top face to center of cake
    const lookTargetY = 0.0 - smoothT * 0.22;
    camera.lookAt(0, lookTargetY, 0);

    // Gentle organic breathing motion
    cakeGroup.position.y = Math.sin(elapsedTime * 1.0) * 0.02;

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

  // ─── Window Resize Listener ───
  window.addEventListener('resize', updateCameraFraming, { passive: true });

  console.log('🎂 Cake Atelier — Haute Chocolaterie 3D Engine Active (Full Visibility & Organic Sculpting)');
})();

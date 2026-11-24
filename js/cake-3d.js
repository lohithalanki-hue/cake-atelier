/* ═══════════════════════════════════════════════════════
   CAKE ATELIER — Master 3D Artisanal Cake Engine
   Faithful Recreation of Celebration Cake with Intense Physical DEPTH:
   - Physically sculpted horizontal spatula ridges on the cake cylinder (not flat!)
   - 16 sculpted star-piped whipped buttercream rosettes with deep fluted spiral ridges
   - Bottom sprinkle waterfall / cascade: 340+ colorful sprinkles pressed onto side walls
   - Top confetti wreath: 380+ rainbow nonpareils and sugar pearls in the rosette valleys
   - Bottom French piped star shell border on the porcelain pedestal
   - Warm studio lighting with rim halo — white cake pops dramatically on dark background!
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

  const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);

  // Top-Down View: Perfectly centered over cake origin
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
  renderer.toneMappingExposure = 1.10;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ─── Procedural Artisanal Frosting Bump & Texture ───
  function createFrostingTopTexture() {
    var c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    var ctx = c.getContext('2d');

    ctx.fillStyle = '#FCFAF6';
    ctx.fillRect(0, 0, c.width, c.height);

    // Circular turntable spatula waves
    var centerX = 512;
    var centerY = 512;
    for (var r = 40; r < 500; r += 16) {
      var alpha = 0.08 + Math.sin(r * 0.05) * 0.04;
      ctx.strokeStyle = (r % 32 === 0) ? 'rgba(255, 255, 255, 0.45)' : 'rgba(235, 226, 214, ' + alpha + ')';
      ctx.lineWidth = 14;
      ctx.beginPath();
      for (var a = 0; a <= Math.PI * 2; a += 0.1) {
        var wob = r + Math.sin(a * 5) * 4 + Math.cos(a * 3) * 3;
        var x = centerX + Math.cos(a) * wob;
        var y = centerY + Math.sin(a) * wob;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    for (var i = 0; i < 6000; i++) {
      var px = Math.random() * c.width;
      var py = Math.random() * c.height;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.25)' : 'rgba(228, 218, 204, 0.18)';
      ctx.fillRect(px, py, 1.5, 1.5);
    }

    var tex = new THREE.CanvasTexture(c);
    return tex;
  }

  function createButtercreamSideTexture() {
    var c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    var ctx = c.getContext('2d');

    ctx.fillStyle = '#FAF7F1';
    ctx.fillRect(0, 0, c.width, c.height);

    for (var y = 0; y < c.height; y += 6) {
      var wave = Math.sin(y * 0.05) * 6;
      ctx.fillStyle = (y % 12 === 0) ? 'rgba(255, 255, 255, 0.35)' : 'rgba(236, 227, 216, 0.22)';
      ctx.fillRect(0, y + wave, c.width, 4);
    }

    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(2, 1);
    return tex;
  }

  var frostingTopTexture = createFrostingTopTexture();
  var buttercreamSideTexture = createButtercreamSideTexture();

  // ─── PBR Artisanal Materials (Soft Velvety Matte-Satin) ───
  var frostingTopMaterial = new THREE.MeshStandardMaterial({
    color: 0xFDFBF7,
    map: frostingTopTexture,
    bumpMap: frostingTopTexture,
    bumpScale: 0.045,
    roughness: 0.68,
    metalness: 0.0
  });

  var frostingBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xF9F6EE,
    map: buttercreamSideTexture,
    bumpMap: buttercreamSideTexture,
    bumpScale: 0.040,
    roughness: 0.65,
    metalness: 0.0
  });

  var rosetteMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFDF8,
    roughness: 0.42,
    metalness: 0.0
  });

  var porcelainStandMaterial = new THREE.MeshStandardMaterial({
    color: 0xFCFAF7,
    roughness: 0.18,
    metalness: 0.02
  });

  // ─── Build the 3D Cake Hierarchy ───
  var cakeGroup = new THREE.Group();
  scene.add(cakeGroup);

  var cakeRadius = 1.72;
  var cakeHeight = 1.34;
  var topY = 0.52;

  // ── 1. Elegant Porcelain Pedestal Cake Stand ──
  var standGroup = new THREE.Group();

  var standBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.68, 1.88, 0.055, 64),
    porcelainStandMaterial
  );
  standBase.position.y = -1.24;
  standBase.receiveShadow = true;
  standGroup.add(standBase);

  var standStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.42, 0.36, 32),
    porcelainStandMaterial
  );
  standStem.position.y = -1.04;
  standStem.receiveShadow = true;
  standGroup.add(standStem);

  var standPlatter = new THREE.Mesh(
    new THREE.CylinderGeometry(2.18, 2.18, 0.048, 64),
    porcelainStandMaterial
  );
  standPlatter.position.y = -0.85;
  standPlatter.receiveShadow = true;
  standGroup.add(standPlatter);

  cakeGroup.add(standGroup);

  // ── 2. PHYSICALLY SCULPTED RIBBED CAKE BODY (True 3D Spatula Ridges!) ──
  // Instead of a plain cylinder, the vertices physically ripple in radius
  // creating deep horizontal offset-spatula grooves with chiaroscuro depth!
  function createSculptedCakeBodyGeometry(radius, height) {
    var radialSegments = 64;
    var heightSegments = 32;
    var vertices = [];
    var uvs = [];
    var indices = [];

    for (var j = 0; j <= heightSegments; j++) {
      var v = j / heightSegments;
      var y = -height / 2 + v * height;
      // Physical horizontal ridges: 7 smooth concentric waves
      var ripple = 1.0 + 0.026 * Math.cos(v * Math.PI * 14.0) + 0.012 * Math.sin(v * Math.PI * 6.0);
      var r = radius * ripple;

      for (var i = 0; i <= radialSegments; i++) {
        var u = (i / radialSegments) * Math.PI * 2;
        var x = r * Math.cos(u);
        var z = r * Math.sin(u);

        vertices.push(x, y, z);
        uvs.push(i / radialSegments, v);
      }
    }

    var ringVertices = radialSegments + 1;
    for (var j = 0; j < heightSegments; j++) {
      for (var i = 0; i < radialSegments; i++) {
        var a = j * ringVertices + i;
        var b = (j + 1) * ringVertices + i;
        var c = (j + 1) * ringVertices + (i + 1);
        var d = j * ringVertices + (i + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  var sculptedBodyGeo = createSculptedCakeBodyGeometry(cakeRadius, cakeHeight);
  var cakeBody = new THREE.Mesh(sculptedBodyGeo, frostingBodyMaterial);
  cakeBody.position.y = -0.16;
  cakeBody.castShadow = true;
  cakeBody.receiveShadow = true;
  cakeGroup.add(cakeBody);

  // ── 3. Pillowy Frosting Top Disc & Soft Scalloped Shoulder ──
  var topDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(cakeRadius + 0.015, cakeRadius + 0.015, 0.045, 64),
    frostingTopMaterial
  );
  topDisc.position.y = topY;
  topDisc.receiveShadow = true;
  cakeGroup.add(topDisc);

  var frostingRim = new THREE.Mesh(
    new THREE.TorusGeometry(cakeRadius + 0.008, 0.035, 16, 64),
    frostingTopMaterial
  );
  frostingRim.rotation.x = Math.PI / 2;
  frostingRim.position.y = topY;
  cakeGroup.add(frostingRim);

  // ── 4. Bottom Piped Pearl Shell Border (36 pearls at cake base) ──
  var bottomPearlCount = 36;
  var bottomPearlGeo = new THREE.SphereGeometry(0.048, 12, 12);
  var bottomPearlGroup = new THREE.Group();
  for (var pi = 0; pi < bottomPearlCount; pi++) {
    var pAngle = (pi / bottomPearlCount) * Math.PI * 2;
    var pearl = new THREE.Mesh(bottomPearlGeo, rosetteMaterial);
    pearl.scale.set(1.0, 0.85, 1.25);
    pearl.rotation.y = -pAngle;
    pearl.position.set(
      Math.cos(pAngle) * (cakeRadius + 0.014),
      -0.82,
      Math.sin(pAngle) * (cakeRadius + 0.014)
    );
    bottomPearlGroup.add(pearl);
  }
  cakeGroup.add(bottomPearlGroup);

  // ── 5. SCULPTED FLUTED STAR-PIPED BUTTERCREAM ROSETTES (16 Rosettes) ──
  function createFlutedRosetteGeometry(baseRadius, height, flutes, twist) {
    var radialSegments = 36;
    var heightSegments = 20;
    var vertices = [];
    var uvs = [];
    var indices = [];

    for (var j = 0; j <= heightSegments; j++) {
      var v = j / heightSegments;
      var profile = Math.cos(v * Math.PI * 0.5);
      var y = Math.pow(v, 0.88) * height;

      for (var i = 0; i <= radialSegments; i++) {
        var u = (i / radialSegments) * Math.PI * 2;
        var ripple = 1.0 + 0.36 * Math.cos(flutes * u + v * twist);
        var r = baseRadius * profile * ripple;

        var x = r * Math.cos(u);
        var z = r * Math.sin(u);

        vertices.push(x, y, z);
        uvs.push(i / radialSegments, v);
      }
    }

    var ringVertices = radialSegments + 1;
    for (var j = 0; j < heightSegments; j++) {
      for (var i = 0; i < radialSegments; i++) {
        var a = j * ringVertices + i;
        var b = (j + 1) * ringVertices + i;
        var c = (j + 1) * ringVertices + (i + 1);
        var d = j * ringVertices + (i + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    var baseCenterIndex = vertices.length / 3;
    vertices.push(0, 0, 0);
    uvs.push(0.5, 0.5);
    for (var i = 0; i < radialSegments; i++) {
      indices.push(baseCenterIndex, i + 1, i);
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  var rosetteCount = 16;
  var rosetteGeo = createFlutedRosetteGeometry(0.24, 0.32, 8, 2.4);
  var rosetteRadius = 1.48;

  for (var ri = 0; ri < rosetteCount; ri++) {
    var rAngle = (ri / rosetteCount) * Math.PI * 2;
    var rosette = new THREE.Mesh(rosetteGeo, rosetteMaterial);

    rosette.position.set(
      Math.cos(rAngle) * rosetteRadius,
      topY + 0.015,
      Math.sin(rAngle) * rosetteRadius
    );
    rosette.rotation.y = rAngle + (Math.random() - 0.5) * 0.25;
    rosette.castShadow = true;
    rosette.receiveShadow = true;
    cakeGroup.add(rosette);
  }

  // ── 6. CONFETTI SPRINKLES: TOP WREATH & SIDE WATERFALL CASCADE ──
  var sprinkleColors = [
    0xE6397A, // Strawberry Magenta Pink
    0x00B4D8, // Vibrant Turquoise Cyan
    0xFFBE0B, // Sunshine Lemon Yellow
    0xFB5607, // Tangerine Orange
    0x8338EC, // Sweet Violet Purple
    0x38B000, // Fresh Lime Green
    0xFFFFFF  // Sugar Pearl White
  ];

  var sprinkleMaterials = sprinkleColors.map(function (c) {
    return new THREE.MeshStandardMaterial({
      color: c,
      roughness: 0.35,
      metalness: 0.05
    });
  });

  var sprinkleGroup = new THREE.Group();
  var nonpareilGeo = new THREE.SphereGeometry(0.022, 8, 8);
  var jimmyGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.055, 6);

  // A. Top Confetti Wreath (clustered around rosettes)
  var nonpareilCount = 260;
  for (var ni = 0; ni < nonpareilCount; ni++) {
    var angle = Math.random() * Math.PI * 2;
    var distNorm = Math.random();
    var r = (distNorm < 0.75) ? (1.26 + Math.random() * 0.38) : (0.92 + Math.random() * 0.34);

    var matIndex = Math.floor(Math.random() * sprinkleMaterials.length);
    var bead = new THREE.Mesh(nonpareilGeo, sprinkleMaterials[matIndex]);

    var scale = 0.75 + Math.random() * 0.55;
    bead.scale.set(scale, scale, scale);
    bead.position.set(
      Math.cos(angle) * r,
      topY + 0.022 + Math.random() * 0.015,
      Math.sin(angle) * r
    );
    bead.castShadow = true;
    sprinkleGroup.add(bead);
  }

  var jimmyCount = 120;
  for (var ji = 0; ji < jimmyCount; ji++) {
    var jAngle = Math.random() * Math.PI * 2;
    var jR = 1.24 + Math.random() * 0.40;

    var jMatIndex = Math.floor(Math.random() * sprinkleMaterials.length);
    var jimmy = new THREE.Mesh(jimmyGeo, sprinkleMaterials[jMatIndex]);

    jimmy.position.set(
      Math.cos(jAngle) * jR,
      topY + 0.022,
      Math.sin(jAngle) * jR
    );
    jimmy.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
    jimmy.rotation.z = Math.random() * Math.PI * 2;
    jimmy.castShadow = true;
    sprinkleGroup.add(jimmy);
  }

  // B. SIDE SPRINKLE WATERFALL CASCADE (Dense at base, cascading upward!)
  var sideSprinkleCount = 360;
  for (var si = 0; si < sideSprinkleCount; si++) {
    var sAngle = Math.random() * Math.PI * 2;
    // Exponential falloff upward: dense at bottom (-0.80 to -0.45), scattering up to -0.05
    var vDist = Math.pow(Math.random(), 2.0);
    var sy = -0.78 + vDist * 0.74;

    // Radius matching the physical spatula ridges at this height
    var vRel = (sy - (-cakeHeight / 2)) / cakeHeight;
    var sideRipple = 1.0 + 0.026 * Math.cos(vRel * Math.PI * 14.0) + 0.012 * Math.sin(vRel * Math.PI * 6.0);
    var sr = (cakeRadius * sideRipple) + 0.012;

    var sMat = sprinkleMaterials[Math.floor(Math.random() * sprinkleMaterials.length)];

    if (Math.random() > 0.42) {
      // Nonpareil bead stuck to side wall
      var bead = new THREE.Mesh(nonpareilGeo, sMat);
      var bScale = 0.70 + Math.random() * 0.50;
      bead.scale.set(bScale, bScale, bScale);
      bead.position.set(Math.cos(sAngle) * sr, sy, Math.sin(sAngle) * sr);
      bead.castShadow = true;
      sprinkleGroup.add(bead);
    } else {
      // Jimmy sprinkle lying against side wall
      var jimmy = new THREE.Mesh(jimmyGeo, sMat);
      jimmy.position.set(Math.cos(sAngle) * sr, sy, Math.sin(sAngle) * sr);
      jimmy.rotation.y = -sAngle + Math.PI / 2;
      jimmy.rotation.x = Math.random() * Math.PI;
      jimmy.rotation.z = (Math.random() - 0.5) * 0.8;
      jimmy.castShadow = true;
      sprinkleGroup.add(jimmy);
    }
  }

  cakeGroup.add(sprinkleGroup);

  // ─── Studio Direct Lighting (Warm, Diffused, High-Contrast Against Dark Canvas) ───

  // Warm ambient base
  var ambientLight = new THREE.AmbientLight(0xFFF7F0, 1.9);
  scene.add(ambientLight);

  // Studio Key Light (casts soft shadows into the rosette flutes and side ridges)
  var keyLight = new THREE.DirectionalLight(0xFFFAF2, 2.2);
  keyLight.position.set(4.0, 7.5, 4.0);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  // Warm Fill Light (softens side shadows)
  var fillLight = new THREE.DirectionalLight(0xF6ECE0, 1.4);
  fillLight.position.set(-4.5, 5.0, 2.5);
  scene.add(fillLight);

  // Overhead Diffuse Light
  var topDiffuse = new THREE.DirectionalLight(0xFFF7EE, 1.3);
  topDiffuse.position.set(0, 9.0, 0.5);
  scene.add(topDiffuse);

  // Rim Backlight (champagne halo making the white frosting pop off dark background)
  var rimLight = new THREE.DirectionalLight(0xFFF2E6, 1.8);
  rimLight.position.set(0, 4.0, -5.5);
  scene.add(rimLight);

  // ─── Responsive Camera Framing ───
  function updateCameraFraming() {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    var aspect = width / height;
    camera.aspect = aspect;

    if (aspect < 1.0) {
      camera.fov = 34 / aspect;
    } else {
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

        // Phase 1: 0.0 -> 0.25: Top-down view sweeps to side profile
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

    currentRotationY += (targetRotationY - currentRotationY) * 0.09;
    cakeGroup.rotation.y = currentRotationY;

    // ─── Camera Swoop: Top-Down to Full Side Profile ───
    var cameraT = Math.min(scrollProgress / 0.25, 1.0);
    var smoothT = 0.5 - 0.5 * Math.cos(cameraT * Math.PI);

    var currentCamY = 6.4 + (0.35 - 6.4) * smoothT;
    var currentCamZ = 0.01 + (5.8 - 0.01) * smoothT;
    camera.position.set(0, currentCamY, currentCamZ);

    var lookY = 0 + (-0.15 - 0) * smoothT;
    camera.lookAt(0, lookY, 0);

    cakeGroup.position.y = Math.sin(elapsedTime * 1.0) * 0.016;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', updateCameraFraming, { passive: true });

  console.log('🎂 Cake Atelier — Physical Depth Celebration Cake Engine Active');
})();

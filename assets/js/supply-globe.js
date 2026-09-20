/* Vasudha Pharma - Interactive 3D Global Supply & Regulatory Globe
   Pure Canvas 3D (No heavy external dependencies), High performance 60FPS
*/
(function () {
  'use strict';

  var REGIONS = [
    {
      id: 'north_america',
      name: 'North America (USA & Canada)',
      shortName: 'USA & Canada',
      lat: 38.9,
      lng: -77.0,
      markets: 'United States, Canada',
      approvals: 'US FDA, Health Canada, EDQM (CEP for US-bound APIs)',
      apis: 'Clopidogrel, Cinnarizine, Cyclobenzaprine, Piperidone Derivatives',
      filings: '18+ Active US DMFs',
      color: '#00d2ff',
      leadTime: '3-5 business days air freight, 18 days sea freight'
    },
    {
      id: 'europe',
      name: 'European Union & United Kingdom',
      shortName: 'Europe & UK',
      lat: 50.8,
      lng: 4.35,
      markets: 'Germany, France, UK, Italy, Spain, Switzerland',
      approvals: 'EDQM (CEP), EU-GMP, MHRA UK, ANSM France',
      apis: 'Domperidone, Clopidogrel Bisulfate, Ondansetron, Cetirizine',
      filings: '24+ Active CEPs & EU DMFs',
      color: '#38ef7d',
      leadTime: '4-6 business days express air courier'
    },
    {
      id: 'japan',
      name: 'Japan & East Asia',
      shortName: 'Japan & East Asia',
      lat: 35.67,
      lng: 139.65,
      markets: 'Japan, South Korea, Taiwan',
      approvals: 'PMDA Japan, MFDS Korea, TFDA',
      apis: 'Piperidone Intermediates, Cyclobenzaprine, Cinnarizine',
      filings: '12+ JDMF (Japanese DMF) filings',
      color: '#ffc107',
      leadTime: '4-7 business days'
    },
    {
      id: 'latam',
      name: 'Latin America (LATAM)',
      shortName: 'Latin America',
      lat: -14.23,
      lng: -51.92,
      markets: 'Brazil, Mexico, Argentina, Colombia',
      approvals: 'ANVISA Brazil, COFEPRIS Mexico, INVIMA Colombia',
      apis: 'Antihistamines, CVS APIs, GI Tract Formulations',
      filings: '15+ Active Cadifa / Dossiers',
      color: '#ff7675',
      leadTime: '6-10 business days direct air cargo'
    },
    {
      id: 'mena',
      name: 'Middle East & North Africa (MENA)',
      shortName: 'Middle East',
      lat: 25.2,
      lng: 55.27,
      markets: 'UAE, Saudi Arabia, Egypt, Jordan, Turkey',
      approvals: 'SFDA (Saudi Arabia), MOH UAE, Egyptian EDA',
      apis: 'Cardiovascular, Anti-inflammatory, Specialized intermediates',
      filings: '10+ Approved country registrations',
      color: '#a29bfe',
      leadTime: '2-4 business days'
    },
    {
      id: 'india',
      name: 'Global Operations HQ & Manufacturing Hub (India)',
      shortName: '★ Vasudha HQ (India)',
      lat: 17.68,
      lng: 83.21, // Vizag / Hyderabad coords
      markets: 'Domestic & 80+ Export Partner Nations',
      approvals: 'US FDA, WHO-GMP, EU-GMP, COFEPRIS, PMDA, ISO 9001/14001/4501',
      apis: 'Full Portfolio (Unit 1 to 5 Manufacturing Sites: 1200+ KL capacity)',
      filings: 'Global Headquarters & 5 cGMP API facilities',
      color: '#ffffff',
      leadTime: 'Same day domestic dispatch / Direct bonded export'
    }
  ];

  var canvas, ctx, container;
  var rotX = 0.2;
  var rotY = 2.4;
  var targetRotX = 0.2;
  var targetRotY = 2.4;
  var isDragging = false;
  var lastMouseX = 0;
  var lastMouseY = 0;
  var autoRotate = true;
  var activeRegion = REGIONS[0];
  var sphereRadius = 160;
  var globePoints = [];
  var animFrameId = null;

  function initGlobePoints() {
    globePoints = [];
    // Generate dense grid of latitude and longitude dots for realistic 3D sphere depth
    for (var lat = -82; lat <= 82; lat += 7) {
      var latRad = (lat * Math.PI) / 180;
      var rAtLat = Math.cos(latRad);
      var count = Math.floor(44 * rAtLat);
      if (count < 6) count = 6;
      for (var i = 0; i < count; i++) {
        var lng = (i / count) * 360 - 180;
        var lngRad = (lng * Math.PI) / 180;
        globePoints.push({
          x: Math.cos(latRad) * Math.sin(lngRad),
          y: -Math.sin(latRad),
          z: Math.cos(latRad) * Math.cos(lngRad)
        });
      }
    }
  }

  function latLngTo3D(lat, lng) {
    var phi = (90 - lat) * (Math.PI / 180);
    var theta = (lng + 180) * (Math.PI / 180);
    return {
      x: -Math.sin(phi) * Math.cos(theta),
      y: -Math.cos(phi),
      z: Math.sin(phi) * Math.sin(theta)
    };
  }

  function rotateVector(vec, rx, ry) {
    // Rotate Y
    var cosY = Math.cos(ry);
    var sinY = Math.sin(ry);
    var x1 = vec.x * cosY + vec.z * sinY;
    var z1 = -vec.x * sinY + vec.z * cosY;
    var y1 = vec.y;

    // Rotate X
    var cosX = Math.cos(rx);
    var sinX = Math.sin(rx);
    var y2 = y1 * cosX - z1 * sinX;
    var z2 = y1 * sinX + z1 * cosX;
    var x2 = x1;

    return { x: x2, y: y2, z: z2 };
  }

  function drawGlobe() {
    if (!canvas || !ctx || !container) return;

    var dpr = window.devicePixelRatio || 1;
    var w = container.clientWidth || 500;
    var h = container.clientHeight || 480;

    // Keep canvas device resolution in exact sync with CSS layout
    var targetW = Math.round(w * dpr);
    var targetH = Math.round(h * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    // Set transform cleanly in CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // EXACT GEOMETRIC CENTER
    var cx = w / 2;
    var cy = h / 2;
    sphereRadius = Math.min(w, h) * 0.38;
    if (sphereRadius > 185) sphereRadius = 185;
    if (sphereRadius < 120) sphereRadius = 120;

    ctx.clearRect(0, 0, w, h);

    // Smooth rotation
    if (autoRotate && !isDragging) {
      targetRotY += 0.004;
    }
    rotX += (targetRotX - rotX) * 0.08;
    rotY += (targetRotY - rotY) * 0.08;

    // Outer glow atmosphere
    var glow = ctx.createRadialGradient(cx, cy, sphereRadius * 0.85, cx, cy, sphereRadius * 1.35);
    glow.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
    glow.addColorStop(0.5, 'rgba(30, 58, 138, 0.10)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, sphereRadius * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // Dark globe spherical background
    var bgGrad = ctx.createRadialGradient(cx - sphereRadius * 0.3, cy - sphereRadius * 0.3, sphereRadius * 0.15, cx, cy, sphereRadius);
    bgGrad.addColorStop(0, '#13284f');
    bgGrad.addColorStop(0.7, '#0b1933');
    bgGrad.addColorStop(1, '#061021');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
    ctx.fill();

    // Globe outline border
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw longitude & latitude grid dots
    for (var i = 0; i < globePoints.length; i++) {
      var p = globePoints[i];
      var r = rotateVector(p, rotX, rotY);
      if (r.z > -0.05) {
        var alpha = Math.max(0.12, (r.z + 0.1) / 1.1);
        ctx.fillStyle = 'rgba(125, 185, 255, ' + alpha.toFixed(2) + ')';
        var px = cx + r.x * sphereRadius;
        var py = cy + r.y * sphereRadius;
        ctx.beginPath();
        ctx.arc(px, py, 1.25, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // HQ coords (India)
    var hq = REGIONS[REGIONS.length - 1];
    var hq3d = latLngTo3D(hq.lat, hq.lng);
    var hqRot = rotateVector(hq3d, rotX, rotY);
    var hqScreen = {
      x: cx + hqRot.x * sphereRadius,
      y: cy + hqRot.y * sphereRadius,
      visible: hqRot.z > -0.1
    };

    // Draw Shipping / Regulatory Arcs from India to each foreign region
    for (var rIdx = 0; rIdx < REGIONS.length - 1; rIdx++) {
      var reg = REGIONS[rIdx];
      var reg3d = latLngTo3D(reg.lat, reg.lng);
      var regRot = rotateVector(reg3d, rotX, rotY);

      if (hqRot.z > -0.15 || regRot.z > -0.15) {
        var regScreen = {
          x: cx + regRot.x * sphereRadius,
          y: cy + regRot.y * sphereRadius
        };

        // Arc peak elevated above surface
        var mid3d = {
          x: (hq3d.x + reg3d.x) * 0.5,
          y: (hq3d.y + reg3d.y) * 0.5,
          z: (hq3d.z + reg3d.z) * 0.5
        };
        var midLen = Math.sqrt(mid3d.x * mid3d.x + mid3d.y * mid3d.y + mid3d.z * mid3d.z) || 1;
        var elevation = 1.32;
        var midElev = {
          x: (mid3d.x / midLen) * elevation,
          y: (mid3d.y / midLen) * elevation,
          z: (mid3d.z / midLen) * elevation
        };
        var midRot = rotateVector(midElev, rotX, rotY);
        var midScreen = {
          x: cx + midRot.x * sphereRadius,
          y: cy + midRot.y * sphereRadius
        };

        var isActive = activeRegion && activeRegion.id === reg.id;
        ctx.beginPath();
        ctx.moveTo(hqScreen.x, hqScreen.y);
        ctx.quadraticCurveTo(midScreen.x, midScreen.y, regScreen.x, regScreen.y);
        ctx.strokeStyle = isActive ? 'rgba(0, 225, 255, 0.95)' : 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = isActive ? 2.5 : 1;
        if (isActive) ctx.setLineDash([5, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw Region Nodes & Prominent Text Badges
    var time = Date.now() * 0.003;
    for (var j = 0; j < REGIONS.length; j++) {
      var region = REGIONS[j];
      var pos3d = latLngTo3D(region.lat, region.lng);
      var rot = rotateVector(pos3d, rotX, rotY);

      if (rot.z > -0.05) {
        var sx = cx + rot.x * sphereRadius;
        var sy = cy + rot.y * sphereRadius;
        var isHq = region.id === 'india';
        var isSelected = activeRegion && activeRegion.id === region.id;

        // Animated pulse ring
        var pulseRadius = (Math.sin(time + j * 1.2) + 1) * 3.5 + (isSelected ? 7 : 4);
        ctx.strokeStyle = region.color;
        ctx.lineWidth = isSelected ? 2.2 : 1.2;
        ctx.beginPath();
        ctx.arc(sx, sy, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Node center dot
        ctx.fillStyle = region.color;
        ctx.beginPath();
        ctx.arc(sx, sy, isHq ? 6 : (isSelected ? 5.5 : 4), 0, Math.PI * 2);
        ctx.fill();

        // PROMINENT, CRISP TEXT BADGE FOR ALL VISIBLE NODES
        var label = region.shortName || region.name.split('(')[0].trim();
        var fontSize = isSelected ? 12 : 11;
        ctx.font = (isSelected ? 'bold ' : '600 ') + fontSize + 'px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        var textWidth = ctx.measureText(label).width;

        var badgePadX = 7;
        var badgePadY = 4;
        var badgeW = textWidth + badgePadX * 2;
        var badgeH = fontSize + badgePadY * 2;
        var badgeX = sx + 10;
        var badgeY = sy - badgeH / 2;

        // Keep label inside canvas bounds
        if (badgeX + badgeW > w - 10) {
          badgeX = sx - badgeW - 10;
        }

        // Draw pill background
        ctx.fillStyle = isSelected ? 'rgba(3, 105, 161, 0.92)' : 'rgba(8, 20, 44, 0.88)';
        ctx.strokeStyle = isSelected ? '#38bdf8' : region.color;
        ctx.lineWidth = isSelected ? 1.5 : 1;
        
        ctx.beginPath();
        var radius = 5;
        ctx.roundRect ? ctx.roundRect(badgeX, badgeY, badgeW, badgeH, radius) : ctx.rect(badgeX, badgeY, badgeW, badgeH);
        ctx.fill();
        ctx.stroke();

        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, badgeX + badgePadX, badgeY + badgeH / 2);

        // Store bounds for click detection
        region.screenX = sx;
        region.screenY = sy;
        region.badgeLeft = badgeX;
        region.badgeRight = badgeX + badgeW;
        region.badgeTop = badgeY;
        region.badgeBottom = badgeY + badgeH;
        region.visible = true;
      } else {
        region.visible = false;
      }
    }

    animFrameId = requestAnimationFrame(drawGlobe);
  }

  function updateHUD(reg) {
    activeRegion = reg;
    var titleEl = document.getElementById('vpGlobeTitle');
    var badgeEl = document.getElementById('vpGlobeBadge');
    var approvalsEl = document.getElementById('vpGlobeApprovals');
    var filingsEl = document.getElementById('vpGlobeFilings');
    var apisEl = document.getElementById('vpGlobeApis');
    var logisticsEl = document.getElementById('vpGlobeLogistics');

    if (titleEl) titleEl.textContent = reg.name;
    if (badgeEl) {
      badgeEl.textContent = reg.id === 'india' ? 'Primary Operations Hub' : 'Export Market';
      badgeEl.style.backgroundColor = reg.id === 'india' ? '#0066cc' : 'rgba(0, 200, 255, 0.2)';
    }
    if (approvalsEl) approvalsEl.textContent = reg.approvals;
    if (filingsEl) filingsEl.textContent = reg.filings;
    if (apisEl) apisEl.textContent = reg.apis;
    if (logisticsEl) logisticsEl.textContent = reg.leadTime;

    // Highlight corresponding pill in selector if present
    var pills = document.querySelectorAll('.vp-globe-pill');
    pills.forEach(function (pill) {
      if (pill.getAttribute('data-region') === reg.id) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  function rotateToRegion(reg) {
    autoRotate = false;
    updateHUD(reg);
    var targetY = -((reg.lng + 90) * Math.PI) / 180;
    var targetX = (reg.lat * Math.PI) / 180;
    while (targetY - rotY > Math.PI) targetY -= Math.PI * 2;
    while (targetY - rotY < -Math.PI) targetY += Math.PI * 2;
    targetRotY = targetY;
    targetRotX = Math.max(-1.0, Math.min(1.0, targetX));
  }

  function setupEvents() {
    if (!canvas) return;

    canvas.addEventListener('mousedown', function (e) {
      isDragging = true;
      autoRotate = false;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', function () {
      isDragging = false;
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var dx = e.clientX - lastMouseX;
      var dy = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      targetRotY += dx * 0.008;
      targetRotX += dy * 0.008;
      targetRotX = Math.max(-1.2, Math.min(1.2, targetRotX));
    });

    // Touch support for mobile
    canvas.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        isDragging = true;
        autoRotate = false;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', function () {
      isDragging = false;
    });

    window.addEventListener('touchmove', function (e) {
      if (!isDragging || e.touches.length !== 1) return;
      var dx = e.touches[0].clientX - lastMouseX;
      var dy = e.touches[0].clientY - lastMouseY;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
      targetRotY += dx * 0.01;
      targetRotX += dy * 0.01;
      targetRotX = Math.max(-1.2, Math.min(1.2, targetRotX));
    }, { passive: true });

    // Click on canvas to select node or badge
    canvas.addEventListener('click', function (e) {
      var rect = canvas.getBoundingClientRect();
      var clickX = e.clientX - rect.left;
      var clickY = e.clientY - rect.top;

      for (var i = 0; i < REGIONS.length; i++) {
        var r = REGIONS[i];
        if (r.visible && r.screenX !== undefined) {
          var dist = Math.hypot(clickX - r.screenX, clickY - r.screenY);
          var inBadge = r.badgeLeft !== undefined && clickX >= r.badgeLeft && clickX <= r.badgeRight && clickY >= r.badgeTop && clickY <= r.badgeBottom;
          if (dist < 26 || inBadge) {
            rotateToRegion(r);
            return;
          }
        }
      }
    });

    // Toggle autorotate button
    var toggleBtn = document.getElementById('vpGlobeToggleRotate');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        autoRotate = !autoRotate;
        this.classList.toggle('active', autoRotate);
        this.innerHTML = autoRotate ? '<i class="fas fa-pause"></i> Pause Orbit' : '<i class="fas fa-play"></i> Resume Orbit';
      });
    }

    // Delegate Region Pill click events
    var pillContainer = document.getElementById('vpGlobePills');
    if (pillContainer) {
      pillContainer.addEventListener('click', function (e) {
        var pill = e.target.closest('.vp-globe-pill');
        if (!pill) return;
        var regId = pill.getAttribute('data-region');
        var match = REGIONS.filter(function (r) { return r.id === regId; })[0];
        if (match) {
          rotateToRegion(match);
        }
      });
    }
  }

  function init() {
    container = document.getElementById('vpGlobeCanvasContainer');
    canvas = document.getElementById('vpGlobeCanvas');
    if (!container || !canvas) return;

    ctx = canvas.getContext('2d');
    initGlobePoints();
    setupEvents();
    updateHUD(REGIONS[0]);
    drawGlobe();
  }

  window.VP_SelectGlobeRegion = function (regionId) {
    var match = REGIONS.filter(function (r) { return r.id === regionId; })[0];
    if (match) rotateToRegion(match);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

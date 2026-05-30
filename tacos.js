// JavaScript - Guía del Sabor CDMX Publimex 2026
// PUBLIMEX Digital OOH - Propuesta C: Impacto Social B2C

// Global error handler for debugging in-browser errors
window.onerror = function(message, source, lineno, colno, error) {
  console.error("GLOBAL JS ERROR: " + message + " at " + source + ":" + lineno + ":" + colno);
  return false;
};

// --- 1. CONFIGURACIÓN Y ESTADO DE LA CAMPAÑA ---
const TACO_CAMPAIGN_KEY = 'publimex_tacos_campaign_v4';

let state = {
  hasVoted: false,
  votedTaqueria: '', // 'compadre', 'cocuyos', 'chupacabras', 'turix', 'manolo'
  votedDetails: {
    name: '',
    email: '',
    phone: ''
  },
  liveVotes: {
    compadre: 18450,
    cocuyos: 16120,
    chupacabras: 15840,
    turix: 14930,
    manolo: 13750
  }
};

// Detalle de las 5 taquerías de la CDMX
const teams = {
  compadre: {
    name: 'Tacos El Compadre',
    zone: 'Reforma',
    flag: '🌮',
    fact: 'Especialidad: Tacos al pastor. Su trompo gigante en Paseo de la Reforma es un ícono local. Abierto hasta las 3:00 AM.',
    distance: 'A 22 km de Estadio Azteca. Acceso vía Metro Reforma / Metrobús.',
    baseVotes: 18450
  },
  cocuyos: {
    name: 'Tacos Los Cocuyos',
    zone: 'Polanco',
    flag: '🌮',
    fact: 'Especialidad: Suadero y tripa. Famosos tacos con cocción lenta tradicional en choricera. Abierto 24 horas.',
    distance: 'A 18 km de Estadio Azteca. Acceso directo por Metro Polanco.',
    baseVotes: 16120
  },
  chupacabras: {
    name: 'Tacos El Chupacabras',
    zone: 'Roma',
    flag: '🌮',
    fact: 'Especialidad: Tacos campechanos. Una de las barras de salsas y guarniciones libres más famosas de la ciudad.',
    distance: 'A 12 km de Estadio Azteca. Cerca de Av. Insurgentes Sur.',
    baseVotes: 15840
  },
  turix: {
    name: 'Taquería El Turix',
    zone: 'Condesa',
    flag: '🌮',
    fact: 'Especialidad: Cochinita Pibil yucateca. Famosos panuchos y tortas bañados en salsa de habanero tatemado.',
    distance: 'A 15 km de Estadio Azteca. Cerca del Parque México.',
    baseVotes: 14930
  },
  manolo: {
    name: 'Tacos Manolo',
    zone: 'Santa Fe',
    flag: '🌮',
    fact: 'Especialidad: El taco Manolo (bistec picado con tocino y cebolla) y gringas con aderezo secreto de ajo.',
    distance: 'A 26 km de Estadio Azteca. Conexión rápida por Supervía Poniente.',
    baseVotes: 13750
  }
};

// --- 2. PERSISTENCIA DE ESTADO ---
function loadCampaignState() {
  const localData = localStorage.getItem(TACO_CAMPAIGN_KEY);
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      if (parsed.hasVoted !== undefined) state.hasVoted = parsed.hasVoted;
      if (parsed.votedTaqueria) state.votedTaqueria = parsed.votedTaqueria;
      if (parsed.votedDetails) state.votedDetails = parsed.votedDetails;
      if (parsed.liveVotes) state.liveVotes = parsed.liveVotes;
    } catch(e) {
      console.error('Error al parsear estado local:', e);
    }
  }
}

function saveCampaignState() {
  localStorage.setItem(TACO_CAMPAIGN_KEY, JSON.stringify(state));
}

// --- 3. AUDIO SINTETIZADO CON WEB AUDIO API ---
function playTacoSound(type) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    if (type === 'whistle') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'stadium') {
      const notes = [329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + (idx * 0.08));
        gain.gain.setValueAtTime(0.08, now + (idx * 0.08));
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + (idx * 0.08));
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + (idx * 0.08));
        osc.stop(now + 1.2);
      });
    }
  } catch (e) {
    console.warn('AudioContext no soportado o bloqueado por el navegador.', e);
  }
}

// --- 4. MICRO-ANIMACIONES DE CELEBRACIÓN ---
function triggerConfettiExplosion() {
  const container = document.body;
  const colors = ['#dc2626', '#facc15', '#16a34a', '#ffffff', '#2563eb'];
  
  for (let i = 0; i < 70; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.position = 'fixed';
    confetti.style.top = '-10px';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.opacity = '0.85';
    confetti.style.zIndex = '100000';
    confetti.style.pointerEvents = 'none';
    
    const size = 6 + Math.random() * 8;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    
    const duration = 2.0 + Math.random() * 2.5;
    confetti.style.transition = `transform ${duration}s linear, opacity ${duration}s ease-out`;
    
    container.appendChild(confetti);

    // Trigger physical animation in DOM
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        confetti.style.transform = `translateY(105vh) rotate(${360 + Math.random() * 360}deg)`;
        confetti.style.opacity = '0';
      });
    });

    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, (duration + 0.5) * 1000);
  }
}

// --- 5. QR VISUAL EN ESCÁNER ---
function renderTeamQRInScanner(teamKey) {
  const container = document.getElementById('scanner-qr-display');
  if (!container) return;
  
  container.innerHTML = `
    <div style="position: relative; width: 140px; height: 140px; background: #fff; padding: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;">
      <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; fill: #000;">
        <rect x="0" y="0" width="22" height="22" />
        <rect x="2" y="2" width="18" height="18" fill="#fff" />
        <rect x="5" y="5" width="12" height="12" />
        
        <rect x="78" y="0" width="22" height="22" />
        <rect x="80" y="2" width="18" height="18" fill="#fff" />
        <rect x="83" y="5" width="12" height="12" />
        
        <rect x="0" y="78" width="22" height="22" />
        <rect x="2" y="78" width="18" height="18" fill="#fff" />
        <rect x="5" y="81" width="12" height="12" />
        
        <!-- Random QR Mock Bits -->
        <rect x="30" y="4" width="12" height="4" />
        <rect x="48" y="0" width="8" height="10" />
        <rect x="62" y="6" width="10" height="6" />
        <rect x="35" y="88" width="18" height="6" />
        <rect x="58" y="78" width="8" height="14" />
        <rect x="15" y="45" width="14" height="6" />
        <rect x="78" y="45" width="12" height="12" />
        <rect x="45" y="45" width="10" height="10" />
        <rect x="50" y="30" width="6" height="12" />
        <rect x="28" y="60" width="12" height="8" />
      </svg>
      <div style="position: absolute; width: 44px; height: 44px; background: #fff; display: flex; align-items: center; justify-content: center; padding: 2px; box-shadow: 0 2px 10px rgba(0,0,0,0.35); font-size: 1.5rem;">
        🌮
      </div>
    </div>
  `;
}

// --- 6. SIMULACIÓN DE ESCANEO DE QR (FLUJO DE 3 FASES) ---
let activeScanningTeamKey = null;
let activeScanningBillboardId = null;
let scanTimeout = null;

function startSimulatedScan(teamKey, billboardId) {
  console.log('startSimulatedScan called: team=' + teamKey + ', billboard=' + billboardId);
  
  if (state.hasVoted) {
    alert('Ya has registrado tu voto por ' + (teams[state.votedTaqueria]?.name || 'una taquería') + '. Solo se permite un voto por usuario en la demo.');
    return;
  }

  activeScanningTeamKey = teamKey;
  activeScanningBillboardId = billboardId;

  const modal = document.getElementById('scanner-modal');
  if (!modal) {
    console.error('scanner-modal not found!');
    return;
  }

  const wrapper = document.getElementById('scanner-viewport-wrapper');
  const screenScan = modal.querySelector('.scanner-screen-scan');
  const screenForm = document.getElementById('scanner-screen-form');
  const screenSuccess = modal.querySelector('.scanner-screen-success');
  const scanStatusText = document.getElementById('scanner-scan-status');
  const modalTitle = document.getElementById('scanner-modal-title');
  const modalFooter = document.getElementById('scanner-modal-footer');

  // Reset all screens
  wrapper.className = 'scanner-viewport-wrapper state-scanning';
  if (screenScan) screenScan.classList.remove('hidden');
  if (screenForm) screenForm.classList.add('hidden');
  if (screenSuccess) screenSuccess.classList.add('hidden');
  if (modalTitle) modalTitle.textContent = 'SIMULANDO ESCANEO DE QR';
  if (modalFooter) modalFooter.classList.remove('hidden');

  const team = teams[teamKey];
  if (scanStatusText) {
    scanStatusText.textContent = 'Apuntando al QR de ' + team.name + ' en el espectacular...';
  }

  renderTeamQRInScanner(teamKey);

  // Open modal
  modal.showModal();
  console.log('Modal opened successfully');
  playTacoSound('whistle');

  // Phase 1: Camera scanning for 1.5 seconds → then show form
  if (scanTimeout) clearTimeout(scanTimeout);
  scanTimeout = setTimeout(function() {
    scanTimeout = null;
    console.log('Scan phase complete, showing voting form');
    showVotingForm(teamKey);
  }, 1500);
}

function showVotingForm(teamKey) {
  console.log('showVotingForm called: team=' + teamKey);
  
  const modal = document.getElementById('scanner-modal');
  const wrapper = document.getElementById('scanner-viewport-wrapper');
  const screenScan = modal.querySelector('.scanner-screen-scan');
  const screenForm = document.getElementById('scanner-screen-form');
  const screenSuccess = modal.querySelector('.scanner-screen-success');
  const modalTitle = document.getElementById('scanner-modal-title');
  const modalFooter = document.getElementById('scanner-modal-footer');

  wrapper.className = 'scanner-viewport-wrapper state-form';
  if (screenScan) screenScan.classList.add('hidden');
  if (screenForm) screenForm.classList.remove('hidden');
  if (screenSuccess) screenSuccess.classList.add('hidden');
  if (modalTitle) modalTitle.textContent = 'REGISTRO DE VOTO B2C';
  if (modalFooter) modalFooter.classList.add('hidden');

  // Pre-select the taquería corresponding to the clicked button
  const selectEl = document.getElementById('vote-taqueria-select');
  if (selectEl) {
    selectEl.value = teamKey;
  }

  // Clear previous form data
  const nameEl = document.getElementById('vote-user-name');
  const emailEl = document.getElementById('vote-user-email');
  const phoneEl = document.getElementById('vote-user-phone');
  if (nameEl) nameEl.value = '';
  if (emailEl) emailEl.value = '';
  if (phoneEl) phoneEl.value = '';
}

function showScanSuccess(teamKey) {
  console.log('showScanSuccess called: team=' + teamKey);
  
  const modal = document.getElementById('scanner-modal');
  const wrapper = document.getElementById('scanner-viewport-wrapper');
  const screenScan = modal.querySelector('.scanner-screen-scan');
  const screenForm = document.getElementById('scanner-screen-form');
  const screenSuccess = modal.querySelector('.scanner-screen-success');
  const modalTitle = document.getElementById('scanner-modal-title');
  const modalFooter = document.getElementById('scanner-modal-footer');

  wrapper.className = 'scanner-viewport-wrapper state-success';
  if (screenScan) screenScan.classList.add('hidden');
  if (screenForm) screenForm.classList.add('hidden');
  if (screenSuccess) screenSuccess.classList.remove('hidden');
  if (modalTitle) modalTitle.textContent = '¡VOTO REGISTRADO!';
  if (modalFooter) modalFooter.classList.add('hidden');

  const team = teams[teamKey];
  const successLoc = document.getElementById('scanner-success-location');
  if (successLoc) {
    successLoc.textContent = 'Tu voto por ' + team.name + ' ha sido contabilizado exitosamente para la guía del Mundial.';
  }

  // Draw confirmation card
  const revealContainer = document.getElementById('modal-cromo-reveal');
  if (revealContainer) {
    revealContainer.innerHTML = `
      <div style="background: rgba(220, 38, 38, 0.1); border: 2.5px solid #dc2626; padding: 0.8rem; text-align: center;">
        <span style="font-size: 2.2rem; display: block; margin-bottom: 0.3rem;">🇲🇽 🌮 ⚽</span>
        <h4 style="font-size: 0.85rem; color: #ffd700; margin: 0; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">¡Guía del Sabor Desbloqueada!</h4>
        <p style="font-size: 0.72rem; color: #fff; margin: 0.25rem 0 0;">Has registrado tu voto por ${team.name} (${team.zone}).</p>
      </div>
    `;
  }

  playTacoSound('stadium');
  triggerConfettiExplosion();
}

function finalizeScan() {
  console.log('finalizeScan called');
  
  const modal = document.getElementById('scanner-modal');
  if (modal && modal.open) {
    modal.close();
  }

  // Save to state
  const teamKey = activeScanningTeamKey;
  if (teamKey && !state.hasVoted) {
    state.hasVoted = true;
    state.votedTaqueria = teamKey;
    state.liveVotes[teamKey] = (state.liveVotes[teamKey] || 0) + 1;
    
    saveCampaignState();
    
    // Scroll to map section
    const mapSection = document.getElementById('flavor-guide-dashboard');
    if (mapSection) {
      setTimeout(function() {
        mapSection.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }

    // Unlock the map
    unlockFlavorGuide(true);
    
    // Update billboard buttons
    updateBillboardButtons();
  }

  clearTimeoutsAndReset();
}

function clearTimeoutsAndReset() {
  if (scanTimeout) {
    clearTimeout(scanTimeout);
    scanTimeout = null;
  }
  activeScanningTeamKey = null;
  activeScanningBillboardId = null;
}

// --- 7. INTERACTIVIDAD DEL MAPA Y ESTADÍSTICAS ---
function unlockFlavorGuide(animate) {
  const overlay = document.getElementById('map-lock-overlay');
  if (overlay) {
    if (overlay.style.display === 'none') return;
    
    if (animate) {
      overlay.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      overlay.style.opacity = '0';
      overlay.style.transform = 'scale(0.96)';
      overlay.style.pointerEvents = 'none';
      setTimeout(function() {
        overlay.style.display = 'none';
      }, 600);
    } else {
      overlay.style.display = 'none';
    }
  }

  // Load ranking visualizations
  updateRankingDisplay();

  // Highlight the voted taquería or default (Compadre in Reforma)
  const pinToHighlight = state.votedTaqueria || 'compadre';
  selectMapPin(pinToHighlight);
}

function selectMapPin(key) {
  const team = teams[key];
  if (!team) return;

  // Remove selection from all pins
  document.querySelectorAll('.map-pin').forEach(function(pin) {
    pin.classList.remove('selected');
    const innerDot = pin.querySelector('circle:nth-child(2)');
    if (innerDot) {
      innerDot.setAttribute('r', '5');
    }
  });

  // Highlight active pin
  const activePin = document.getElementById('pin-' + key);
  if (activePin) {
    activePin.classList.add('selected');
    const innerDot = activePin.querySelector('circle:nth-child(2)');
    if (innerDot) {
      innerDot.setAttribute('r', '7.5');
    }
  }

  // Update tooltip card
  const tooltipCard = document.getElementById('map-tooltip-card');
  const titleEl = document.getElementById('tooltip-title');
  const zoneEl = document.getElementById('tooltip-zone');
  const factEl = document.getElementById('tooltip-fact');
  const votesEl = document.getElementById('tooltip-votes');

  if (tooltipCard && titleEl && zoneEl && factEl && votesEl) {
    titleEl.textContent = team.name;
    zoneEl.textContent = team.zone.toUpperCase();

    // Change badge color per taquería
    var badgeColor = '#dc2626';
    if (key === 'cocuyos') badgeColor = '#eab308';
    if (key === 'turix') badgeColor = '#16a34a';
    if (key === 'chupacabras') badgeColor = '#ca8a04';
    if (key === 'manolo') badgeColor = '#2563eb';
    zoneEl.style.background = badgeColor;

    factEl.innerHTML = team.fact + '<br><strong style="color: #ffd700; display: block; margin-top: 0.3rem;">🏟️ Estadio Azteca: ' + team.distance + '</strong>';
    
    var votesVal = state.liveVotes[key] || team.baseVotes;
    votesEl.textContent = votesVal.toLocaleString();

    tooltipCard.classList.remove('hidden');
    tooltipCard.style.opacity = '1';
    tooltipCard.style.transform = 'translateY(0)';
    tooltipCard.style.pointerEvents = 'auto';
  }

  // Highlight matching ranking row
  document.querySelectorAll('.ranking-row').forEach(function(row) {
    row.classList.remove('active');
    row.style.borderColor = 'rgba(255, 255, 255, 0.05)';
    row.style.background = 'rgba(0, 0, 0, 0.2)';
  });

  var activeRow = document.getElementById('ranking-row-' + key);
  if (activeRow) {
    activeRow.classList.add('active');
    var borderCol = 'rgba(220, 38, 38, 0.4)';
    var bgCol = 'rgba(220, 38, 38, 0.05)';
    if (key === 'cocuyos') { borderCol = 'rgba(234, 179, 8, 0.4)'; bgCol = 'rgba(234, 179, 8, 0.05)'; }
    if (key === 'turix') { borderCol = 'rgba(22, 163, 74, 0.4)'; bgCol = 'rgba(22, 163, 74, 0.05)'; }
    if (key === 'chupacabras') { borderCol = 'rgba(202, 138, 4, 0.4)'; bgCol = 'rgba(202, 138, 4, 0.05)'; }
    if (key === 'manolo') { borderCol = 'rgba(37, 99, 235, 0.4)'; bgCol = 'rgba(37, 99, 235, 0.05)'; }

    activeRow.style.borderColor = borderCol;
    activeRow.style.background = bgCol;
  }

  // Update tourist tip
  var tipContent = document.getElementById('tourist-tip-content');
  if (tipContent) {
    tipContent.innerHTML = '<strong>Guía del Mundial:</strong> ¿Vas al Estadio Azteca? El trayecto desde <strong>' + team.name + '</strong> (' + team.zone + ') es de aproximadamente <strong>' + team.distance + '</strong>. ¡Prueba su especialidad hoy!';
  }
}

function updateRankingDisplay() {
  var maxScaleVal = 20000;
  var container = document.getElementById('ranking-list-container');
  if (!container) return;

  // Sort taquerías by votes descending
  var sortedKeys = Object.keys(state.liveVotes).sort(function(a, b) {
    return state.liveVotes[b] - state.liveVotes[a];
  });
  
  container.innerHTML = '';

  sortedKeys.forEach(function(key, index) {
    var team = teams[key];
    if (!team) return;

    var rankNum = index + 1;
    var votesVal = state.liveVotes[key];
    
    var barColor = '#dc2626';
    var rankColor = '#ffd700'; // Gold for #1
    if (rankNum === 2) { barColor = '#eab308'; rankColor = '#bbb'; }
    if (rankNum === 3) { barColor = '#16a34a'; rankColor = '#92400e'; }
    if (rankNum > 3) { barColor = '#2563eb'; rankColor = '#888'; }

    var row = document.createElement('div');
    row.id = 'ranking-row-' + key;
    row.className = 'ranking-row' + (state.votedTaqueria === key ? ' user-voted-row' : '');
    row.style.cssText = 'padding: 0.45rem 0.6rem; display: flex; align-items: center; gap: 0.6rem; border: 1px solid rgba(255, 255, 255, 0.05); background: rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.2s;';

    row.innerHTML = 
      '<div class="ranking-num" style="font-size: 0.95rem; font-weight: 900; color: ' + rankColor + '; font-family: monospace; width: 18px;">' + rankNum + '</div>' +
      '<div class="ranking-body" style="flex: 1;">' +
        '<div style="display: flex; justify-content: space-between; font-size: 0.72rem; font-weight: bold; color: #fff; margin-bottom: 0.15rem;">' +
          '<span>' + team.name + ' (' + team.zone + ') ' + (state.votedTaqueria === key ? '⭐' : '') + '</span>' +
          '<span id="rank-votes-' + key + '" style="font-family: monospace; color: ' + rankColor + ';">' + votesVal.toLocaleString() + ' votos</span>' +
        '</div>' +
        '<div class="ranking-bar-track" style="height: 6px; background: rgba(255,255,255,0.06); width: 100%;">' +
          '<div class="ranking-bar-fill" id="bar-fill-' + key + '" style="width: ' + ((votesVal / maxScaleVal) * 100) + '%; height: 100%; background: ' + barColor + '; transition: width 0.8s ease;"></div>' +
        '</div>' +
      '</div>';

    row.addEventListener('click', function() {
      selectMapPin(key);
    });

    container.appendChild(row);
  });
}

function updateBillboardButtons() {
  document.querySelectorAll('.scan-trigger-btn').forEach(function(btn) {
    var teamKey = btn.getAttribute('data-team');
    if (!teamKey) return;

    if (state.hasVoted) {
      btn.disabled = true;
      if (state.votedTaqueria === teamKey) {
        btn.textContent = '✅ Votado por ti 🌮';
        btn.style.background = '#10b981';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#fff';
      } else {
        btn.textContent = 'Voto Registrado 🔒';
        btn.style.background = '#333';
        btn.style.borderColor = '#333';
        btn.style.color = '#777';
      }
    } else {
      btn.disabled = false;
      btn.style.background = '#dc2626';
      btn.style.borderColor = '#dc2626';
      btn.style.color = '#fff';
      if (teamKey === 'compadre') {
        btn.textContent = 'Escanear y Registrar Voto 🌮';
      } else {
        btn.textContent = 'Escanear y Votar 🌮';
      }
    }
  });
}

// --- 8. DIALOG CLOSING (JS FALLBACK FOR CROSS-BROWSER) ---
function setupDialogSafeClosing() {
  // Close button handler (commandfor/command polyfill)
  document.addEventListener('click', function(e) {
    var closeBtn = e.target.closest('.modal-close-btn');
    if (closeBtn) {
      e.preventDefault();
      var dialogId = closeBtn.getAttribute('commandfor');
      if (dialogId) {
        var dialog = document.getElementById(dialogId);
        if (dialog && dialog.open) {
          dialog.close();
        }
      }
    }
  });

  // Click outside dialog to close (backdrop click)
  document.querySelectorAll('dialog').forEach(function(dialog) {
    dialog.addEventListener('click', function(e) {
      var rect = dialog.getBoundingClientRect();
      var isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        dialog.close();
      }
    });
  });
}

// --- 9. EVENT LISTENERS ---
function setupEventListeners() {
  console.log('setupEventListeners: Initializing...');

  // ===== DIRECT CLICK HANDLERS ON EACH SCAN BUTTON (BULLETPROOF) =====
  try {
    var scanButtons = document.querySelectorAll('.scan-trigger-btn');
    console.log('Found ' + scanButtons.length + ' scan-trigger-btn elements');
    
    scanButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (btn.disabled) {
          console.log('Button is disabled, ignoring click');
          return;
        }

        var teamKey = btn.getAttribute('data-team');
        var billboardId = btn.getAttribute('data-billboard');
        console.log('DIRECT click on scan button: team=' + teamKey + ', billboard=' + billboardId);
        
        if (teamKey && billboardId) {
          startSimulatedScan(teamKey, billboardId);
        } else {
          console.error('Missing data attributes on button:', btn);
        }
      });
    });
  } catch (err) {
    console.error('Error setting up direct click listeners:', err);
  }

  // ===== DELEGATED FALLBACK LISTENER =====
  document.addEventListener('click', function(e) {
    try {
      var scanBtn = e.target.closest('.scan-trigger-btn');
      if (scanBtn && !scanBtn.disabled) {
        var teamKey = scanBtn.getAttribute('data-team');
        var billboardId = scanBtn.getAttribute('data-billboard');
        console.log('DELEGATED click caught: team=' + teamKey + ', billboard=' + billboardId);
        
        if (teamKey && billboardId && activeScanningTeamKey !== teamKey) {
          startSimulatedScan(teamKey, billboardId);
        }
      }
    } catch (err) {
      console.error('Error in delegated click listener:', err);
    }
  });

  // ===== FORM SUBMIT HANDLER =====
  var votingForm = document.getElementById('tacos-voting-form');
  if (votingForm) {
    console.log('Attaching submit handler to voting form');
    votingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Form submitted');
      
      var selectEl = document.getElementById('vote-taqueria-select');
      var nameEl = document.getElementById('vote-user-name');
      var emailEl = document.getElementById('vote-user-email');
      var phoneEl = document.getElementById('vote-user-phone');

      if (!selectEl || !nameEl || !emailEl || !phoneEl) {
        console.error('Form elements not found');
        return;
      }

      var taqueriaKey = selectEl.value;
      var userName = nameEl.value.trim();
      var userEmail = emailEl.value.trim();
      var userPhone = phoneEl.value.trim();

      if (!userName || !userEmail || !userPhone) {
        alert('Por favor completa todos los campos del formulario.');
        return;
      }

      // Save vote details
      state.votedDetails = {
        name: userName,
        email: userEmail,
        phone: userPhone
      };
      
      // Update active scan key if they changed dropdown
      activeScanningTeamKey = taqueriaKey;

      console.log('Vote submitted for: ' + taqueriaKey);
      showScanSuccess(taqueriaKey);
    });
  } else {
    console.error('tacos-voting-form not found!');
  }

  // ===== "REVEAL MAP" CONTINUE BUTTON =====
  var continueBtn = document.getElementById('modal-continue-btn');
  if (continueBtn) {
    console.log('Attaching click handler to continue button');
    continueBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Continue button clicked — finalizing scan');
      finalizeScan();
    });
  }

  // ===== SCANNER MODAL CLOSE HANDLER =====
  var scannerModal = document.getElementById('scanner-modal');
  if (scannerModal) {
    scannerModal.addEventListener('close', function() {
      console.log('Scanner modal closed');
      if (scanTimeout) {
        clearTimeout(scanTimeout);
        scanTimeout = null;
      }
    });
  }

  // ===== INTERACTIVE MAP PINS =====
  document.querySelectorAll('.map-pin').forEach(function(pin) {
    pin.addEventListener('click', function() {
      var pinId = pin.getAttribute('id');
      if (pinId) {
        var key = pinId.replace('pin-', '');
        selectMapPin(key);
      }
    });
  });

  // ===== RESET CAMPAIGN BUTTON =====
  var resetBtn = document.getElementById('reset-campaign');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (confirm('¿Deseas reiniciar la simulación de votación y volver a bloquear la Guía del Sabor?')) {
        state.hasVoted = false;
        state.votedTaqueria = '';
        state.votedDetails = { name: '', email: '', phone: '' };
        state.liveVotes = {
          compadre: 18450,
          cocuyos: 16120,
          chupacabras: 15840,
          turix: 14930,
          manolo: 13750
        };
        
        saveCampaignState();
        
        // Re-lock map
        var overlay = document.getElementById('map-lock-overlay');
        if (overlay) {
          overlay.style.display = 'flex';
          overlay.style.opacity = '1';
          overlay.style.transform = '';
          overlay.style.pointerEvents = 'auto';
        }

        // Hide tooltip
        var tooltip = document.getElementById('map-tooltip-card');
        if (tooltip) {
          tooltip.classList.add('hidden');
          tooltip.style.opacity = '0';
        }

        updateRankingDisplay();
        updateBillboardButtons();
        
        console.log('Campaign reset complete');
      }
    });
  }

  console.log('setupEventListeners: Complete');
}

// --- 10. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded: Initializing Guía del Sabor CDMX');
  
  loadCampaignState();
  
  updateRankingDisplay();
  updateBillboardButtons();
  
  if (state.hasVoted) {
    // Unlock immediately if already voted (persistence)
    unlockFlavorGuide(false);
  }
  
  setupEventListeners();
  setupDialogSafeClosing();
  
  console.log('Initialization complete. hasVoted=' + state.hasVoted + ', votedTaqueria=' + state.votedTaqueria);
});

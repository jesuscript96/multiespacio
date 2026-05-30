// JavaScript - Campaña Copa Taquera Publimex 2026
// PUBLIMEX Digital OOH - Propuesta C: Impacto Social B2C

// Global error handler for debugging in-browser errors
window.onerror = function(message, source, lineno, colno, error) {
  alert("GLOBAL JS ERROR: " + message + " at " + source + ":" + lineno + ":" + colno);
  return false;
};

// --- 1. CONFIGURACIÓN Y ESTADO DE LA CAMPAÑA ---
const TACO_CAMPAIGN_KEY = 'publimex_tacos_campaign_v2';

let state = {
  scannedTeams: [], // Llaves de taquerías votadas (ej. 'compadre', 'cocuyos')
  claimedAlbum: false,
  validatedCodes: []
};

// Detalle de las 10 taquerías de la CDMX
const teams = {
  compadre: {
    name: 'Tacos El Compadre',
    flag: '🌮',
    code: 'COM',
    primaryColor: '#dc2626', // Rojo
    secondaryColor: '#facc15', // Oro
    shiny: true, // Super estrella (mockup principal)
    fact: 'Tradición y sabor al pastor en Reforma 222. ¡Un clásico del barrio!',
    baseVotes: 18450
  },
  borrego: {
    name: 'El Borrego Viudo',
    flag: '🌮',
    code: 'BOR',
    primaryColor: '#7c3aed', // Morado
    secondaryColor: '#ffffff', // Blanco
    shiny: false,
    fact: 'Legendarios tacos al pastor en Tacubaya, servidos directo al auto 24/7.',
    baseVotes: 12410
  },
  cocuyos: {
    name: 'Tacos Los Cocuyos',
    flag: '🌮',
    code: 'COC',
    primaryColor: '#ea580c', // Naranja
    secondaryColor: '#ffffff', // Blanco
    shiny: true, // Super estrella (Polanco)
    fact: 'Exquisitos tacos de suadero y cabeza en el Centro Histórico y Polanco.',
    baseVotes: 16120
  },
  hola: {
    name: 'Tacos Hola El Güero',
    flag: '🌮',
    code: 'GUE',
    primaryColor: '#db2777', // Rosa
    secondaryColor: '#ffffff', // Blanco
    shiny: false,
    fact: 'Guisados auténticos en la Condesa, el secreto mejor guardado de los locales.',
    baseVotes: 11840
  },
  chupacabras: {
    name: 'El Chupacabras',
    flag: '🌮',
    code: 'CHU',
    primaryColor: '#ca8a04', // Dorado Oscuro
    secondaryColor: '#1e293b', // Gris oscuro
    shiny: true, // Super estrella (Roma)
    fact: 'Famosos tacos campechanos y barra ilimitada de salsas bajo el puente en Coyoacán.',
    baseVotes: 15840
  },
  califa: {
    name: 'Tacos El Califa',
    flag: '🌮',
    code: 'CAL',
    primaryColor: '#0d9488', // Teal
    secondaryColor: '#facc15', // Oro
    shiny: false,
    fact: 'Tacos gourmet de bistec y gaoneras con salsas de molcajete de alta calidad.',
    baseVotes: 10980
  },
  turix: {
    name: 'Taquería El Turix',
    flag: '🌮',
    code: 'TUR',
    primaryColor: '#16a34a', // Verde
    secondaryColor: '#ffffff', // Blanco
    shiny: true, // Super estrella (Condesa)
    fact: 'Auténtica cochinita pibil de Yucatán en panuchos y tacos en la Condesa.',
    baseVotes: 14930
  },
  orinoco: {
    name: 'Taquería Orinoco',
    flag: '🌮',
    code: 'ORI',
    primaryColor: '#e11d48', // Carmesí
    secondaryColor: '#ffffff', // Blanco
    shiny: false,
    fact: 'Tacos estilo Monterrey de chicharrón norteño y trompo en la Roma Norte.',
    baseVotes: 12890
  },
  manolo: {
    name: 'Tacos Manolo',
    flag: '🌮',
    code: 'MAN',
    primaryColor: '#2563eb', // Azul
    secondaryColor: '#ffffff', // Blanco
    shiny: true, // Super estrella (Santa Fe)
    fact: 'El sabor inigualable de las gringas Manolo y salsa de ajo en la Narvarte y Santa Fe.',
    baseVotes: 13750
  },
  huequito: {
    name: 'Tacos El Huequito',
    flag: '🌮',
    code: 'HUE',
    primaryColor: '#4f46e5', // Índigo
    secondaryColor: '#ffffff', // Blanco
    shiny: false,
    fact: 'Pioneros en el pastor gourmet enrollado en el Centro desde 1959.',
    baseVotes: 11950
  }
};

// Generar visual de sellos tradicionales de taquería
function getShieldSVG(teamKey) {
  const team = teams[teamKey];
  const pCol = team.primaryColor;
  const sCol = team.secondaryColor;

  let details = '';

  switch(teamKey) {
    case 'compadre':
      // Red plate with a golden chef hat
      details = `
        <circle cx="0" cy="0" r="16" fill="${pCol}" />
        <path d="M-6,2 L6,2 L8,6 L-8,6 Z" fill="${sCol}" />
        <path d="M-6,0 C-10,-4 -6,-10 0,-10 C6,-10 10,-4 6,0 Z" fill="#ffffff" />
      `;
      break;
    case 'cocuyos':
      // Taco shell with filling
      details = `
        <circle cx="0" cy="0" r="16" fill="${pCol}" />
        <path d="M-10,0 C-10,-8 10,-8 10,0 Z" fill="#eab308" />
        <circle cx="-3" cy="-3" r="2.5" fill="#15803d" />
        <circle cx="3" cy="-2" r="2" fill="#b91c1c" />
        <path d="M-11,1 L11,1 L11,3 L-11,3 Z" fill="#ffffff" />
      `;
      break;
    case 'chupacabras':
      // Mysterious eyes / creature silhouette
      details = `
        <circle cx="0" cy="0" r="16" fill="${pCol}" />
        <path d="M-8,-4 L-2,-4 L-5,2 Z" fill="#10b981" />
        <path d="M8,-4 L2,-4 L5,2 Z" fill="#10b981" />
        <path d="M-8,6 Q0,12 8,6 Z" fill="#b91c1c" />
      `;
      break;
    case 'turix':
      // Green and white shield representing Yucatan
      details = `
        <rect x="-15" y="-15" width="30" height="30" fill="${pCol}" />
        <path d="M-10,-10 L10,-10 L10,10 L-10,10 Z" fill="#ffffff" />
        <circle cx="0" cy="0" r="6" fill="#eab308" />
      `;
      break;
    case 'manolo':
      // Blue plate with pastor trompo
      details = `
        <circle cx="0" cy="0" r="16" fill="${pCol}" />
        <path d="M-8,-8 L8,-8 L4,6 L-4,6 Z" fill="#f97316" />
        <path d="M-2,6 L2,6 L2,10 L-2,10 Z" fill="#78350f" />
        <circle cx="0" cy="-10" r="3" fill="#eab308" />
      `;
      break;
    default:
      // A default taco shape inside a colored circle
      details = `
        <circle cx="0" cy="0" r="16" fill="${pCol}" />
        <path d="M-8,2 C-8,-4 8,-4 8,2 Z" fill="#facc15" />
        <circle cx="-2" cy="-1" r="1.5" fill="#16a34a" />
        <circle cx="2" cy="-2" r="1.5" fill="#dc2626" />
      `;
  }

  return `
    <svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
      <!-- Shield Base -->
      <path d="M 50,5 C 80,5 95,12 95,45 C 95,78 50,95 50,95 C 50,95 5,78 5,45 C 5,12 20,5 50,5 Z" 
            fill="#121214" stroke="${team.shiny ? '#ffd700' : 'rgba(255,255,255,0.15)'}" stroke-width="3" />
      
      <!-- Inner background plate -->
      <path d="M 50,10 C 76,10 90,16 90,45 C 90,75 50,90 50,90 C 50,90 10,75 10,45 C 10,16 24,10 50,10 Z" 
            fill="rgba(255,255,255,0.02)" />

      <!-- Center Logo Details -->
      <g transform="translate(50, 48) scale(1.8)">
        ${details}
      </g>
      
      <!-- Inner Shield Border -->
      <path d="M 50,15 C 75,15 85,20 85,45 C 85,75 50,90 50,90 C 50,90 15,75 15,45 C 15,20 25,15 50,15 Z" 
            fill="none" stroke="${team.shiny ? '#ffd700' : 'rgba(255,255,255,0.2)'}" stroke-width="2" />
    </svg>
  `;
}

// Generar visual de código QR de taquería para el escáner (diseño protagonista)
function renderTeamQRInScanner(teamKey) {
  const container = document.getElementById('scanner-qr-display');
  if (!container) return;
  
  container.innerHTML = `
    <div style="position: relative; width: 140px; height: 140px; background: #fff; padding: 8px; border-radius: 0; box-shadow: 0 4px 20px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;">
      <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; fill: #000; border-radius: 0;">
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
      <div style="position: absolute; width: 56px; height: 56px; background: #fff; border-radius: 0; display: flex; align-items: center; justify-content: center; padding: 2px; box-shadow: 0 2px 10px rgba(0,0,0,0.35);">
        ${getShieldSVG(teamKey)}
      </div>
    </div>
  `;
}

// Generar código de pasaporte único
function generateAlbumCode() {
  const seed = (localStorage.getItem('publimex_tacos_seed') || Math.random().toString(36).substring(2, 6).toUpperCase());
  localStorage.setItem('publimex_tacos_seed', seed);
  return `PUBLIMEX-TACO-${seed}9`;
}

// --- 2. PERSISTENCIA DE ESTADO ---
function loadCampaignState() {
  const localData = localStorage.getItem(TACO_CAMPAIGN_KEY);
  if (localData) {
    try {
      state = JSON.parse(localData);
      if (!state.scannedTeams) state.scannedTeams = [];
      if (state.claimedAlbum === undefined) state.claimedAlbum = false;
      if (!state.validatedCodes) state.validatedCodes = [];
    } catch(e) {
      console.error('Error al parsear estado local:', e);
    }
  }
}

function saveCampaignState() {
  localStorage.setItem(TACO_CAMPAIGN_KEY, JSON.stringify(state));
}

// --- 3. CONFIGURACIÓN DE AUDIO SINTETIZADO (Web Audio API) ---
function playTacoSound(type) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    if (type === 'whistle') {
      // Bell chime/Chop sound when scanning starts
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
      // Mexican jarabe-like chime / Triad arpeggio
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
    } else if (type === 'paste') {
      // Sticker pasting sound
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, now);
      filter.Q.setValueAtTime(3.5, now);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      noise.start(now);
      noise.stop(now + 0.15);
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    console.warn('AudioContext no soportado o bloqueado por el navegador.', e);
  }
}

// --- 4. ANIMACIONES ---
function injectSoccerStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .confetti-piece {
      position: absolute;
      width: 10px;
      height: 10px;
      top: -10px;
      opacity: 0.8;
      border-radius: 0;
      z-index: 1000;
      animation: fall linear forwards;
    }
    @keyframes fall {
      to {
        transform: translateY(105vh) rotate(360deg);
      }
    }
    .animate-paste {
      animation: pasteFlash 0.5s ease-out;
    }
    @keyframes pasteFlash {
      0% {
        transform: scale(1.3) rotate(-5deg);
        box-shadow: 0 0 40px rgba(239, 68, 68, 0.8);
        filter: brightness(1.8);
      }
      100% {
        transform: scale(1) rotate(0deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        filter: brightness(1);
      }
    }
  `;
  document.head.appendChild(style);
}

function triggerConfettiExplosion() {
  const container = document.body;
  const colors = ['#dc2626', '#facc15', '#16a34a', '#ffffff', '#2563eb'];
  
  for (let i = 0; i < 70; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    const size = 6 + Math.random() * 8;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    
    const delay = Math.random() * 2.0;
    confetti.style.animationDelay = `${delay}s`;
    
    const duration = 2.0 + Math.random() * 2.5;
    confetti.style.animationDuration = `${duration}s`;
    
    container.appendChild(confetti);

    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, (duration + delay) * 1000);
  }
}

// --- 5. RENDERIZACIÓN DINÁMICA DEL PASAPORTE (2x5) ---
function renderAlbumGrid() {
  const grid = document.getElementById('album-cromo-grid');
  if (!grid) return;

  grid.innerHTML = '';
  
  const teamKeys = Object.keys(teams);
  
  teamKeys.forEach((key, index) => {
    const team = teams[key];
    const isUnlocked = state.scannedTeams.includes(key);
    const numDisplay = String(index + 1).padStart(2, '0');
    
    // Crear ranura del pasaporte (hollow slot)
    const slot = document.createElement('div');
    slot.id = `slot-${key}`;
    slot.className = 'album-slot';
    slot.style.borderRadius = '0';
    slot.innerHTML = `
      <span class="album-slot-num">${numDisplay}</span>
      <div class="album-slot-shield-placeholder">
        ${getShieldSVG(key)}
      </div>
      <span class="album-slot-team-name">${team.name}</span>
    `;

    // Si ya está desbloqueado, pegarle el sello dorado real encima
    if (isUnlocked) {
      const cromo = document.createElement('div');
      cromo.className = `real-cromo ${team.shiny ? 'shiny-foil' : ''}`;
      cromo.style.borderRadius = '0';
      
      // Rotación estática para efecto realista
      const rotationAngle = (index % 3 === 0) ? 0.7 : (index % 2 === 0) ? -0.5 : 0.3;
      cromo.style.transform = `rotate(${rotationAngle}deg)`;
      
      cromo.innerHTML = `
        <span class="real-cromo-badge" style="border-radius: 0;">${team.shiny ? '⭐ Gran Sello' : 'Sello'}</span>
        <div class="real-cromo-shield">
          ${getShieldSVG(key)}
        </div>
        <div class="real-cromo-footer">
          <span class="real-cromo-flag">${team.flag}</span>
          <span class="real-cromo-name">${team.name}</span>
        </div>
      `;
      slot.appendChild(cromo);
    } else {
      // Click en la casilla vacía desplaza al espectacular correspondiente
      slot.addEventListener('click', () => {
        let billboardId = 'main';
        if (key === 'compadre' || key === 'borrego') billboardId = 'main';
        else if (key === 'cocuyos' || key === 'hola') billboardId = 2;
        else if (key === 'chupacabras' || key === 'califa') billboardId = 3;
        else if (key === 'turix' || key === 'orinoco') billboardId = 4;
        else if (key === 'manolo' || key === 'huequito') billboardId = 5;

        const targetId = billboardId === 'main' ? 'visual-showcase' : 'demo-simulator';
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
        
        // Destello visual en el botón de la valla correspondiente
        setTimeout(() => {
          startSimulatedScan(key, billboardId);
        }, 500);
      });
    }

    grid.appendChild(slot);
  });
}

// --- 6. SIMULACIÓN DE ESCANEO DE QR ---
let activeScanningTeamKey = null;
let activeScanningBillboardId = null;
let scanTimeout = null;
let scanSuccessTimeout = null;
let hasRegisteredActiveScan = false;

function startSimulatedScan(teamKey, billboardId) {
  if (state.scannedTeams.includes(teamKey)) {
    alert(`Ya has registrado tu voto y sello de ${teams[teamKey].name} en tu pasaporte.`);
    return;
  }

  activeScanningTeamKey = teamKey;
  activeScanningBillboardId = billboardId;
  hasRegisteredActiveScan = false;

  const modal = document.getElementById('scanner-modal');
  const wrapper = document.getElementById('scanner-viewport-wrapper');
  const screenScan = modal.querySelector('.scanner-screen-scan');
  const screenSuccess = modal.querySelector('.scanner-screen-success');
  const scanStatusText = document.getElementById('scanner-scan-status');
  const modalTitle = document.getElementById('scanner-modal-title');
  const modalFooter = document.getElementById('scanner-modal-footer');

  // Ajustar apariencia brutalista sin border radius
  wrapper.className = 'scanner-viewport-wrapper state-scanning';
  screenScan.classList.remove('hidden');
  screenSuccess.classList.add('hidden');
  modalTitle.textContent = 'SIMULANDO ESCANEO DE QR';
  modalFooter.classList.remove('hidden');

  const team = teams[teamKey];
  scanStatusText.textContent = `Apuntando al QR de ${team.name} en el espectacular...`;

  // Dibujar el QR personalizado
  renderTeamQRInScanner(teamKey);

  modal.showModal();
  playTacoSound('whistle');

  // Fase 1: Enfoque de cámara por 1.5 segundos
  scanTimeout = setTimeout(() => {
    scanTimeout = null;
    showVotingForm(teamKey);
  }, 1500);
}

function showVotingForm(teamKey) {
  const modal = document.getElementById('scanner-modal');
  const wrapper = document.getElementById('scanner-viewport-wrapper');
  const screenScan = modal.querySelector('.scanner-screen-scan');
  const screenForm = document.getElementById('scanner-screen-form');
  const screenSuccess = modal.querySelector('.scanner-screen-success');
  const modalTitle = document.getElementById('scanner-modal-title');
  const modalFooter = document.getElementById('scanner-modal-footer');

  wrapper.className = 'scanner-viewport-wrapper state-form';
  screenScan.classList.add('hidden');
  if (screenForm) screenForm.classList.remove('hidden');
  screenSuccess.classList.add('hidden');
  modalTitle.textContent = 'REGISTRO DE VOTO B2C';
  modalFooter.classList.add('hidden');

  // Pre-seleccionar la taquería correspondiente al botón clickeado
  const selectEl = document.getElementById('vote-taqueria-select');
  if (selectEl) {
    selectEl.value = teamKey;
  }

  // Limpiar campos anteriores del formulario
  document.getElementById('vote-user-name').value = '';
  document.getElementById('vote-user-email').value = '';
  document.getElementById('vote-user-phone').value = '';
}

function showScanSuccess(teamKey) {
  const modal = document.getElementById('scanner-modal');
  const wrapper = document.getElementById('scanner-viewport-wrapper');
  const screenScan = modal.querySelector('.scanner-screen-scan');
  const screenForm = document.getElementById('scanner-screen-form');
  const screenSuccess = modal.querySelector('.scanner-screen-success');
  const modalTitle = document.getElementById('scanner-modal-title');
  const modalFooter = document.getElementById('scanner-modal-footer');

  wrapper.className = 'scanner-viewport-wrapper state-success';
  screenScan.classList.add('hidden');
  if (screenForm) screenForm.classList.add('hidden');
  screenSuccess.classList.remove('hidden');
  modalTitle.textContent = '¡VOTO Y SELLO REGISTRADO!';
  modalFooter.classList.add('hidden');

  const team = teams[teamKey];
  document.getElementById('scanner-success-location').textContent = team.fact;

  // Llenar el visor con el sello de la taquería
  const revealContainer = document.getElementById('modal-cromo-reveal');
  revealContainer.className = 'modal-cromo-card';
  revealContainer.style.borderRadius = '0';
  
  revealContainer.innerHTML = `
    <div class="real-cromo ${team.shiny ? 'shiny-foil' : ''}" style="width:120px; height:160px; margin:0 auto; cursor:default; transform:rotate(-1deg); border-radius: 0;">
      <span class="real-cromo-badge" style="border-radius: 0;">${team.shiny ? '⭐ Gran Sello' : 'Sello'}</span>
      <div class="real-cromo-shield">
        ${getShieldSVG(teamKey)}
      </div>
      <div class="real-cromo-footer">
        <span class="real-cromo-flag">${team.flag}</span>
        <span class="real-cromo-name">${team.name}</span>
      </div>
    </div>
  `;

  // Total acumulado
  const currentTotal = state.scannedTeams.length + 1;
  document.getElementById('modal-progress-text').textContent = `${currentTotal} / 10 Sellos`;

  playTacoSound('stadium');
}

function triggerStickerPastingAnimation(teamKey, callback) {
  const targetSlot = document.getElementById(`slot-${teamKey}`);
  const revealCromo = document.querySelector('#modal-cromo-reveal .real-cromo');
  const flyingSticker = document.getElementById('flying-sticker-effect');
  
  if (!targetSlot || !revealCromo || !flyingSticker) {
    callback();
    return;
  }

  // Obtener posiciones iniciales y finales absolutas en la página
  const startRect = revealCromo.getBoundingClientRect();
  const endRect = targetSlot.getBoundingClientRect();

  const startLeft = startRect.left + window.scrollX;
  const startTop = startRect.top + window.scrollY;
  const endLeft = endRect.left + window.scrollX;
  const endTop = endRect.top + window.scrollY;

  // Clonar el sello
  flyingSticker.innerHTML = revealCromo.innerHTML;
  flyingSticker.className = `real-cromo ${teams[teamKey].shiny ? 'shiny-foil' : ''}`;
  flyingSticker.style.borderRadius = '0';
  
  flyingSticker.style.position = 'absolute';
  flyingSticker.style.left = `${startLeft}px`;
  flyingSticker.style.top = `${startTop}px`;
  flyingSticker.style.width = `${startRect.width}px`;
  flyingSticker.style.height = `${startRect.height}px`;
  flyingSticker.style.margin = '0';
  flyingSticker.style.transform = 'scale(1) rotate(-1deg)';
  flyingSticker.style.opacity = '1';
  flyingSticker.classList.remove('hidden');

  // Cerrar modal
  document.getElementById('scanner-modal').close();

  // Scroll al pasaporte
  document.getElementById('demo-simulator').scrollIntoView({ behavior: 'smooth' });

  // Iniciar transición
  setTimeout(() => {
    flyingSticker.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    flyingSticker.style.left = `${endLeft}px`;
    flyingSticker.style.top = `${endTop}px`;
    flyingSticker.style.width = `${endRect.width}px`;
    flyingSticker.style.height = `${endRect.height}px`;
    flyingSticker.style.transform = 'scale(1) rotate(0.6deg)';
  }, 100);

  // Finalizar animación
  setTimeout(() => {
    playTacoSound('paste');
    
    // Ocultar clon volador
    flyingSticker.classList.add('hidden');
    flyingSticker.style.transition = '';
    
    callback();

    // Destello de sello pegado
    const newlyPastedCromo = targetSlot.querySelector('.real-cromo');
    if (newlyPastedCromo) {
      newlyPastedCromo.classList.add('animate-paste');
    }
  }, 950);
}

function finalizeScan() {
  if (hasRegisteredActiveScan) return;
  hasRegisteredActiveScan = true;

  const teamKey = activeScanningTeamKey;
  clearTimeoutsAndReset();

  const registerStateChange = () => {
    if (teamKey && !state.scannedTeams.includes(teamKey)) {
      state.scannedTeams.push(teamKey);
      saveCampaignState();
      
      renderAlbumGrid();
      updateUI();
      animateDashboardStats();

      // Confeti de campeón si completa los 10 sellos
      const count = state.scannedTeams.length;
      if (count === 10) {
        setTimeout(() => {
          triggerConfettiExplosion();
          playTacoSound('stadium');
          openRewardModal();
        }, 800);
      }
    }
  };

  // Disparar animación
  triggerStickerPastingAnimation(teamKey, registerStateChange);
}

function clearTimeoutsAndReset() {
  if (scanTimeout) {
    clearTimeout(scanTimeout);
    scanTimeout = null;
  }
  if (scanSuccessTimeout) {
    clearTimeout(scanSuccessTimeout);
    scanSuccessTimeout = null;
  }
  activeScanningTeamKey = null;
  activeScanningBillboardId = null;

  // Reset modal screen visibilities
  const modal = document.getElementById('scanner-modal');
  if (modal) {
    const screenScan = modal.querySelector('.scanner-screen-scan');
    const screenForm = document.getElementById('scanner-screen-form');
    const screenSuccess = modal.querySelector('.scanner-screen-success');
    if (screenScan) screenScan.classList.remove('hidden');
    if (screenForm) screenForm.classList.add('hidden');
    if (screenSuccess) screenSuccess.classList.add('hidden');
  }
}

// --- 7. APERTURA DE CUPÓN DE RECOMPENSA ---
function openRewardModal() {
  const code = generateAlbumCode();
  
  document.getElementById('reward-wallet-code').textContent = code;
  document.getElementById('reward-wallet-barcode-txt').textContent = code;
  
  const modal = document.getElementById('reward-modal');
  modal.showModal();
}

// --- 8. SINCRONIZACIÓN DE INTERFAZ (UI) ---
function updateUI() {
  const count = state.scannedTeams.length;
  
  // 1. Contador del pasaporte
  const countDisplay = document.getElementById('cromos-count');
  if (countDisplay) {
    countDisplay.textContent = count;
  }

  // 2. Mover el progreso circular
  const progressRing = document.getElementById('soccer-progress-ring');
  if (progressRing) {
    const percentage = count / 10;
    const offset = 440 - (percentage * 440);
    progressRing.style.strokeDashoffset = offset;
  }

  // 3. Etiqueta de estado del pasaporte
  const statusLabel = document.getElementById('album-status-label');
  if (statusLabel) {
    if (count === 0) {
      statusLabel.textContent = 'PASAPORTE VACÍO';
      statusLabel.style.color = '#ef4444';
    } else if (count > 0 && count < 10) {
      statusLabel.textContent = `VOTADO ${count * 10}%`;
      statusLabel.style.color = '#ffd700';
    } else {
      statusLabel.textContent = '¡PASAPORTE COMPLETO!';
      statusLabel.style.color = '#10b981';
      statusLabel.style.textShadow = '0 0 10px rgba(16, 185, 129, 0.6)';
    }
  }

  // 4. Marcadores de votos en tiempo real en los espectaculares
  Object.keys(teams).forEach(k => {
    const votesDisplay = document.getElementById(`votes-${k}`);
    if (votesDisplay) {
      const isScanned = state.scannedTeams.includes(k);
      const totalVotes = teams[k].baseVotes + (isScanned ? 1 : 0);
      
      // Manejar vistas de Reforma y filas de forma amigable
      if (k === 'compadre' || k === 'borrego') {
        votesDisplay.innerHTML = `${totalVotes.toLocaleString()} <span class="votes-label">votos</span>`;
      } else {
        votesDisplay.textContent = totalVotes.toLocaleString();
      }
      
      if (isScanned) {
        votesDisplay.style.color = '#10b981';
      } else {
        votesDisplay.style.color = '';
      }
    }
  });

  // 5. Actualizar estado de deshabilitación de los botones de los espectaculares
  updateMatchupCardStatus('main', ['compadre', 'borrego']);
  updateMatchupCardStatus(2, ['cocuyos', 'hola']);
  updateMatchupCardStatus(3, ['chupacabras', 'califa']);
  updateMatchupCardStatus(4, ['turix', 'orinoco']);
  updateMatchupCardStatus(5, ['manolo', 'huequito']);
}

function updateMatchupCardStatus(cardId, teamKeys) {
  const card = cardId === 'main' ? document.getElementById('visual-showcase') : document.getElementById(`match-card-${cardId}`);
  if (!card) return;

  // Deshabilitar botones de escaneo para taquerías ya votadas
  teamKeys.forEach(k => {
    const btns = card.querySelectorAll(`.scan-trigger-btn[data-team="${k}"]`);
    btns.forEach(btn => {
      if (state.scannedTeams.includes(k)) {
        btn.disabled = true;
        btn.textContent = 'Votado 🌮';
        btn.className = 'btn btn-secondary btn-xs btn-scan-option';
      } else {
        btn.disabled = false;
        btn.textContent = `Votar ${teams[k].name.split(' ').slice(-1)}`;
        
        if (k === teamKeys[0]) {
          btn.className = 'btn btn-primary btn-xs btn-scan-option';
          btn.style.background = '#dc2626';
          btn.style.borderColor = '#dc2626';
          btn.style.color = '#fff';
        } else {
          btn.className = 'btn btn-secondary btn-xs btn-scan-option';
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.style.color = '';
        }
      }
    });
  });
}

// --- 9. CIERRE SEGURO DE MODALES ---
function setupDialogSafeClosing() {
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[command="close"]');
    if (closeBtn) {
      const dialogId = closeBtn.getAttribute('commandfor');
      const dialog = document.getElementById(dialogId);
      if (dialog) {
        dialog.close();
      }
    }
  });

  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        dialog.close();
      }
    });
  });
}

// --- 10. SIMULADOR DE ANALÍTICAS EN VIVO ---
function animateDashboardStats() {
  const scansCount = state.scannedTeams.length;
  const baseRegistrations = 87420 + (scansCount * 125);
  const display = document.getElementById('stats-total-scans');
  if (display) {
    display.textContent = baseRegistrations.toLocaleString();
  }

  // Actualizar tabla de clasificación de votos en tiempo real (Top 5)
  const chartTeams = ['compadre', 'cocuyos', 'chupacabras', 'turix', 'manolo'];
  const maxScaleVal = 20000;

  chartTeams.forEach(key => {
    const isScanned = state.scannedTeams.includes(key);
    const votesVal = teams[key].baseVotes + (isScanned ? 1 : 0);
    
    // Actualizar números de votos en la gráfica
    const textEl = document.getElementById(`votes-${key}-chart`);
    if (textEl) {
      textEl.textContent = votesVal.toLocaleString();
    }

    // Actualizar barras de progreso
    const fillEl = document.getElementById(`bar-fill-${key}`);
    if (fillEl) {
      const pct = (votesVal / maxScaleVal) * 100;
      fillEl.style.width = `${pct}%`;
      
      // Efecto brillo si fue el último escaneo
      const lastScanned = state.scannedTeams[scansCount - 1];
      if (key === lastScanned) {
        fillEl.style.filter = 'brightness(1.5) drop-shadow(0 0 8px currentColor)';
        setTimeout(() => {
          fillEl.style.filter = '';
        }, 1500);
      }
    }
  });
}

// --- 11. SIMULADOR DE CANJE DE PASAPORTE TAQUERO ---
function validateAlbumCode() {
  const input = document.getElementById('coupon-code-input');
  const codeVal = input.value.trim().toUpperCase();
  const msgBox = document.getElementById('validation-response');
  const statusLabel = document.getElementById('validator-status');

  if (!codeVal) {
    showValidationError('Por favor ingresa un código de cupón.');
    return;
  }

  // El código válido es el generado por el sistema
  const systemCode = generateAlbumCode();

  if (codeVal === systemCode) {
    if (state.scannedTeams.length < 10) {
      showValidationError('Código de pasaporte incompleto. Debes votar por las 10 taquerías para activar este cupón.');
      return;
    }

    playTacoSound('stadium');
    statusLabel.className = 'status-success-txt';
    statusLabel.textContent = '¡CUPÓN VALIDADO!';
    statusLabel.style.color = '#10b981';
    
    msgBox.className = 'validation-message-box success';
    msgBox.style.background = 'rgba(16, 185, 129, 0.1)';
    msgBox.style.border = '1px solid #10b981';
    msgBox.style.color = '#10b981';
    msgBox.innerHTML = `
      <strong>¡Canje Exitoso!</strong><br>
      Código del pasaporte certificado: <strong>${codeVal}</strong>.<br>
      Se ha autorizado la entrega de: <strong>1 Orden de Tacos Gratis</strong> en la taquería ganadora.<br>
      ¡Buen provecho! Disfruta del sabor del barrio.
    `;
    msgBox.classList.remove('hidden');
    input.value = '';
  } else {
    showValidationError('Código de pasaporte inválido. Comprueba el formato de la promoción.');
  }
}

function showValidationError(text) {
  playTacoSound('error');
  const statusLabel = document.getElementById('validator-status');
  const msgBox = document.getElementById('validation-response');

  statusLabel.className = 'status-error-txt';
  statusLabel.textContent = '¡ERROR DE VALIDACIÓN!';
  statusLabel.style.color = '#ef4444';
  
  msgBox.className = 'validation-message-box error';
  msgBox.style.background = 'rgba(239, 68, 68, 0.1)';
  msgBox.style.border = '1px solid #ef4444';
  msgBox.style.color = '#ef4444';
  msgBox.innerHTML = `<strong>Error:</strong> ${text}`;
  msgBox.classList.remove('hidden');
}

// --- 12. MANEJADORES DE EVENTOS ---
function setupEventListeners() {
  // Adjuntar clics directos a los botones de escaneo
  try {
    const scanButtons = document.querySelectorAll('.scan-trigger-btn');
    scanButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const targetBtn = e.currentTarget;
        if (targetBtn.disabled) return;

        const teamKey = targetBtn.getAttribute('data-team');
        const billboardId = targetBtn.getAttribute('data-billboard');
        
        if (teamKey && billboardId) {
          startSimulatedScan(teamKey, billboardId);
        }
      });
    });
  } catch (err) {
    console.error('Error setting up direct click listeners:', err);
  }

  // Delegation fallback
  document.addEventListener('click', (e) => {
    try {
      const scanBtn = e.target.closest('.scan-trigger-btn');
      if (scanBtn) {
        if (scanBtn.disabled) return;
        
        const teamKey = scanBtn.getAttribute('data-team');
        const billboardId = scanBtn.getAttribute('data-billboard');
        
        if (teamKey && billboardId && activeScanningTeamKey !== teamKey) {
          startSimulatedScan(teamKey, billboardId);
        }
      }
    } catch (err) {
      console.error('Error in delegated click listener:', err);
    }
  });

  const continueBtn = document.getElementById('modal-continue-btn');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      finalizeScan();
    });
  }

  const votingForm = document.getElementById('tacos-voting-form');
  if (votingForm) {
    votingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const selectEl = document.getElementById('vote-taqueria-select');
      const nameEl = document.getElementById('vote-user-name');
      const emailEl = document.getElementById('vote-user-email');
      const phoneEl = document.getElementById('vote-user-phone');

      if (!selectEl || !nameEl || !emailEl || !phoneEl) return;

      const taqueriaKey = selectEl.value;
      const userName = nameEl.value.trim();
      const userEmail = emailEl.value.trim();
      const userPhone = phoneEl.value.trim();

      if (!userName || !userEmail || !userPhone) {
        alert('Por favor completa todos los campos del formulario.');
        return;
      }

      // Voto registrado correctamente
      // Ocultar formulario
      const screenForm = document.getElementById('scanner-screen-form');
      if (screenForm) {
        screenForm.classList.add('hidden');
      }

      // Actualizar clave escaneada activa (en caso de que hayan cambiado la selección en el dropdown!)
      activeScanningTeamKey = taqueriaKey;

      showScanSuccess(taqueriaKey);
    });
  }

  const scannerModal = document.getElementById('scanner-modal');
  if (scannerModal) {
    scannerModal.addEventListener('close', () => {
      if (activeScanningTeamKey) {
        clearTimeoutsAndReset();
      }
    });
  }

  const saveWalletBtn = document.getElementById('save-wallet-action');
  if (saveWalletBtn) {
    saveWalletBtn.addEventListener('click', () => {
      const codeLabel = document.getElementById('reward-wallet-code').textContent;
      document.getElementById('reward-modal').close();
      
      const valInput = document.getElementById('coupon-code-input');
      if (valInput) {
        valInput.value = codeLabel;
        valInput.focus();
        document.getElementById('analytics-validation').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const validateBtn = document.getElementById('validate-coupon-btn');
  if (validateBtn) {
    validateBtn.addEventListener('click', validateAlbumCode);
  }

  const resetBtn = document.getElementById('reset-campaign');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('¿Deseas vaciar tu pasaporte de taquerías y reiniciar la simulación?')) {
        state.scannedTeams = [];
        state.claimedAlbum = false;
        state.validatedCodes = [];
        saveCampaignState();
        
        document.getElementById('coupon-code-input').value = '';
        document.getElementById('validator-status').className = 'status-waiting';
        document.getElementById('validator-status').textContent = 'Esperando Código de Pasaporte Lleno...';
        document.getElementById('validator-status').style.color = '';
        document.getElementById('validation-response').classList.add('hidden');
        
        renderAlbumGrid();
        updateUI();
        animateDashboardStats();
      }
    });
  }
}

// --- 13. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
  injectSoccerStyles();
  loadCampaignState();
  
  renderAlbumGrid();
  updateUI();
  animateDashboardStats();
  
  setupEventListeners();
  setupDialogSafeClosing();
});

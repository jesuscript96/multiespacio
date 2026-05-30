// JavaScript - Campaña Copa de Selecciones Publimex 2026
// PUBLIMEX Digital OOH - Propuesta B: Gamificación B2C

// Global error handler for debugging in-browser errors
window.onerror = function(message, source, lineno, colno, error) {
  alert("GLOBAL JS ERROR: " + message + " at " + source + ":" + lineno + ":" + colno);
  return false;
};

// --- 1. CONFIGURACIÓN Y ESTADO DE LA CAMPAÑA ---
const SOCCER_CAMPAIGN_KEY = 'publimex_soccer_campaign_v2';

let state = {
  scannedTeams: [], // Llaves de selecciones recolectadas (ej. 'mexico', 'sudafrica')
  claimedAlbum: false,
  validatedCodes: []
};

// Detalle de las 10 selecciones (incluyendo Sudáfrica/Bafana Bafana como estrella)
const teams = {
  mexico: {
    name: 'México',
    flag: '🇲🇽',
    code: 'MEX',
    primaryColor: '#10b981', // Verde
    secondaryColor: '#ef4444', // Rojo
    shiny: true, // Super estrella
    fact: 'Anfitrión del Mundial 2026 y Gigante de la Concacaf',
    baseVotes: 14892
  },
  sudafrica: {
    name: 'Bafana Bafana',
    flag: '🇿🇦',
    code: 'RSA',
    primaryColor: '#eab308', // Amarillo
    secondaryColor: '#15803d', // Verde
    shiny: true, // Super estrella (Mockup principal)
    fact: 'Orgullo de Sudáfrica (Bafana Bafana), rival del mockup Reforma',
    baseVotes: 12345
  },
  argentina: {
    name: 'Argentina',
    flag: '🇦🇷',
    code: 'ARG',
    primaryColor: '#75aadb', // Celeste
    secondaryColor: '#ffffff', // Blanco
    shiny: true,
    fact: 'Campeona defensora y última cita mundialista de Lionel Messi',
    baseVotes: 15204
  },
  brasil: {
    name: 'Brasil',
    flag: '🇧🇷',
    code: 'BRA',
    primaryColor: '#eab308', // Amarillo
    secondaryColor: '#16a34a', // Verde
    shiny: true,
    fact: 'Pentacampeona del mundo, máxima potencia histórica',
    baseVotes: 13410
  },
  espana: {
    name: 'España',
    flag: '🇪🇸',
    code: 'ESP',
    primaryColor: '#dc2626', // Rojo España
    secondaryColor: '#facc15', // Gualda
    shiny: false,
    fact: 'Vigente campeona de la Eurocopa plagada de estrellas jóvenes',
    baseVotes: 11360
  },
  alemania: {
    name: 'Alemania',
    flag: '🇩🇪',
    code: 'GER',
    primaryColor: '#111111', // Negro
    secondaryColor: '#ffd700', // Dorado
    shiny: false,
    fact: 'Tetracampeona del mundo y gigante del fútbol europeo',
    baseVotes: 12345
  },
  francia: {
    name: 'Francia',
    flag: '🇫🇷',
    code: 'FRA',
    primaryColor: '#1e3a8a', // Azul
    secondaryColor: '#ef4444', // Rojo
    shiny: true,
    fact: 'Líder del ranking mundial y subcampeona del mundo',
    baseVotes: 13980
  },
  inglaterra: {
    name: 'Inglaterra',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    code: 'ENG',
    primaryColor: '#ffffff', // Blanco
    secondaryColor: '#dc2626', // Rojo
    shiny: false,
    fact: 'Una de las plantillas más caras, cotizadas y mediáticas',
    baseVotes: 12190
  },
  colombia: {
    name: 'Colombia',
    flag: '🇨🇴',
    code: 'COL',
    primaryColor: '#fbbf24', // Amarillo
    secondaryColor: '#dc2626', // Rojo
    shiny: false,
    fact: 'Enorme afición, gran momento futbolístico internacional',
    baseVotes: 10845
  },
  portugal: {
    name: 'Portugal',
    flag: '🇵🇹',
    code: 'POR',
    primaryColor: '#ef4444', // Rojo
    secondaryColor: '#10b981', // Verde
    shiny: false,
    fact: 'Liderada por una constelación de figuras y el legado de CR7',
    baseVotes: 11850
  }
};

// Generar SVG de los escudos nacionales estilizados
function getShieldSVG(teamKey) {
  const team = teams[teamKey];
  const pCol = team.primaryColor;
  const sCol = team.secondaryColor;

  let details = '';

  switch(teamKey) {
    case 'mexico':
      details = `
        <rect x="-15" y="-20" width="10" height="40" fill="${pCol}" />
        <rect x="-5" y="-20" width="10" height="40" fill="#ffffff" />
        <rect x="5" y="-20" width="10" height="40" fill="${sCol}" />
        <polygon points="-6,-6 6,-6 4,6 -4,6" fill="#a16207" />
        <path d="M-8,-6 Q0,-12 8,-6 M0,-12 L0,-2" stroke="#ffffff" stroke-width="1.5" fill="none" />
      `;
      break;
    case 'sudafrica':
      // Protea flower / Bafana Bafana shield outline
      details = `
        <circle cx="0" cy="-2" r="14" fill="${pCol}" />
        <!-- Flower Petals -->
        <path d="M 0,-10 C 2,-4 2,4 0,8 C -2,4 -2,-4 0,-10 Z" fill="#ffffff" />
        <path d="M -6,-6 C -2,-2 2,4 -4,6 C -5,2 -5,-4 -6,-6 Z" fill="#ffffff" />
        <path d="M 6,-6 C 2,-2 -2,4 4,6 C 5,2 5,-4 6,-6 Z" fill="#ffffff" />
        <!-- Flower center -->
        <circle cx="0" cy="-2" r="2.5" fill="#15803d" />
        <!-- Ribbon at the bottom -->
        <path d="M -12,8 L 12,8 L 10,13 L -10,13 Z" fill="#000" />
        <text x="0" y="11.5" fill="#ffffff" font-family="Arial" font-size="3" text-anchor="middle" font-weight="bold">RSA</text>
      `;
      break;
    case 'argentina':
      details = `
        <rect x="-20" y="-20" width="12" height="40" fill="${pCol}" />
        <rect x="-8" y="-20" width="16" height="40" fill="#ffffff" />
        <rect x="8" y="-20" width="12" height="40" fill="${pCol}" />
        <circle cx="0" cy="0" r="5" fill="#facc15" stroke="#ca8a04" stroke-width="0.5" />
        <path d="M0,-8 L0,8 M-8,0 L8,0 M-5,-5 L5,5 M-5,5 L5,-5" stroke="#facc15" stroke-width="1" />
      `;
      break;
    case 'brasil':
      details = `
        <rect x="-20" y="-20" width="40" height="40" fill="${pCol}" />
        <polygon points="0,-16 18,0 0,16 -18,0" fill="${pCol}" stroke="${sCol}" stroke-width="2" />
        <circle cx="0" cy="0" r="8" fill="#1d4ed8" />
        <path d="M-6,0 Q0,-4 6,-1" stroke="#ffffff" stroke-width="1" fill="none" />
      `;
      break;
    case 'espana':
      details = `
        <rect x="-20" y="-20" width="40" height="40" fill="${pCol}" />
        <polygon points="-12,-10 12,-10 8,10 -8,10" fill="${sCol}" />
        <polygon points="-8,-14 8,-14 5,-10 -5,-10" fill="#ffd700" />
        <rect x="-2" y="-6" width="4" height="12" fill="${pCol}" />
      `;
      break;
    case 'alemania':
      details = `
        <rect x="-20" y="-20" width="40" height="40" fill="#ffffff" />
        <polygon points="-8,-12 8,-12 12,0 0,15 -12,0" fill="#111111" />
        <line x1="-12" y1="-5" x2="12" y2="-5" stroke="${sCol}" stroke-width="2" />
        <line x1="-10" y1="2" x2="10" y2="2" stroke="#ef4444" stroke-width="2" />
      `;
      break;
    case 'francia':
      details = `
        <rect x="-20" y="-20" width="13" height="40" fill="${pCol}" />
        <rect x="-7" y="-20" width="14" height="40" fill="#ffffff" />
        <rect x="7" y="-20" width="13" height="40" fill="${sCol}" />
        <path d="M-4,4 Q0,-4 4,2 Q6,-8 0,-10 L-6,-6 Z" fill="#ffffff" stroke="#1e293b" stroke-width="0.5" />
        <circle cx="2" cy="-8" r="1.5" fill="${sCol}" />
      `;
      break;
    case 'inglaterra':
      details = `
        <rect x="-20" y="-20" width="40" height="40" fill="#ffffff" />
        <rect x="-4" y="-20" width="8" height="40" fill="${sCol}" />
        <rect x="-20" y="-4" width="40" height="8" fill="${sCol}" />
        <rect x="-10" y="-12" width="6" height="3" fill="#1e1b4b" rx="1" />
        <rect x="-10" y="-2" width="6" height="3" fill="#1e1b4b" rx="1" />
        <rect x="-10" y="8" width="6" height="3" fill="#1e1b4b" rx="1" />
      `;
      break;
    case 'colombia':
      details = `
        <rect x="-20" y="-20" width="40" height="20" fill="${pCol}" />
        <rect x="-20" y="0" width="40" height="10" fill="#1d4ed8" />
        <rect x="-20" y="10" width="40" height="10" fill="${sCol}" />
        <polygon points="-5,-4 5,-4 0,-10" fill="#374151" />
      `;
      break;
    case 'portugal':
      details = `
        <rect x="-20" y="-20" width="16" height="40" fill="${sCol}" />
        <rect x="-4" y="-20" width="24" height="40" fill="${pCol}" />
        <circle cx="0" cy="0" r="7" fill="none" stroke="#eab308" stroke-width="2" />
        <rect x="-4" y="-4" width="8" height="8" fill="#ffffff" stroke="#ef4444" stroke-width="1" />
      `;
      break;
  }

  return `
    <svg class="cromo-shield-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="shield-clip-${teamKey}">
          <path d="M 50,15 C 75,15 85,20 85,45 C 85,75 50,90 50,90 C 50,90 15,75 15,45 C 15,20 25,15 50,15 Z" />
        </clipPath>
        <linearGradient id="gold-border-${teamKey}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffd700" />
          <stop offset="50%" stop-color="#fff" />
          <stop offset="100%" stop-color="#b8860b" />
        </linearGradient>
      </defs>
      
      <!-- Outer Shield Glow / Border -->
      <path d="M 50,12 C 78,12 88,18 88,45 C 88,78 50,94 50,94 C 50,94 12,78 12,45 C 12,18 22,12 50,12 Z" 
            fill="${team.shiny ? `url(#gold-border-${teamKey})` : 'rgba(255,255,255,0.12)'}" />
      
      <!-- Inner Shield Body Clipped -->
      <g clip-path="url(#shield-clip-${teamKey})">
        <rect x="0" y="0" width="100" height="100" fill="#1b1b22" />
        <g transform="translate(50, 50)">
          ${details}
        </g>
      </g>
      
      <!-- Inner Shield Border -->
      <path d="M 50,15 C 75,15 85,20 85,45 C 85,75 50,90 50,90 C 50,90 15,75 15,45 C 15,20 25,15 50,15 Z" 
            fill="none" stroke="${team.shiny ? '#ffd700' : 'rgba(255,255,255,0.2)'}" stroke-width="2" />
    </svg>
  `;
}

// Generar visual de código QR de equipo para el escáner (diseño protagonista)
function renderTeamQRInScanner(teamKey) {
  const container = document.getElementById('scanner-qr-display');
  if (!container) return;
  
  container.innerHTML = `
    <div style="position: relative; width: 140px; height: 140px; background: #fff; padding: 8px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;">
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
      <div style="position: absolute; width: 56px; height: 56px; background: #fff; border-radius: 6px; display: flex; align-items: center; justify-content: center; padding: 2px; box-shadow: 0 2px 10px rgba(0,0,0,0.35);">
        ${getShieldSVG(teamKey)}
      </div>
    </div>
  `;
}

// Generar código de álbum único
function generateAlbumCode() {
  const seed = (localStorage.getItem('publimex_album_seed') || Math.random().toString(36).substring(2, 6).toUpperCase());
  localStorage.setItem('publimex_album_seed', seed);
  return `PUBLIMEX-ALBUM-${seed}`;
}

// --- 2. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
  loadCampaignState();
  injectSoccerStyles();
  setupEventListeners();
  setupDialogSafeClosing();
  renderAlbumGrid();
  updateUI();
});

// --- 3. PERSISTENCIA DE ESTADO ---
function loadCampaignState() {
  const saved = localStorage.getItem(SOCCER_CAMPAIGN_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        state.scannedTeams = Array.isArray(parsed.scannedTeams) ? parsed.scannedTeams : [];
        state.claimedAlbum = !!parsed.claimedAlbum;
        state.validatedCodes = Array.isArray(parsed.validatedCodes) ? parsed.validatedCodes : [];
      }
    } catch (e) {
      console.error('Error cargando estado futbolero:', e);
    }
  }
}

function saveCampaignState() {
  localStorage.setItem(SOCCER_CAMPAIGN_KEY, JSON.stringify(state));
}

// --- 4. CONFIGURACIÓN DE AUDIO SINTETIZADO (Web Audio API) ---
function playSoccerSound(type) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    if (type === 'whistle') {
      // Silbato corto doble de árbitro
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1300, now);
      osc1.frequency.linearRampToValueAtTime(1600, now + 0.08);
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.3, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.13);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1300, now + 0.16);
      osc2.frequency.linearRampToValueAtTime(1650, now + 0.26);
      gain2.gain.setValueAtTime(0.001, now + 0.16);
      gain2.gain.linearRampToValueAtTime(0.35, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.16);
      osc2.stop(now + 0.38);
    } else if (type === 'stadium') {
      // Fanfarria triunfal mundialista
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
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
      // Sonido sintetizado de estampa adhesiva pegándose sobre el papel
      // Generar ruido blanco con un filtro paso banda y caída rápida
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

// --- 5. ANIMACIONES ---
function injectSoccerStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .confetti-piece {
      position: absolute;
      width: 10px;
      height: 10px;
      top: -10px;
      opacity: 0.8;
      border-radius: 50%;
      z-index: 1000;
      animation: fall linear forwards;
    }
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
    .modal-cromo-card {
      transform-style: preserve-3d;
      animation: reveal-spin 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    @keyframes reveal-spin {
      0% { transform: scale(0.3) rotateY(180deg); }
      100% { transform: scale(1.1) rotateY(0); }
    }
  `;
  document.head.appendChild(style);
}

function triggerConfettiExplosion() {
  const container = document.body;
  const colors = ['#E30613', '#ffffff', '#ffd700', '#10b981', '#2563eb', '#75aadb'];
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.width = `${5 + Math.random() * 8}px`;
    confetti.style.height = `${8 + Math.random() * 10}px`;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];

    const duration = 2.0 + Math.random() * 2.5;
    confetti.style.animationDuration = `${duration}s`;
    
    container.appendChild(confetti);

    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, duration * 1000);
  }
}

// --- 6. RENDERIZACIÓN DINÁMICA DEL ÁLBUM CON HUECOS PANINI (2x5) ---
function renderAlbumGrid() {
  const grid = document.getElementById('album-cromo-grid');
  if (!grid) return;

  grid.innerHTML = '';
  
  const teamKeys = Object.keys(teams);
  
  teamKeys.forEach((key, index) => {
    const team = teams[key];
    const isUnlocked = state.scannedTeams.includes(key);
    const numDisplay = String(index + 1).padStart(2, '0');
    
    // Crear ranura (hollow slot) del álbum
    const slot = document.createElement('div');
    slot.id = `slot-${key}`;
    slot.className = 'album-slot';
    slot.innerHTML = `
      <span class="album-slot-num">${numDisplay}</span>
      <div class="album-slot-shield-placeholder">
        ${getShieldSVG(key)}
      </div>
      <span class="album-slot-team-name">${team.name}</span>
    `;

    // Si ya está desbloqueado, pegarle la estampa física real encima
    if (isUnlocked) {
      const cromo = document.createElement('div');
      cromo.className = `real-cromo ${team.shiny ? 'shiny-foil' : ''}`;
      
      // Aplicar una rotación ligera estática fija para simular pegado manual imperfecto
      const rotationAngle = (index % 3 === 0) ? 0.7 : (index % 2 === 0) ? -0.5 : 0.3;
      cromo.style.transform = `rotate(${rotationAngle}deg)`;
      
      cromo.innerHTML = `
        <span class="real-cromo-badge">${team.shiny ? '⭐ Cracks' : 'Cromo'}</span>
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
      // Hacer click en la ranura vacía desplaza a las vallas correspondientes
      slot.addEventListener('click', () => {
        let billboardId = 'main';
        if (key === 'mexico' || key === 'sudafrica') billboardId = 'main';
        else if (key === 'argentina' || key === 'brasil') billboardId = 2;
        else if (key === 'espana' || key === 'alemania') billboardId = 3;
        else if (key === 'francia' || key === 'inglaterra') billboardId = 4;
        else if (key === 'colombia' || key === 'portugal') billboardId = 5;

        const targetId = billboardId === 'main' ? 'visual-showcase' : 'demo-simulator';
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
        
        // Destello visual en la valla correspondiente
        setTimeout(() => {
          startSimulatedScan(key, billboardId);
        }, 500);
      });
    }

    grid.appendChild(slot);
  });
}

// --- 7. SIMULACIÓN DE ESCANEO DE QR ---
let activeScanningTeamKey = null;
let activeScanningBillboardId = null;
let scanTimeout = null;
let scanSuccessTimeout = null;
let hasRegisteredActiveScan = false;

function startSimulatedScan(teamKey, billboardId) {
  if (state.scannedTeams.includes(teamKey)) {
    alert(`Ya tienes el cromo de ${teams[teamKey].name} en tu álbum.`);
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

  // Ajustar apariencia
  wrapper.className = 'scanner-viewport-wrapper state-scanning';
  screenScan.classList.remove('hidden');
  screenSuccess.classList.add('hidden');
  modalTitle.textContent = 'SIMULANDO ESCANEO DE CÓDIGO QR';
  modalFooter.classList.remove('hidden');

  const team = teams[teamKey];
  scanStatusText.textContent = `Apuntando al escudo QR de ${team.name} en la valla...`;

  // Dibujar el QR personalizado con el escudo en el visor
  renderTeamQRInScanner(teamKey);

  modal.showModal();
  playSoccerSound('whistle');

  // Fase 1: Enfoque de cámara por 1.5 segundos
  scanTimeout = setTimeout(() => {
    scanTimeout = null;
    showScanSuccess(teamKey);
  }, 1500);
}

function showScanSuccess(teamKey) {
  const modal = document.getElementById('scanner-modal');
  const wrapper = document.getElementById('scanner-viewport-wrapper');
  const screenScan = modal.querySelector('.scanner-screen-scan');
  const screenSuccess = modal.querySelector('.scanner-screen-success');
  const modalTitle = document.getElementById('scanner-modal-title');
  const modalFooter = document.getElementById('scanner-modal-footer');

  wrapper.className = 'scanner-viewport-wrapper state-success';
  screenScan.classList.add('hidden');
  screenSuccess.classList.remove('hidden');
  modalTitle.textContent = '¡CROMO REGISTRADO!';
  modalFooter.classList.add('hidden');

  const team = teams[teamKey];
  document.getElementById('scanner-success-location').textContent = team.fact;

  // Llenar el visor con la estampa de papel brillante
  const revealContainer = document.getElementById('modal-cromo-reveal');
  revealContainer.className = 'modal-cromo-card';
  
  revealContainer.innerHTML = `
    <div class="real-cromo ${team.shiny ? 'shiny-foil' : ''}" style="width:120px; height:160px; margin:0 auto; cursor:default; transform:rotate(-1deg);">
      <span class="real-cromo-badge">${team.shiny ? '⭐ Cracks' : 'Cromo'}</span>
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
  document.getElementById('modal-progress-text').textContent = `${currentTotal} / 10 Cromos`;

  playSoccerSound('stadium');
}

function triggerStickerPastingAnimation(teamKey, callback) {
  const targetSlot = document.getElementById(`slot-${teamKey}`);
  const revealCromo = document.querySelector('#modal-cromo-reveal .real-cromo');
  const flyingSticker = document.getElementById('flying-sticker-effect');
  
  if (!targetSlot || !revealCromo || !flyingSticker) {
    callback();
    return;
  }

  // 1. Obtener posiciones iniciales y finales absolutas en la página
  const startRect = revealCromo.getBoundingClientRect();
  const endRect = targetSlot.getBoundingClientRect();

  const startLeft = startRect.left + window.scrollX;
  const startTop = startRect.top + window.scrollY;
  const endLeft = endRect.left + window.scrollX;
  const endTop = endRect.top + window.scrollY;

  // 2. Clonar el cromo para el vuelo y darle estilos absolutos iniciales
  flyingSticker.innerHTML = revealCromo.innerHTML;
  flyingSticker.className = `real-cromo ${teams[teamKey].shiny ? 'shiny-foil' : ''}`;
  
  flyingSticker.style.position = 'absolute';
  flyingSticker.style.left = `${startLeft}px`;
  flyingSticker.style.top = `${startTop}px`;
  flyingSticker.style.width = `${startRect.width}px`;
  flyingSticker.style.height = `${startRect.height}px`;
  flyingSticker.style.margin = '0';
  flyingSticker.style.transform = 'scale(1) rotate(-1deg)';
  flyingSticker.style.opacity = '1';
  flyingSticker.classList.remove('hidden');

  // Cerrar el modal del escáner para ver la transición
  document.getElementById('scanner-modal').close();

  // 3. Desplazar la pantalla hasta el simulador para ver la animación
  document.getElementById('demo-simulator').scrollIntoView({ behavior: 'smooth' });

  // 4. Iniciar la transición de vuelo después de un breve delay
  setTimeout(() => {
    flyingSticker.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    flyingSticker.style.left = `${endLeft}px`;
    flyingSticker.style.top = `${endTop}px`;
    flyingSticker.style.width = `${endRect.width}px`;
    flyingSticker.style.height = `${endRect.height}px`;
    flyingSticker.style.transform = 'scale(1) rotate(0.6deg)';
  }, 100);

  // 5. Finalizar la animación (pegar estampa y reproducir sonido)
  setTimeout(() => {
    playSoccerSound('paste');
    
    // Ocultar clon volador
    flyingSticker.classList.add('hidden');
    flyingSticker.style.transition = '';
    
    callback();

    // Destello de estampa recién pegada
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

      // Confeti de campeón si completa los 10 cromos
      const count = state.scannedTeams.length;
      if (count === 10) {
        setTimeout(() => {
          triggerConfettiExplosion();
          playSoccerSound('stadium');
          openRewardModal();
        }, 800);
      }
    }
  };

  // Disparar animación de vuelo de estampilla
  triggerStickerPastingAnimation(teamKey, registerStateChange);
}

function clearTimeoutsAndReset() {
  if (scanTimeout) clearTimeout(scanTimeout);
  if (scanSuccessTimeout) clearTimeout(scanSuccessTimeout);
  scanTimeout = null;
  scanSuccessTimeout = null;
  activeScanningTeamKey = null;
  activeScanningBillboardId = null;
}

// --- 8. APERTURA DE RECOMPENSAS (WALLET PASS) ---
function openRewardModal() {
  const codeVal = generateAlbumCode();
  
  document.getElementById('reward-wallet-code').textContent = codeVal;
  document.getElementById('reward-wallet-barcode-txt').textContent = codeVal;

  const modal = document.getElementById('reward-modal');
  modal.showModal();
  triggerConfettiExplosion();
}

// --- 9. ACTUALIZACIÓN DE LA INTERFAZ DE USUARIO (UI) ---
function updateUI() {
  const count = state.scannedTeams.length;
  
  // 1. Contador de cromos
  const counterDisplay = document.getElementById('cromos-count');
  if (counterDisplay) {
    counterDisplay.textContent = count;
  }

  // 2. Mover el progreso circular del balón
  const progressRing = document.getElementById('soccer-progress-ring');
  if (progressRing) {
    const percentage = count / 10;
    const offset = 440 - (percentage * 440);
    progressRing.style.strokeDashoffset = offset;
  }

  // 3. Etiqueta de estado del álbum
  const statusLabel = document.getElementById('album-status-label');
  if (statusLabel) {
    if (count === 0) {
      statusLabel.textContent = 'ÁLBUM VACÍO';
      statusLabel.style.color = '#ffd700';
    } else if (count > 0 && count < 10) {
      statusLabel.textContent = `COLECCIONADO ${count * 10}%`;
      statusLabel.style.color = '#ffd700';
    } else {
      statusLabel.textContent = '¡COLECCIÓN COMPLETA!';
      statusLabel.style.color = '#ffd700';
      statusLabel.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.6)';
    }
  }

  // 4. Marcador de votos en tiempo real (Suma 1 voto al escanear)
  Object.keys(teams).forEach(k => {
    const votesDisplay = document.getElementById(`votes-${k}`);
    if (votesDisplay) {
      const isScanned = state.scannedTeams.includes(k);
      const totalVotes = teams[k].baseVotes + (isScanned ? 1 : 0);
      votesDisplay.innerHTML = `${totalVotes.toLocaleString()} <span class="votes-label">votos</span>`;
      
      if (isScanned) {
        votesDisplay.style.color = '#10b981';
      } else {
        votesDisplay.style.color = '';
      }
    }
  });

  // 5. Actualizar estado de las vallas
  // Valla principal (Reforma)
  updateMatchupCardStatus('main', ['mexico', 'sudafrica']);
  // Vallas en fila
  updateMatchupCardStatus(2, ['argentina', 'brasil']);
  updateMatchupCardStatus(3, ['espana', 'alemania']);
  updateMatchupCardStatus(4, ['francia', 'inglaterra']);
  updateMatchupCardStatus(5, ['colombia', 'portugal']);
}

function updateMatchupCardStatus(cardId, teamKeys) {
  const card = cardId === 'main' ? document.getElementById('visual-showcase') : document.getElementById(`match-card-${cardId}`);
  if (!card) return;

  const statusIndicator = document.getElementById(`match-status-${cardId}`);
  
  let scannedCount = 0;
  teamKeys.forEach(k => {
    if (state.scannedTeams.includes(k)) scannedCount++;
  });

  if (statusIndicator) {
    if (scannedCount === 2) {
      statusIndicator.className = 'status-indicator status-scanned';
      statusIndicator.textContent = 'Completado (2/2)';
    } else if (scannedCount === 1) {
      statusIndicator.className = 'status-indicator status-idle';
      statusIndicator.textContent = 'Parcial (1/2)';
    } else {
      statusIndicator.className = 'status-indicator status-idle';
      statusIndicator.textContent = 'Disponible (0/2)';
    }
  }

  // Deshabilitar botones de escaneo para equipos ya coleccionados
  teamKeys.forEach(k => {
    const btns = card.querySelectorAll(`.scan-trigger-btn[data-team="${k}"]`);
    btns.forEach(btn => {
      if (state.scannedTeams.includes(k)) {
        btn.disabled = true;
        btn.textContent = 'Coleccionado';
        btn.className = 'btn btn-secondary btn-xs btn-scan-option';
      } else {
        btn.disabled = false;
        const flag = teams[k].flag;
        btn.textContent = `Escanear ${flag}`;
        
        if (k === teamKeys[0]) {
          btn.className = 'btn btn-primary btn-xs btn-scan-option';
        } else {
          btn.className = 'btn btn-secondary btn-xs btn-scan-option';
        }
      }
    });
  });
}

// --- 10. CIERRE SEGURO DE MODALES ---
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

// --- 11. SIMULADOR DE ANALÍTICAS EN VIVO ---
function animateDashboardStats() {
  const scansCount = state.scannedTeams.length;
  const baseRegistrations = 24500 + (scansCount * 125);
  const display = document.getElementById('stats-total-scans');
  if (display) {
    display.textContent = baseRegistrations.toLocaleString();
  }

  // Update the top 5 scanned selections bar chart dynamically
  const chartTeams = ['mexico', 'argentina', 'brasil', 'espana', 'francia'];
  const maxScaleVal = 18000;

  chartTeams.forEach(key => {
    const isScanned = state.scannedTeams.includes(key);
    const votesVal = teams[key].baseVotes + (isScanned ? 1 : 0);
    
    // Update votes label
    const textEl = document.getElementById(`votes-${key}-chart`);
    if (textEl) {
      textEl.textContent = votesVal.toLocaleString();
    }

    // Update progress bar width
    const fillEl = document.getElementById(`bar-fill-${key}`);
    if (fillEl) {
      const pct = (votesVal / maxScaleVal) * 100;
      fillEl.style.width = `${pct}%`;
      
      // If it was the last scanned team, give it a highlight flash effect
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

// --- 12. SIMULADOR DE CANJE COMERCIAL ---
function validateAlbumCode() {
  const input = document.getElementById('coupon-code-input');
  const codeVal = input.value.trim().toUpperCase();
  const msgBox = document.getElementById('validation-response');
  const statusLabel = document.getElementById('validator-status');

  if (!codeVal) {
    showValidationError('Por favor ingresa un código de validación.');
    return;
  }

  if (state.validatedCodes.includes(codeVal)) {
    showValidationError(`El código ${codeVal} ya fue registrado y el álbum ya fue entregado.`);
    return;
  }

  if (codeVal.startsWith('PUBLIMEX-ALBUM-')) {
    const totalCromos = state.scannedTeams.length;
    if (totalCromos < 10) {
      showValidationError(`Este código corresponde a una colección incompleta (${totalCromos} / 10 cromos).`);
      return;
    }

    state.validatedCodes.push(codeVal);
    state.claimedAlbum = true;
    saveCampaignState();

    playSoccerSound('stadium');
    triggerConfettiExplosion();

    statusLabel.className = 'status-success-txt';
    statusLabel.textContent = '¡ÁLBUM ENTREGADO COMERCIALMENTE!';
    
    msgBox.className = 'validation-message-box success';
    msgBox.innerHTML = `
      <strong>¡Canje Exitoso!</strong><br>
      Código del álbum certificado: <strong>${codeVal}</strong>.<br>
      Se ha registrado la entrega física de <strong>1 Álbum de Pasta Dura Copa 2026</strong>.<br>
      El boleto de rifa para la final en el Estadio Azteca ha sido ingresado al sorteo.
    `;
    msgBox.classList.remove('hidden');
    input.value = '';
  } else {
    showValidationError('Código de álbum inválido. Comprueba el formato de la promoción.');
  }
}

function showValidationError(text) {
  playSoccerSound('error');
  const statusLabel = document.getElementById('validator-status');
  const msgBox = document.getElementById('validation-response');

  statusLabel.className = 'status-error-txt';
  statusLabel.textContent = '¡ERROR EN REDENCIÓN!';
  
  msgBox.className = 'validation-message-box error';
  msgBox.innerHTML = `<strong>Error:</strong> ${text}`;
  msgBox.classList.remove('hidden');
}

// --- 13. MANEJADORES DE EVENTOS ---
function setupEventListeners() {
  // Attach direct click event handlers to all scan buttons (bulletproof method)
  try {
    const scanButtons = document.querySelectorAll('.scan-trigger-btn');
    console.log('setupEventListeners: Attaching direct click listeners to ' + scanButtons.length + ' buttons');
    scanButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const targetBtn = e.currentTarget;
        if (targetBtn.disabled) {
          console.log('Click on disabled scanBtn ignored');
          return;
        }

        const teamKey = targetBtn.getAttribute('data-team');
        const billboardId = targetBtn.getAttribute('data-billboard');
        console.log('Direct click on scanBtn: team=' + teamKey + ', billboard=' + billboardId);
        
        if (teamKey && billboardId) {
          startSimulatedScan(teamKey, billboardId);
        } else {
          console.error('Missing data attributes on click:', targetBtn);
        }
      });
    });
  } catch (err) {
    console.error('Error setting up direct click listeners:', err);
  }

  // Delegation fallback click listener
  document.addEventListener('click', (e) => {
    try {
      const scanBtn = e.target.closest('.scan-trigger-btn');
      if (scanBtn) {
        // Only run if not captured by direct listener (using activeScanningTeamKey block)
        if (scanBtn.disabled) return;
        
        const teamKey = scanBtn.getAttribute('data-team');
        const billboardId = scanBtn.getAttribute('data-billboard');
        console.log('Delegated click caught on scanBtn: team=' + teamKey + ', billboard=' + billboardId);
        
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

  const scannerModal = document.getElementById('scanner-modal');
  if (scannerModal) {
    scannerModal.addEventListener('close', () => {
      if (activeScanningTeamKey) {
        // Si se cerró por el clic fuera o botón cerrar sin pegar
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
      if (confirm('¿Deseas vaciar tu álbum de selecciones y reiniciar la simulación?')) {
        state.scannedTeams = [];
        state.claimedAlbum = false;
        state.validatedCodes = [];
        saveCampaignState();
        
        document.getElementById('coupon-code-input').value = '';
        document.getElementById('validator-status').className = 'status-waiting';
        document.getElementById('validator-status').textContent = 'Esperando Código de Álbum Completo...';
        document.getElementById('validation-response').classList.add('hidden');
        
        renderAlbumGrid();
        updateUI();
        animateDashboardStats();
      }
    });
  }
}

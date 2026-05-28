// JavaScript - Campaña Autopromocional OOH Publimex
// PUBLIMEX Digital Layer Demo

// --- 1. CONFIGURACIÓN Y ESTADO DE LA CAMPAÑA ---
const CAMPAIGN_KEY = 'publimex_promo_campaign_v2';

let state = {
  scanned: [], // IDs de espectaculares escaneados (1 a 5)
  claimedMilestones: [], // hitos de premios reclamados (1, 3, 5)
  validatedCodes: [] // códigos de cupones ya validados por el equipo comercial
};

// Ubicaciones de los espectaculares Publimex vacíos
const billboards = {
  1: { name: 'Paseo de la Reforma', code: 'REFORMA' },
  2: { name: 'Polanco Facade', code: 'POLANCO' },
  3: { name: 'Colonia Roma Mural', code: 'ROMA' },
  4: { name: 'Condesa Bus Stop', code: 'CONDESA' },
  5: { name: 'Santa Fe Unipolar', code: 'SANTAFE' }
};

// Detalles de las Recompensas Publimex B2B
const milestones = {
  1: {
    title: 'Mockup Digital Gratis',
    desc: 'Obtén una simulación fotorrealista gratuita de tu marca exhibida en una de nuestras pantallas premium de la Ciudad de México.',
    codePrefix: 'PUBLIMEX-MOCKUP-',
    themeClass: '',
    badgeText: 'Bronze Pass'
  },
  3: {
    title: '15% Descuento en Pauta',
    desc: 'Cupón exclusivo del 15% de descuento aplicable al contratar tu primer mes de publicidad digital exterior en cualquiera de nuestros espacios.',
    codePrefix: 'PUBLIMEX-DESCUENTO-',
    themeClass: 'wallet-theme-silver',
    badgeText: 'Silver Pass'
  },
  5: {
    title: 'Boleto Sorteo: 1 Día Gratis',
    desc: '¡Has completado la ruta! Tu marca participa en el sorteo semanal para ganar un día completo de pauta 100% gratuita en pantallas seleccionadas.',
    codePrefix: 'PUBLIMEX-SORTEO-',
    themeClass: 'wallet-theme-gold',
    badgeText: 'Gold Pass'
  }
};

// Generar código de cupón único
function generateCouponCode(milestoneId) {
  const seed = (localStorage.getItem('publimex_coupon_seed_' + milestoneId) || Math.random().toString(36).substring(2, 6).toUpperCase());
  localStorage.setItem('publimex_coupon_seed_' + milestoneId, seed);
  return `${milestones[milestoneId].codePrefix}${seed}`;
}

// --- 2. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
  loadCampaignState();
  injectBubbleStyles();
  startBubbleGenerator();
  setupEventListeners();
  setupDialogSafeClosing();
  updateUI();
});

// --- 3. PERSISTENCIA DE ESTADO ---
function loadCampaignState() {
  const saved = localStorage.getItem(CAMPAIGN_KEY);
  if (saved) {
    try {
      state = JSON.parse(saved);
    } catch (e) {
      console.error('Error cargando estado de campaña:', e);
    }
  }
}

function saveCampaignState() {
  localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(state));
}

// --- 4. CONFIGURACIÓN DE AUDIO SINTETIZADO (Web Audio API) ---
function playChime(isSuccess) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (isSuccess) {
      const now = ctx.currentTime;
      
      // Campana doble armónica alta
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.55);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, now + 0.12); // G5
      osc2.frequency.exponentialRampToValueAtTime(1567.98, now + 0.27); // G6
      gain2.gain.setValueAtTime(0.15, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.7);
    } else {
      // Tono de error
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(261.63, now); // C4
      osc.frequency.linearRampToValueAtTime(130.81, now + 0.25); // C3
      gain.gain.setValueAtTime(0.2, now);
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

// --- 5. ANIMACIONES DINÁMICAS (Burbujas en SVG) ---
function injectBubbleStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .svg-bubble {
      animation: bubble-float linear forwards;
      transform-origin: center;
    }
    @keyframes bubble-float {
      0% {
        transform: translateY(0) scale(0.6);
        opacity: 0;
      }
      15% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% {
        transform: translateY(var(--float-dist)) scale(0.2);
        opacity: 0;
      }
    }
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
  `;
  document.head.appendChild(style);
}

function createSVGbubble(intensity = 1) {
  const bubblesGroup = document.getElementById('svg-bubbles-group');
  if (!bubblesGroup) return;

  const scans = state.scanned.length;
  if (scans === 0) return; // Sin líquido en el espectacular digital no hay burbujas

  // Altura del nivel de energía actual
  const currentY = 145 - (scans * 22);

  const numBubbles = Math.ceil(Math.random() * intensity);
  for (let i = 0; i < numBubbles; i++) {
    const bubble = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    
    // Posición X aleatoria dentro de la pantalla (x: 35 a 165)
    const x = 40 + Math.random() * 120; 
    
    // Altura máxima a la que flotará antes de desaparecer
    const floatDistance = - (20 + Math.random() * (currentY - 15));
    
    bubble.setAttribute('cx', x);
    bubble.setAttribute('cy', 0); // Posicionado relativo al grupo del líquido
    bubble.setAttribute('r', 1.5 + Math.random() * 2.5);
    bubble.setAttribute('fill', 'rgba(255, 255, 255, 0.6)');
    bubble.setAttribute('class', 'svg-bubble');
    
    bubble.style.setProperty('--float-dist', `${floatDistance}px`);
    const duration = 2.0 + Math.random() * 2.5; // de 2s a 4.5s
    bubble.style.animationDuration = `${duration}s`;

    bubblesGroup.appendChild(bubble);

    // Remover al finalizar la animación
    setTimeout(() => {
      if (bubble.parentNode) {
        bubble.parentNode.removeChild(bubble);
      }
    }, duration * 1000);
  }
}

function startBubbleGenerator() {
  setInterval(() => {
    if (state.scanned.length > 0) {
      createSVGbubble(1);
    }
  }, 800);
}

function triggerBubbleExplosion() {
  let count = 0;
  const interval = setInterval(() => {
    createSVGbubble(3);
    count++;
    if (count > 8) clearInterval(interval);
  }, 100);
}

// --- 6. SIMULACIÓN DE ESCANEO DE QR ---
let scanTimeout = null;

function startSimulatedScan(billboardId) {
  if (state.scanned.includes(billboardId)) {
    alert('Ya has escaneado este espectacular en tu recorrido.');
    return;
  }

  const modal = document.getElementById('scanner-modal');
  modal.showModal();

  // Guardar el timeout para poder cancelarlo si el usuario cierra el modal manualmente
  scanTimeout = setTimeout(() => {
    completeScan(billboardId);
  }, 1800);
}

function completeScan(billboardId) {
  const modal = document.getElementById('scanner-modal');
  if (modal.open) {
    modal.close();
  }

  if (!state.scanned.includes(billboardId)) {
    state.scanned.push(billboardId);
    saveCampaignState();
    
    playChime(true);
    triggerBubbleExplosion();
    updateUI();
    
    // Incrementar número de leads/escaneos en el dashboard de analíticas
    animateDashboardStats();

    // Comprobar si se desbloqueó algún Hito
    const newScansCount = state.scanned.length;
    if (newScansCount === 1 || newScansCount === 3 || newScansCount === 5) {
      setTimeout(() => {
        openRewardModal(newScansCount);
      }, 800);
    }
  }
}

// --- 7. APERTURA DE RECOMPENSAS (CUPONES WALLET) ---
function openRewardModal(milestoneId) {
  const milestone = milestones[milestoneId];
  if (!milestone) return;

  const card = document.getElementById('reward-wallet-card-container');
  const badge = document.getElementById('reward-badge-type');
  const title = document.getElementById('reward-wallet-title');
  const desc = document.getElementById('reward-wallet-description');
  const code = document.getElementById('reward-wallet-code');
  const barcodeTxt = document.getElementById('reward-wallet-barcode-txt');

  // Limpiar temas anteriores
  card.className = 'reward-wallet-card';
  if (milestone.themeClass) {
    card.classList.add(milestone.themeClass);
  }

  // Llenar contenido
  badge.textContent = milestone.badgeText;
  title.textContent = milestone.title;
  desc.textContent = milestone.desc;

  const generatedCode = generateCouponCode(milestoneId);
  code.textContent = generatedCode;
  barcodeTxt.textContent = generatedCode;

  // Si es el Gran Premio (Sorteo Hito 5), lanzar confeti rojo y blanco
  if (milestoneId === 5) {
    triggerConfettiExplosion();
  }

  const modal = document.getElementById('reward-modal');
  modal.showModal();
}

function triggerConfettiExplosion() {
  const container = document.body;
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.width = `${5 + Math.random() * 8}px`;
    confetti.style.height = `${8 + Math.random() * 10}px`;
    
    // Colores corporativos Publimex: Rojo y blanco
    const randColor = Math.random();
    if (randColor < 0.65) {
      confetti.style.background = '#E30613'; // Rojo Publimex
    } else if (randColor < 0.90) {
      confetti.style.background = '#ffffff'; // Blanco
    } else {
      confetti.style.background = '#ffd700'; // Dorado
    }

    const duration = 2.0 + Math.random() * 2.5; // de 2s a 4.5s
    confetti.style.animationDuration = `${duration}s`;
    
    container.appendChild(confetti);

    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, duration * 1000);
  }
}

// --- 8. ACTUALIZACIÓN DE LA INTERFAZ DE USUARIO (UI) ---
function updateUI() {
  const scansCount = state.scanned.length;
  
  // 1. Actualizar el contador de escaneos
  const scansDisplay = document.getElementById('scans-count');
  if (scansDisplay) {
    scansDisplay.textContent = scansCount;
  }

  // 2. Mover nivel de energía en el espectacular digital SVG
  // Rango Y: 145 (vacío) a 35 (lleno). Cada scan sube la energía en 22px
  const liquidGroup = document.getElementById('liquid-level-group');
  if (liquidGroup) {
    const targetY = 145 - (scansCount * 22);
    liquidGroup.setAttribute('transform', `translate(0, ${targetY})`);
  }

  // 3. Actualizar texto de estado de la pantalla digital SVG
  const statusText = document.getElementById('screen-status-text');
  if (statusText) {
    if (scansCount === 0) {
      statusText.textContent = 'VACANTE - ESCANEA QR';
      statusText.setAttribute('fill', '#E30613');
    } else if (scansCount > 0 && scansCount < 5) {
      statusText.textContent = `SEÑAL ACTIVA ${scansCount * 20}%`;
      statusText.setAttribute('fill', '#10b981');
    } else {
      statusText.textContent = 'SORTEO 1 DIA COMPLETO';
      statusText.setAttribute('fill', '#ffd700');
    }
  }

  // 4. Actualizar el estado visual de los espectaculares
  for (let i = 1; i <= 5; i++) {
    const card = document.getElementById(`card-${i}`);
    if (card) {
      const indicator = card.querySelector('.status-indicator');
      const triggerBtn = card.querySelector('.scan-trigger-btn');
      
      if (state.scanned.includes(i)) {
        card.classList.add('scanned');
        if (indicator) {
          indicator.className = 'status-indicator status-scanned';
          indicator.textContent = 'Escaneado';
        }
        if (triggerBtn) {
          triggerBtn.disabled = true;
          triggerBtn.textContent = 'Escaneado';
        }
      } else {
        card.classList.remove('scanned');
        if (indicator) {
          indicator.className = 'status-indicator status-idle';
          indicator.textContent = 'Disponible';
        }
        if (triggerBtn) {
          triggerBtn.disabled = false;
          triggerBtn.textContent = 'Simular Escaneo';
        }
      }
    }
  }

  // 5. Actualizar los hitos en el eje vertical
  updateMilestoneNode(1, scansCount >= 1);
  updateMilestoneNode(3, scansCount >= 3);
  updateMilestoneNode(5, scansCount >= 5);
}

function updateMilestoneNode(milestoneId, isCompleted) {
  const node = document.getElementById(`milestone-${milestoneId}`);
  if (!node) return;

  const claimBtn = node.querySelector('.claim-btn');

  if (isCompleted) {
    node.classList.add('completed');
    
    // Si ya reclamó el premio (lo guardó), queda como "Guardado"
    if (state.claimedMilestones.includes(milestoneId)) {
      node.classList.remove('unlocked');
      if (claimBtn) {
        claimBtn.disabled = true;
        claimBtn.textContent = 'Guardado';
        claimBtn.className = 'btn btn-secondary btn-xs claim-btn';
      }
    } else {
      // Completado pero aún no guardado
      node.classList.add('unlocked');
      if (claimBtn) {
        claimBtn.disabled = false;
        claimBtn.textContent = milestoneId === 5 ? 'Ver Boleto' : 'Reclamar';
        claimBtn.className = 'btn btn-accent btn-xs claim-btn';
      }
    }
  } else {
    node.classList.remove('completed', 'unlocked');
    if (claimBtn) {
      claimBtn.disabled = true;
      claimBtn.textContent = milestoneId === 5 ? 'Ver Boleto' : 'Reclamar';
      claimBtn.className = 'btn btn-accent btn-xs claim-btn';
    }
  }
}

// --- 9. SOLUCIÓN DE CIERRE SEGURO DE MODALES (FALLBACK EN JAVASCRIPT) ---
function setupDialogSafeClosing() {
  // 1. Delegación de eventos para botones de cierre de diálogos
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[command="close"]');
    if (closeBtn) {
      const dialogId = closeBtn.getAttribute('commandfor');
      const dialog = document.getElementById(dialogId);
      if (dialog) {
        dialog.close();
        
        // Si el diálogo cerrado es el escáner, cancelamos el escaneo en progreso
        if (dialogId === 'scanner-modal' && scanTimeout) {
          clearTimeout(scanTimeout);
          scanTimeout = null;
        }
      }
    }
  });

  // 2. Soporte nativo para cierre al hacer click fuera del diálogo (Light Dismiss Fallback)
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        dialog.close();
        
        // Cancelar escaneo en progreso si aplica
        if (dialog.id === 'scanner-modal' && scanTimeout) {
          clearTimeout(scanTimeout);
          scanTimeout = null;
        }
      }
    });
  });
}

// --- 10. SIMULADOR DE ANALÍTICAS EN VIVO ---
function animateDashboardStats() {
  const scans = state.scanned.length;
  // Aumentar los datos simulados levemente basados en la actividad interactiva
  const baseScans = 1820 + (scans * 45);
  const display = document.getElementById('stats-total-scans');
  if (display) {
    display.textContent = baseScans.toLocaleString();
  }
}

// --- 11. SIMULADOR DE CANJE DE BENEFICIO COMERCIAL ---
function validateCoupon() {
  const input = document.getElementById('coupon-code-input');
  const codeVal = input.value.trim().toUpperCase();
  const msgBox = document.getElementById('validation-response');
  const statusLabel = document.getElementById('validator-status');

  if (!codeVal) {
    showValidationError('Por favor ingresa un código de cupón/boleto.');
    return;
  }

  // Comprobar si ya fue validado
  if (state.validatedCodes.includes(codeVal)) {
    showValidationError(`El código ${codeVal} ya ha sido validado anteriormente.`);
    return;
  }

  // Comprobar formato Publimex
  let matchedMilestone = null;
  
  if (codeVal.startsWith('PUBLIMEX-MOCKUP-')) {
    matchedMilestone = 1;
  } else if (codeVal.startsWith('PUBLIMEX-DESCUENTO-')) {
    matchedMilestone = 3;
  } else if (codeVal.startsWith('PUBLIMEX-SORTEO-')) {
    matchedMilestone = 5;
  }

  if (matchedMilestone) {
    const scansCount = state.scanned.length;
    if (scansCount < matchedMilestone) {
      showValidationError(`Este código pertenece a un Hito (${matchedMilestone}) que aún no ha sido alcanzado.`);
      return;
    }

    // Registro Exitoso
    state.validatedCodes.push(codeVal);
    saveCampaignState();

    playChime(true);
    
    statusLabel.className = 'status-success-txt';
    statusLabel.textContent = '¡CÓDIGO CONFIRMADO!';
    
    msgBox.className = 'validation-message-box success';
    
    if (matchedMilestone === 5) {
      msgBox.innerHTML = `
        <strong>Sorteo Confirmado:</strong> Boleto de sorteo comercial de 1 Día Gratis validado.<br>
        El lead ha quedado registrado para la rifa del unipolar digital de Santa Fe.
      `;
    } else {
      msgBox.innerHTML = `
        <strong>Descuento Registrado:</strong> Recompensa de Hito ${matchedMilestone} (${milestones[matchedMilestone].title}).<br>
        Se ha aplicado el beneficio a la cotización comercial del anunciante.
      `;
    }
    msgBox.classList.remove('hidden');
    
    input.value = '';
  } else {
    showValidationError('Código inválido. Comprueba el formato de la promoción de Publimex.');
  }
}

function showValidationError(text) {
  playChime(false);
  const statusLabel = document.getElementById('validator-status');
  const msgBox = document.getElementById('validation-response');

  statusLabel.className = 'status-error-txt';
  statusLabel.textContent = '¡ERROR DE VALIDACIÓN!';
  
  msgBox.className = 'validation-message-box error';
  msgBox.innerHTML = `<strong>Error:</strong> ${text}`;
  msgBox.classList.remove('hidden');
}

// --- 12. MANEJADORES DE EVENTOS ---
function setupEventListeners() {
  // Escuchar botones de escaneo
  document.querySelectorAll('.scan-trigger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      startSimulatedScan(id);
    });
  });

  // Escuchar botones de reclamo
  document.querySelectorAll('.claim-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const milestoneId = parseInt(e.target.getAttribute('data-milestone'));
      openRewardModal(milestoneId);
    });
  });

  // Guardar en Apple Wallet
  const saveWalletBtn = document.getElementById('save-wallet-action');
  if (saveWalletBtn) {
    saveWalletBtn.addEventListener('click', () => {
      const codeLabel = document.getElementById('reward-wallet-code').textContent;
      let milestoneId = 1;
      if (codeLabel.startsWith('PUBLIMEX-DESCUENTO-')) milestoneId = 3;
      if (codeLabel.startsWith('PUBLIMEX-SORTEO-')) milestoneId = 5;

      if (!state.claimedMilestones.includes(milestoneId)) {
        state.claimedMilestones.push(milestoneId);
        saveCampaignState();
        updateUI();
      }

      document.getElementById('reward-modal').close();
      
      // Auto-rellenar validador
      const valInput = document.getElementById('coupon-code-input');
      if (valInput) {
        valInput.value = codeLabel;
        valInput.focus();
        document.getElementById('redencion').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Validación comercial
  const validateBtn = document.getElementById('validate-coupon-btn');
  if (validateBtn) {
    validateBtn.addEventListener('click', validateCoupon);
  }

  // Reiniciar campaña
  const resetBtn = document.getElementById('reset-campaign');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('¿Deseas reiniciar la simulación para volver a presentar el pitch al CEO?')) {
        state.scanned = [];
        state.claimedMilestones = [];
        state.validatedCodes = [];
        saveCampaignState();
        
        document.getElementById('coupon-code-input').value = '';
        document.getElementById('validator-status').className = 'status-waiting';
        document.getElementById('validator-status').textContent = 'Esperando Código de Promoción...';
        document.getElementById('validation-response').classList.add('hidden');
        
        updateUI();
        animateDashboardStats();
      }
    });
  }
}

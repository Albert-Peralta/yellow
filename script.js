const messages = [
  "Hola 🌼",
  "Quería regalarte algo",
  "Pero no sabia como hacerlo y me daba pena jeje",
  "asi que fue lo único que se me ocurrió ^~^",
  "Nada muy elaborado... solo unas flores amarillas",
  "Dicen que representan alegría, amistad y buena energía",
  "Así que solo quería decirte...",
  "Ya tomaste cafe jajaja",
  "No,no ahora si",
  "**** *** *** ****, but",
  "Que tengas un día tan bonito como este color 🌻",
];

// -- Generador de flores realistas (pétalos en capas + centro con espiral de fibonacci) --

let flowerUid = 0;

// patrón de semillas real de girasol: espiral de filotaxis (ángulo dorado 137.5°)
function phyllotaxisDots(cx, cy, maxR, count, colors) {
  const golden = 137.508 * (Math.PI / 180);
  let dots = '';
  for (let i = 0; i < count; i++) {
    const r = maxR * Math.sqrt(i / count);
    const theta = i * golden;
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    const size = 0.5 + (i / count) * 0.65;
    const color = colors[i % colors.length];
    dots += `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${size.toFixed(2)}" ry="${(size * 0.75).toFixed(2)}" fill="${color}" transform="rotate(${(theta * 180 / Math.PI).toFixed(1)} ${x.toFixed(2)} ${y.toFixed(2)})"/>`;
  }
  return dots;
}

function petalLayer(count, cx, cy, tipLen, baseW, fill, offset, opts = {}) {
  const { stroke, veinColor } = opts;
  let petals = '';
  const step = 360 / count;
  for (let i = 0; i < count; i++) {
    const angle = i * step + offset;
    const tipY = cy - tipLen;
    const cpW = baseW;
    const d = `M${cx},${cy} C ${cx - cpW},${cy - tipLen * 0.55} ${cx - cpW * 0.5},${tipY + tipLen * 0.2} ${cx},${tipY} C ${cx + cpW * 0.5},${tipY + tipLen * 0.2} ${cx + cpW},${cy - tipLen * 0.55} ${cx},${cy} Z`;
    const strokeAttr = stroke ? `stroke="${stroke}" stroke-width="0.4"` : '';
    const vein = veinColor
      ? `<line x1="${cx}" y1="${cy - 2}" x2="${cx}" y2="${(tipY + tipLen * 0.18).toFixed(2)}" stroke="${veinColor}" stroke-width="0.35" opacity="0.55"/>`
      : '';
    petals += `<g transform="rotate(${angle.toFixed(2)} ${cx} ${cy})"><path d="${d}" fill="${fill}" ${strokeAttr}/>${vein}</g>`;
  }
  return petals;
}

function flowerMarkup(variant, detail = 'full', withStem = true) {
  const uid = flowerUid++;
  const cx = 50, cy = 46;
  const isSunflower = variant === 'sunflower';
  const isLow = detail === 'low';

  const backCount = isLow ? 9 : (isSunflower ? 15 : 20);
  const frontCount = backCount;
  const backLen = isSunflower ? 34 : 30;
  const frontLen = isSunflower ? 26 : 23;
  const backW = isSunflower ? 11 : 7.5;
  const frontW = isSunflower ? 8 : 5.5;
  const centerR = isSunflower ? 13 : 8.5;

  const petalBackFill = `url(#petalBack${uid})`;
  const petalFrontFill = `url(#petalFront${uid})`;
  const centerFill = `url(#center${uid})`;

  const backPetals = petalLayer(backCount, cx, cy, backLen, backW, petalBackFill, 0);
  const frontPetals = petalLayer(frontCount, cx, cy, frontLen, frontW, petalFrontFill, 180 / frontCount, {
    stroke: 'rgba(255,255,255,0.4)',
    veinColor: isLow ? null : (isSunflower ? 'rgba(140,85,10,0.4)' : 'rgba(200,140,20,0.35)'),
  });

  const seedColors = isSunflower
    ? ['#5C3A10', '#7A4B14', '#3E2A0C', '#8B5A20']
    : ['#E8A317', '#FFC94A'];
  const seedCount = isLow ? 14 : (isSunflower ? 90 : 34);
  const seeds = phyllotaxisDots(cx, cy, centerR - 1, seedCount, seedColors);

  const leafGrad = `leaf${uid}`;

  const stemAndLeaves = withStem ? `
  <ellipse cx="50" cy="144" rx="16" ry="3.2" fill="#8a6d1d" opacity="0.18"/>

  <path d="M50,76 C 47,95 53,115 50,146" stroke="#4a7c2f" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <path d="M50,100 C 36,102 26,110 18,122 C 28,120 38,116 50,110 Z" fill="url(#${leafGrad})"/>
  <path d="M50,100 C 36,102 26,110 18,122" stroke="#1B5E20" stroke-width="0.6" fill="none" opacity="0.5"/>
  <path d="M50,118 C 62,121 71,128 78,138 C 69,135 60,130 50,126 Z" fill="url(#${leafGrad})" opacity="0.92"/>
  ` : '';

  const viewBoxAttr = withStem ? '0 0 100 150' : '0 0 100 82';

  return `
<svg viewBox="${viewBoxAttr}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="petalBack${uid}" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="${isSunflower ? '#F57F17' : '#F9A825'}"/>
      <stop offset="100%" stop-color="${isSunflower ? '#FDD835' : '#FFEE58'}"/>
    </linearGradient>
    <linearGradient id="petalFront${uid}" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="${isSunflower ? '#FFB300' : '#FFC107'}"/>
      <stop offset="100%" stop-color="${isSunflower ? '#FFF176' : '#FFF9C4'}"/>
    </linearGradient>
    <radialGradient id="center${uid}" cx="35%" cy="32%" r="75%">
      <stop offset="0%" stop-color="${isSunflower ? '#A9651B' : '#FFD54F'}"/>
      <stop offset="55%" stop-color="${isSunflower ? '#7B4B12' : '#FFB300'}"/>
      <stop offset="100%" stop-color="${isSunflower ? '#4E2F0B' : '#F57F17'}"/>
    </radialGradient>
    <linearGradient id="${leafGrad}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7CB342"/>
      <stop offset="100%" stop-color="#2E7D32"/>
    </linearGradient>
  </defs>

  ${stemAndLeaves}

  <g>
    ${backPetals}
    ${frontPetals}
    <ellipse cx="${cx - 20}" cy="${cy - 24}" rx="18" ry="11" fill="#fff" opacity="0.12" transform="rotate(-25 ${cx - 20} ${cy - 24})"/>
    <circle cx="${cx}" cy="${cy}" r="${centerR}" fill="${centerFill}"/>
    ${seeds}
    <circle cx="${cx}" cy="${cy}" r="${centerR}" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="0.5"/>
    <ellipse cx="${cx - centerR * 0.35}" cy="${cy - centerR * 0.4}" rx="${centerR * 0.4}" ry="${centerR * 0.25}" fill="#fff" opacity="0.22"/>
  </g>
</svg>`;
}

// ramita de relleno estilo "paniculata" para dar volumen entre las flores principales
function fillerSprigSVG() {
  const dots = [
    [20, 10], [13, 18], [27, 16], [20, 24], [9, 28], [31, 26], [19, 34], [26, 36],
  ];
  const dotMarkup = dots
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${(1.4 + Math.random() * 1.1).toFixed(2)}" fill="#fffdf5" stroke="rgba(150,110,20,0.18)" stroke-width="0.3"/>`)
    .join('');
  return `
<svg viewBox="0 0 40 130" xmlns="http://www.w3.org/2000/svg">
  <path d="M20,38 C18,70 22,102 20,128" stroke="#4a7c2f" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M20,52 C14,55 9,60 6,66" stroke="#4a7c2f" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M20,66 C26,69 31,74 34,80" stroke="#4a7c2f" stroke-width="1" fill="none" stroke-linecap="round"/>
  ${dotMarkup}
</svg>`;
}

const introScreen = document.getElementById('intro');
const sceneScreen = document.getElementById('scene');
const openBtn = document.getElementById('openBtn');
const flowersContainer = document.getElementById('flowers');
const bgFlowersContainer = document.getElementById('bgFlowers');
const bigFlowerHeadContainer = document.getElementById('bigFlowerHead');
const petalRainContainer = document.getElementById('petalRain');
const finaleOverlay = document.getElementById('finaleOverlay');
const finaleClose = document.getElementById('finaleClose');
const finaleAudio = document.getElementById('finaleAudio');
const musicToggle = document.getElementById('musicToggle');
const photoToggle = document.getElementById('photoToggle');
const finaleCountdown = document.getElementById('finaleCountdown');
const countdownNumber = document.getElementById('countdownNumber');
let sideBouquetEls = [];
let userPausedMusic = false;
let countdownIntervalId = null;
const messageText = document.getElementById('messageText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressDotsContainer = document.getElementById('progressDots');

let step = 0;

let bouquetUid = 0;

// construye un ramo (opcionalmente con papel + moño) dentro del contenedor dado
function buildBouquet(container, layout, scaleFactor, withWrap = true) {
  const uid = bouquetUid++;

  if (withWrap) {
    const wrapEl = document.createElement('div');
    wrapEl.className = 'bouquet-wrap';
    wrapEl.innerHTML = `
<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wrapGrad${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fffaf0"/>
      <stop offset="100%" stop-color="#e8d3a0"/>
    </linearGradient>
  </defs>
  <path d="M14,0 L206,0 L118,150 L102,150 Z" fill="url(#wrapGrad${uid})" stroke="rgba(150,110,40,0.35)" stroke-width="2"/>
  <path d="M60,0 L104,150" stroke="rgba(150,110,40,0.18)" stroke-width="1.5" fill="none"/>
  <path d="M160,0 L116,150" stroke="rgba(150,110,40,0.18)" stroke-width="1.5" fill="none"/>
</svg>`;
    container.appendChild(wrapEl);

    const bowEl = document.createElement('div');
    bowEl.className = 'bouquet-bow';
    bowEl.innerHTML = `
<svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg">
  <path d="M50,30 C30,5 5,10 8,30 C5,50 30,45 50,30 Z" fill="#d98e3f"/>
  <path d="M50,30 C70,5 95,10 92,30 C95,50 70,45 50,30 Z" fill="#e6a24e"/>
  <path d="M50,30 L38,68 L46,64 L50,70 L54,64 L62,68 Z" fill="#d98e3f"/>
  <circle cx="50" cy="30" r="9" fill="#c97f2e"/>
</svg>`;
    container.appendChild(bowEl);
  }

  layout.forEach((cfg, i) => {
    const item = document.createElement('div');
    item.className = 'flower sway';
    item.style.setProperty('--tilt', `${cfg.tilt}deg`);
    item.style.zIndex = String(cfg.z);
    if (i > 0) {
      item.style.marginLeft = `clamp(${(-46 * scaleFactor).toFixed(1)}px, ${(-5 * scaleFactor).toFixed(2)}vw, ${(-74 * scaleFactor).toFixed(1)}px)`;
    }
    item.style.animationDelay = `${i * 0.12}s, ${0.9 + i * 0.12}s`;

    if (cfg.kind === 'filler') {
      item.style.width = `clamp(${(16 * cfg.scale * scaleFactor).toFixed(1)}px, ${(3.4 * cfg.scale * scaleFactor).toFixed(2)}vw, ${(34 * cfg.scale * scaleFactor).toFixed(1)}px)`;
      item.innerHTML = fillerSprigSVG();
    } else {
      item.style.width = `clamp(${(38 * cfg.scale * scaleFactor).toFixed(1)}px, ${(9 * cfg.scale * scaleFactor).toFixed(2)}vw, ${(90 * cfg.scale * scaleFactor).toFixed(1)}px)`;
      item.innerHTML = flowerMarkup(cfg.variant);
    }
    container.appendChild(item);
  });
}

function renderFlowers() {
  // ramo principal: relleno de paniculata entre las flores principales,
  // todo convergiendo en abanico desde el centro
  const mainLayout = [
    { kind: 'flower', variant: 'daisy', scale: 0.5, tilt: -26, z: 4 },
    { kind: 'filler', scale: 0.55, tilt: -20, z: 1 },
    { kind: 'flower', variant: 'sunflower', scale: 0.68, tilt: -15, z: 6 },
    { kind: 'flower', variant: 'sunflower', scale: 0.86, tilt: -6, z: 8 },
    { kind: 'flower', variant: 'sunflower', scale: 1, tilt: 0, z: 10 },
    { kind: 'flower', variant: 'sunflower', scale: 0.86, tilt: 6, z: 8 },
    { kind: 'flower', variant: 'sunflower', scale: 0.68, tilt: 15, z: 6 },
    { kind: 'filler', scale: 0.55, tilt: 20, z: 1 },
    { kind: 'flower', variant: 'daisy', scale: 0.5, tilt: 26, z: 4 },
  ];
  buildBouquet(flowersContainer, mainLayout, 1, false);

  // dos ramos mas pequeños, uno a cada lado, con 5 flores cada uno
  const sideLayout = [
    { kind: 'flower', variant: 'daisy', scale: 0.55, tilt: -20, z: 3 },
    { kind: 'flower', variant: 'sunflower', scale: 0.75, tilt: -8, z: 5 },
    { kind: 'flower', variant: 'sunflower', scale: 0.85, tilt: 0, z: 6 },
    { kind: 'flower', variant: 'sunflower', scale: 0.75, tilt: 8, z: 5 },
    { kind: 'flower', variant: 'daisy', scale: 0.55, tilt: 20, z: 3 },
  ];

  const leftBouquet = document.createElement('div');
  leftBouquet.className = 'side-bouquet side-left';
  sceneScreen.appendChild(leftBouquet);
  buildBouquet(leftBouquet, sideLayout, 0.68, false);

  const rightBouquet = document.createElement('div');
  rightBouquet.className = 'side-bouquet side-right';
  sceneScreen.appendChild(rightBouquet);
  buildBouquet(rightBouquet, sideLayout, 0.68, false);

  sideBouquetEls = [leftBouquet, rightBouquet];
}

function renderBackgroundFlowers() {
  const count = 70;
  const spread = 1.8; // segundos totales en que terminan de aparecer todas

  // orden aleatorio para que no crezcan en fila sino "salpicado"
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = 'bg-flower';
    const size = 14 + Math.random() * 26;
    const top = 40 + Math.random() * 58; // deja libre la franja superior donde van los ramos
    const left = 1 + Math.random() * 98;
    const tilt = (Math.random() * 20 - 10).toFixed(1);
    const delay = ((order[i] / count) * spread + Math.random() * 0.12).toFixed(2);
    const opacity = (0.35 + Math.random() * 0.45).toFixed(2);
    const twinkleDuration = (6 + Math.random() * 8).toFixed(2);
    const twinkleDelay = (Number(delay) + 1.05).toFixed(2);

    div.style.top = `${top}%`;
    div.style.left = `${left}%`;
    div.style.width = `${size}px`;
    div.style.setProperty('--tilt', `${tilt}deg`);
    div.style.setProperty('--op', opacity);
    div.style.animationDelay = `${delay}s, ${twinkleDelay}s`;
    div.style.animationDuration = `1s, ${twinkleDuration}s`;
    div.innerHTML = flowerMarkup(Math.random() < 0.6 ? 'sunflower' : 'daisy', 'low');
    bgFlowersContainer.appendChild(div);
  }
}

function renderBigFlowerHead() {
  bigFlowerHeadContainer.innerHTML = flowerMarkup('sunflower', 'full', false);
}

const petalColors = ['#FDD835', '#FFC107', '#FFEE58', '#FFB300'];

function petalShapeSVG(color) {
  return `<svg viewBox="0 0 20 26" xmlns="http://www.w3.org/2000/svg">
    <path d="M10,26 C3,18 1,8 10,0 C19,8 17,18 10,26 Z" fill="${color}"/>
    <path d="M10,24 C10,17 10,9 10,2" stroke="rgba(255,255,255,0.4)" stroke-width="0.6" fill="none"/>
  </svg>`;
}

function spawnPetals(count, { freshStart = false } = {}) {
  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = 'petal';
    const size = 10 + Math.random() * 12;
    const left = Math.random() * 100;
    const duration = 9 + Math.random() * 9;
    const delay = freshStart ? Math.random() * 0.6 : -Math.random() * duration; // ya en pleno vuelo desde el inicio
    const drift = (Math.random() * 120 - 60).toFixed(0);
    const spin = (Math.random() < 0.5 ? 1 : -1) * (260 + Math.random() * 260);
    const opacity = (0.5 + Math.random() * 0.35).toFixed(2);
    const color = petalColors[Math.floor(Math.random() * petalColors.length)];

    div.style.left = `${left}%`;
    div.style.width = `${size}px`;
    div.style.setProperty('--drift', `${drift}px`);
    div.style.setProperty('--spin', `${spin}deg`);
    div.style.setProperty('--op', opacity);
    div.style.animationDuration = `${duration}s`;
    div.style.animationDelay = `${delay}s`;
    div.innerHTML = petalShapeSVG(color);
    petalRainContainer.appendChild(div);
  }
}

function renderPetalRain() {
  spawnPetals(18);
}

function renderProgressDots() {
  progressDotsContainer.innerHTML = '';
  messages.forEach(() => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    progressDotsContainer.appendChild(dot);
  });
}

function playFinale() {
  // en moviles (sobre todo iOS) solo se permite arrancar audio CON sonido
  // dentro del toque real del usuario. Como hay una cuenta regresiva de por
  // medio, en vez de intentar reproducir con sonido despues, arrancamos la
  // cancion en silencio (muted) ahora mismo, dentro del click, y luego
  // solo le quitamos el silencio al terminar la cuenta: quitar el mute a
  // algo que ya esta sonando si esta permitido sin gesto reciente.
  if (finaleAudio.paused && !userPausedMusic) {
    finaleAudio.muted = true;
    finaleAudio.currentTime = 0;
    finaleAudio.play().catch(() => {});
  }

  const bouquets = [flowersContainer, ...sideBouquetEls];
  bouquets.forEach((el) => {
    el.classList.remove('finale');
    void el.offsetWidth; // reinicia la animación
    el.classList.add('finale');
  });
  spawnPetals(16, { freshStart: true });

  // le da tiempo de leer el mensaje y muestra una cuenta regresiva
  // para avisar que algo mas esta por llegar, y despues revela la sorpresa
  clearCountdown();
  let count = 5;
  countdownNumber.textContent = count;
  finaleCountdown.classList.remove('hidden');

  countdownIntervalId = setInterval(() => {
    count--;
    if (count <= 0) {
      clearCountdown();
      revealFinaleSurprise();
    } else {
      countdownNumber.textContent = count;
    }
  }, 1000);
}

function clearCountdown() {
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }
  finaleCountdown.classList.add('hidden');
}

function revealFinaleSurprise() {
  finaleOverlay.classList.add('show');
  musicToggle.classList.remove('hidden');
  photoToggle.classList.remove('hidden');

  if (userPausedMusic) return;

  if (!finaleAudio.paused) {
    // ya estaba sonando en silencio desde el click; ahora solo le quitamos el mute
    finaleAudio.muted = false;
    return;
  }

  // por si acaso no se pudo arrancar antes (ej. audio no soportado),
  // lo intentamos aqui como respaldo
  finaleAudio.muted = false;
  finaleAudio.play().catch(() => {
    // el navegador bloqueó el autoplay con sonido;
    // el botón de música queda visible para que lo activen con un toque
    musicToggle.classList.add('paused');
  });
}

finaleClose.addEventListener('click', () => {
  finaleOverlay.classList.remove('show');
});

photoToggle.addEventListener('click', () => {
  finaleOverlay.classList.add('show');
});

musicToggle.addEventListener('click', () => {
  if (finaleAudio.paused) {
    finaleAudio.muted = false;
    finaleAudio.play();
    userPausedMusic = false;
    musicToggle.classList.remove('paused');
  } else {
    finaleAudio.pause();
    userPausedMusic = true;
    musicToggle.classList.add('paused');
  }
});

function showMessage(index) {
  messageText.classList.remove('fade');
  void messageText.offsetWidth; // reinicia la animación
  messageText.textContent = messages[index];
  messageText.classList.add('fade');

  [...progressDotsContainer.children].forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  prevBtn.classList.toggle('hidden', index === 0);
  nextBtn.classList.toggle('hidden', index === messages.length - 1);

  if (index === messages.length - 1) {
    playFinale();
  }
}

openBtn.addEventListener('click', () => {
  introScreen.classList.remove('active');
  sceneScreen.classList.add('active');
  renderBackgroundFlowers();
  renderFlowers();
  renderBigFlowerHead();
  renderPetalRain();
  renderProgressDots();
  showMessage(step);
});

prevBtn.addEventListener('click', () => {
  if (step > 0) {
    finaleOverlay.classList.remove('show');
    clearCountdown();
    step--;
    showMessage(step);
  }
});

nextBtn.addEventListener('click', () => {
  if (step < messages.length - 1) {
    step++;
    showMessage(step);
  }
});

// ========== COACH MODAL ==========
// Remplace COACH_VIDEO_URL par l'URL d'embed Google Drive
// Format : https://drive.google.com/file/d/TON_FILE_ID/preview
const COACH_VIDEO_URL = 'https://drive.google.com/file/d/19loAMvjDmK89Ti6GsvXabJI56xSeMC7y/preview';
const COACH_REVEAL = new Date('2026-04-02T12:00:00+02:00');

function initCoachBanner() {
  const banner = document.getElementById('coachBanner');
  const cgu = document.getElementById('coachCGU');
  banner.style.display = 'none';
  if (cgu) cgu.style.display = 'inline';
}

function openCoachModal() {
  const modal = document.getElementById('coachModal');
  const iframe = document.getElementById('coachVideo');
  iframe.src = COACH_VIDEO_URL;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCoachModal(event) {
  if (event && event.target !== document.getElementById('coachModal')) return;
  const modal = document.getElementById('coachModal');
  const iframe = document.getElementById('coachVideo');
  modal.classList.remove('open');
  iframe.src = '';
  document.body.style.overflow = '';
}

initCoachBanner();

// ========== COUNTDOWN ==========
const raceDate = new Date('2026-04-04T05:32:30+02:00');
function updateCountdown() {
  const now = new Date();
  const diff = raceDate - now;
  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = '<div class="team-badge" style="font-size:16px">🏃 C\'EST PARTI !</div>';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-d').textContent = d;
  document.getElementById('cd-h').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-m').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-s').textContent = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ========== WEATHER (Open-Meteo) ==========
const WMO_ICONS = {
  0: '☀️', 1: '🌤', 2: '⛅', 3: '☁️',
  45: '🌫', 48: '🌫',
  51: '🌦', 53: '🌦', 55: '🌧',
  61: '🌧', 63: '🌧', 65: '🌧',
  71: '🌨', 73: '🌨', 75: '❄️',
  77: '🌨', 80: '🌦', 81: '🌧', 82: '⛈',
  85: '🌨', 86: '🌨',
  95: '⛈', 96: '⛈', 99: '⛈'
};

async function loadWeather() {
  const strip = document.getElementById('weatherStrip');
  try {
    // Fetch hourly data for race day window (5h-14h)
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=45.884&longitude=-1.19&hourly=temperature_2m,weathercode,windspeed_10m,precipitation_probability&timezone=Europe/Paris&start_date=2026-04-04&end_date=2026-04-04';
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('API error');
    const data = await resp.json();

    const h = data.hourly;
    const nowHour = new Date().getHours();
    const isRaceDay = new Date().toISOString().slice(0, 10) === '2026-04-04';

    let html = '<div class="weather-label">🌤 Prévisions météo du jour de course — 4 avril</div><div class="weather-hours">';
    // Show hours 5 to 14 (5h30 start, ~13h30 finish)
    for (let i = 5; i <= 14; i++) {
      const temp = Math.round(h.temperature_2m[i]);
      const code = h.weathercode[i];
      const wind = Math.round(h.windspeed_10m[i]);
      const rain = h.precipitation_probability[i];
      const icon = WMO_ICONS[code] || '🌤';
      const isNow = isRaceDay && i === nowHour;

      html += `<div class="wh-slot ${isNow ? 'wh-now' : ''}">
        <span class="wh-time">${i}h</span>
        <span class="wh-icon">${icon}</span>
        <span class="wh-temp">${temp}°</span>
        <span class="wh-wind">💨 ${wind}</span>
        ${rain > 0 ? `<span class="wh-rain">💧${rain}%</span>` : ''}
      </div>`;
    }
    html += '</div>';
    strip.innerHTML = html;
  } catch (e) {
    // Fallback: just show a link to meteo
    strip.innerHTML = '<div class="weather-label">🌤 Prévisions météo du jour de course — 4 avril</div><div class="weather-loading"><a href="https://meteofrance.com/previsions-meteo-france/le-chateau-doleron/17480" target="_blank" style="color:var(--sunset-light);text-decoration:none">Voir la météo →</a></div>';
  }
}

loadWeather();

// ========== TIMELINE ==========
const runners = [
  { name: 'KLUMY', cls: 'klumy', from: 'Départ (Château)', to: 'Grand-Village', distKm: 25.27, emoji: '🟢', color: 'var(--klumy)' },
  { name: 'SISI', cls: 'sisi', from: 'Grand-Village', to: 'Domino', distKm: 22.97, emoji: '🔵', color: 'var(--sisi)', barrier: 'Barrière horaire : 14h au 48e km' },
  { name: 'MAT', cls: 'mat', from: 'Domino', to: 'Gautrelle', distKm: 28.61, emoji: '🟠', color: 'var(--mat)', barrier: 'Barrière horaire : 18h au 75e km' },
  { name: 'TOTO', cls: 'toto', from: 'Gautrelle', to: 'Arrivée (Château)', distKm: 24.55, emoji: '🟣', color: 'var(--toto)' },
];

// Build pace options: 3:45 to 9:00 by 5s steps
function buildPaceOptions() {
  const opts = [];
  for (let totalSec = 3*60+45; totalSec <= 9*60+0; totalSec += 5) {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    opts.push({ label: `${m}:${String(s).padStart(2,'0')} /km`, value: totalSec });
  }
  return opts;
}
const paceOptions = buildPaceOptions();

// Load saved paces
const savedPaces = JSON.parse(localStorage.getItem('jppjr-paces') || '{}');

function savePaces() {
  const paces = {};
  runners.forEach((r, i) => {
    paces[i] = parseInt(document.getElementById(`pace-${i}`).value);
  });
  localStorage.setItem('jppjr-paces', JSON.stringify(paces));
}

// Build pace selector UI
const paceContainer = document.getElementById('paceRunners');
runners.forEach((r, i) => {
  const defaultPace = savedPaces[i] || 5*60; // default 5:00/km
  const row = document.createElement('div');
  row.className = 'pace-row';
  row.style.borderLeftColor = r.color;
  row.innerHTML = `
    <span class="pr-name" style="color:${r.color}">${r.emoji} ${r.name}</span>
    <span class="pr-dist">${r.distKm.toFixed(1)} km</span>
    <select id="pace-${i}">
      ${paceOptions.map(o => `<option value="${o.value}" ${o.value === defaultPace ? 'selected' : ''}>${o.label}</option>`).join('')}
    </select>
    <span class="pr-eta" id="eta-${i}">--</span>
  `;
  paceContainer.appendChild(row);
  row.querySelector('select').addEventListener('change', () => { savePaces(); renderTimeline(); });
});

function fmtTime(date) {
  return String(date.getHours()).padStart(2,'0') + 'h' + String(date.getMinutes()).padStart(2,'0');
}

function fmtDuration(mins) {
  const total = Math.round(mins);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? `${h}h${String(m).padStart(2,'0')}` : `${m}min`;
}

function renderTimeline() {
  let currentTime = new Date(raceDate);
  let html = '';

  runners.forEach((r, i) => {
    const paceSec = parseInt(document.getElementById(`pace-${i}`).value);
    const pacePerKm = paceSec / 60; // minutes per km
    const startTime = new Date(currentTime);
    const durationMin = r.distKm * pacePerKm;
    currentTime = new Date(currentTime.getTime() + durationMin * 60000);

    // Update ETA in pace row
    document.getElementById(`eta-${i}`).textContent = fmtDuration(durationMin);

    html += `<div class="tl-item ${r.cls}">
      <div class="tl-card">
        <div class="tl-runner">${r.emoji} ${r.name}</div>
        <div class="tl-details">
          ${r.from} → ${r.to}<br>
          ${r.distKm.toFixed(1)} km · ${fmtDuration(durationMin)} à ${Math.floor(paceSec/60)}:${String(paceSec%60).padStart(2,'0')}/km
        </div>
        <div class="tl-time">🕐 ${fmtTime(startTime)} → ${fmtTime(currentTime)}</div>
        ${r.barrier ? `<div class="tl-barrier">⚠ ${r.barrier}</div>` : ''}
      </div>
    </div>`;
  });

  document.getElementById('timelineContent').innerHTML = html;

  const totalMin = (currentTime - raceDate) / 60000;
  const totalDist = runners.reduce((s, r) => s + r.distKm, 0);
  const avgPaceSec = totalMin * 60 / totalDist;
  const avgM = Math.floor(avgPaceSec / 60);
  const avgS = Math.round(avgPaceSec % 60);
  document.getElementById('finishTime').textContent = `${fmtTime(currentTime)} (${fmtDuration(totalMin)}) · moy. ${avgM}:${String(avgS).padStart(2,'0')}/km`;
}

renderTimeline();

// ========== TERRAIN ==========
const terrainData = {
  categories: [
    'Sentier (présumé)', 'Route/Dur', 'Sable', 'Chemin (présumé)',
    'Terre/Sentier', 'Non couvert', 'Chemin stabilisé', 'Route (présumé)',
    'Herbe', 'Piste cyclable', 'Escalier', 'Non revêtu', 'Bois/Caillebotis'
  ],
  colors: [
    '#e8764b', '#2e9abf', '#f4c542', '#9b59b6',
    '#b5651d', '#95a5a6', '#8e44ad', '#3498db',
    '#27ae60', '#1abc9c', '#e74c3c', '#e67e22', '#d4a574'
  ],
  pct: [
    [37.3, 31.0, 10.9, 23.1],
    [20.9,  9.8, 17.8, 10.0],
    [17.6, 13.7, 10.8, 10.0],
    [ 1.5,  6.0,  9.0, 16.4],
    [ 6.4,  8.6,  8.7,  0.4],
    [ 7.5, 18.6,  8.7,  9.7],
    [ 2.1,  7.9, 23.4,  2.4],
    [ 6.0,  3.4,  8.8, 19.8],
    [ 0.7,  0.0,  1.2,  0.0],
    [ 0.0,  0.3,  0.0,  8.3],
    [ 0.0,  0.3,  0.0,  0.0],
    [ 0.0,  0.3,  0.1,  0.0],
    [ 0.0,  0.0,  0.6,  0.0],
  ],
  km: [
    [ 9.42, 7.11, 3.11, 5.66],
    [ 5.29, 2.25, 5.10, 2.45],
    [ 4.46, 3.14, 3.08, 2.45],
    [ 0.38, 1.38, 2.58, 4.03],
    [ 1.62, 1.97, 2.48, 0.09],
    [ 1.90, 4.27, 2.50, 2.37],
    [ 0.53, 1.82, 6.69, 0.58],
    [ 1.51, 0.79, 2.53, 4.87],
    [ 0.17, 0.00, 0.35, 0.00],
    [ 0.00, 0.08, 0.00, 2.04],
    [ 0.00, 0.08, 0.00, 0.00],
    [ 0.00, 0.08, 0.03, 0.00],
    [ 0.00, 0.00, 0.16, 0.01],
  ],
  runnerNames: ['KLUMY', 'SISI', 'MAT', 'TOTO'],
  runnerDist: [25.28, 22.97, 28.61, 24.55],
};

let terrainMode = 'pct';
let terrainRunner = 0; // -1 could be "all" but let's start with 0

function setTerrainMode(mode, btn) {
  terrainMode = mode;
  btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTerrain();
}

function setTerrainRunner(idx, btn) {
  terrainRunner = idx;
  btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTerrain();
}

// Build runner tabs
const ttabs = document.getElementById('terrainTabs');
const runnerColors = ['var(--klumy)', 'var(--sisi)', 'var(--mat)', 'var(--toto)'];
const runnerEmojis = ['🟢', '🔵', '🟠', '🟣'];
terrainData.runnerNames.forEach((name, i) => {
  const btn = document.createElement('button');
  btn.textContent = `${runnerEmojis[i]} ${name}`;
  btn.setAttribute('data-r', i);
  if (i === 0) btn.classList.add('active');
  btn.style.setProperty('--rc', runnerColors[i]);
  btn.addEventListener('click', function() { setTerrainRunner(i, this); });
  ttabs.appendChild(btn);
});

function renderTerrain() {
  const ri = terrainRunner;
  const data = terrainMode === 'pct' ? terrainData.pct : terrainData.km;
  const maxVal = terrainMode === 'pct' ? 40 : Math.max(...data.map(row => row[ri]));
  const suffix = terrainMode === 'pct' ? '%' : ' km';

  // Sort by value descending for current runner
  const indices = terrainData.categories.map((_, i) => i);
  indices.sort((a, b) => data[b][ri] - data[a][ri]);

  // Filter out zero values
  const filtered = indices.filter(i => data[i][ri] > 0);

  const barsEl = document.getElementById('terrainBars');
  barsEl.innerHTML = filtered.map(ci => {
    const val = data[ci][ri];
    const pct = (val / maxVal) * 100;
    const color = terrainData.colors[ci];
    const label = terrainData.categories[ci];
    const displayVal = terrainMode === 'pct' ? val.toFixed(1) + '%' : val.toFixed(2) + ' km';
    return `<div class="tb-row">
      <span class="tb-label">${label}</span>
      <div class="tb-bar-bg">
        <div class="tb-bar-fill" style="width:${Math.max(pct, 2)}%;background:${color}">${pct > 15 ? displayVal : ''}</div>
      </div>
      <span class="tb-val">${displayVal}</span>
    </div>`;
  }).join('');

  // Summary boxes
  const name = terrainData.runnerNames[ri];
  const dist = terrainData.runnerDist[ri];
  const pctRoute = terrainData.pct[1][ri] + terrainData.pct[7][ri]; // Route/Dur + Route (présumé)
  const pctSable = terrainData.pct[2][ri];
  const pctSentier = terrainData.pct[0][ri] + terrainData.pct[4][ri]; // Sentier + Terre/Sentier

  document.getElementById('terrainSummary').innerHTML = `
    <div class="ts-box"><div class="ts-val">${dist.toFixed(1)}</div><div class="ts-lbl">km total</div></div>
    <div class="ts-box"><div class="ts-val" style="color:var(--sunset)">${pctSable.toFixed(0)}%</div><div class="ts-lbl">Sable ⚠️</div></div>
    <div class="ts-box"><div class="ts-val" style="color:var(--klumy)">${pctSentier.toFixed(0)}%</div><div class="ts-lbl">Sentier/Terre</div></div>
  `;
}

renderTerrain();

// ========== MAP ==========
// Simplified GPX track (every ~100m, 740 points)
const TRACK = [
[45.88425,-1.18953],[45.88443,-1.19078],[45.88502,-1.19226],[45.88547,-1.1934],[45.88596,-1.1947],[45.88499,-1.19482],[45.88418,-1.19538],[45.88383,-1.19404],[45.88346,-1.19258],[45.88269,-1.19218],
[45.88187,-1.19321],[45.88095,-1.19386],[45.88001,-1.19364],[45.87771,-1.19367],[45.87673,-1.19372],[45.87498,-1.19292],[45.87342,-1.19304],[45.87329,-1.19469],[45.87241,-1.19583],[45.87227,-1.19702],
[45.87134,-1.19722],[45.87046,-1.19748],[45.86946,-1.19799],[45.86867,-1.1988],[45.86772,-1.20004],[45.86694,-1.19992],[45.86628,-1.19965],[45.86579,-1.19811],[45.86504,-1.19699],[45.86411,-1.19677],
[45.86265,-1.19692],[45.86314,-1.19845],[45.86364,-1.19972],[45.86419,-1.20121],[45.86421,-1.20238],[45.86422,-1.20358],[45.86444,-1.20601],[45.86493,-1.2072],[45.86588,-1.20816],[45.86696,-1.20847],
[45.86779,-1.20963],[45.86801,-1.21111],[45.86867,-1.21245],[45.86945,-1.21378],[45.87051,-1.21593],[45.87104,-1.21748],[45.87034,-1.21886],[45.86897,-1.21987],[45.86747,-1.2204],[45.86597,-1.2213],
[45.86552,-1.22417],[45.86442,-1.22669],[45.86345,-1.2284],[45.86306,-1.23066],[45.86204,-1.23056],[45.86112,-1.23],[45.85992,-1.22968],[45.859,-1.2295],[45.85813,-1.22932],[45.85704,-1.22854],
[45.85584,-1.22759],[45.85504,-1.22818],[45.85399,-1.2287],[45.8535,-1.22765],[45.85301,-1.22628],[45.85303,-1.22489],[45.85222,-1.22437],[45.85133,-1.2241],[45.85048,-1.22327],[45.84985,-1.22217],
[45.84932,-1.22082],[45.8487,-1.22063],[45.84805,-1.22118],[45.8472,-1.22078],[45.8467,-1.21994],[45.84626,-1.21871],[45.84606,-1.2172],[45.84498,-1.21694],[45.84455,-1.21511],[45.84457,-1.21382],
[45.84483,-1.21245],[45.84506,-1.21107],[45.84452,-1.2109],[45.84361,-1.21205],[45.84242,-1.21246],[45.84158,-1.21291],[45.84062,-1.21262],[45.83962,-1.21227],[45.83832,-1.209],[45.83775,-1.20798],
[45.83761,-1.20656],[45.83666,-1.20622],[45.83525,-1.20596],[45.83398,-1.2056],[45.83294,-1.20554],[45.83192,-1.20537],[45.83185,-1.20685],[45.83147,-1.20817],[45.83023,-1.2094],[45.82945,-1.21017],
[45.82849,-1.21179],[45.82764,-1.21196],[45.82671,-1.21124],[45.82648,-1.21253],[45.82605,-1.2137],[45.82526,-1.21274],[45.8245,-1.21234],[45.82286,-1.21239],[45.82151,-1.21264],[45.82051,-1.21241],
[45.81993,-1.21103],[45.81841,-1.21214],[45.81763,-1.21312],[45.81678,-1.21415],[45.81584,-1.21506],[45.81504,-1.21583],[45.81435,-1.21678],[45.81585,-1.21928],[45.81525,-1.21979],[45.81437,-1.22001],
[45.81383,-1.22109],[45.81298,-1.2214],[45.81211,-1.22284],[45.81109,-1.22423],[45.80992,-1.22543],[45.80875,-1.22618],[45.80819,-1.22761],[45.80757,-1.23597],[45.80747,-1.23738],[45.80861,-1.23695],
[45.80953,-1.23674],[45.81011,-1.23757],[45.81103,-1.23777],[45.81216,-1.23787],[45.81317,-1.23825],[45.81445,-1.23843],[45.81551,-1.23838],[45.81657,-1.23864],[45.81759,-1.23834],[45.81839,-1.23767],
[45.8198,-1.23752],[45.82038,-1.23825],[45.81975,-1.2392],[45.81962,-1.24061],[45.81927,-1.242],[45.82227,-1.24203],[45.82638,-1.24188],[45.82777,-1.24192],[45.83073,-1.24235],[45.83077,-1.24421],
[45.83121,-1.246],[45.83228,-1.24686],[45.84008,-1.24805],[45.8412,-1.24519],[45.84175,-1.24369],[45.84295,-1.24271],[45.84529,-1.24306],[45.84756,-1.24334],[45.85072,-1.24487],[45.85172,-1.24438],
[45.85265,-1.24373],[45.85362,-1.24336],[45.85466,-1.24349],[45.85581,-1.24411],[45.85679,-1.24386],[45.85762,-1.24287],[45.8589,-1.24156],[45.85982,-1.2404],[45.86081,-1.23937],[45.86061,-1.23827],
[45.86088,-1.23934],[45.86045,-1.24123],[45.86034,-1.24257],[45.86009,-1.2443],[45.85972,-1.24552],[45.8605,-1.24773],[45.86079,-1.24932],[45.86111,-1.25096],[45.86171,-1.25196],[45.86275,-1.25248],
[45.86358,-1.25299],[45.86464,-1.25351],[45.86542,-1.25427],[45.86628,-1.25459],[45.86711,-1.25513],[45.86826,-1.25577],[45.86918,-1.25616],[45.8705,-1.25668],[45.87131,-1.25705],[45.87235,-1.25773],
[45.87333,-1.25849],[45.87447,-1.25935],[45.87542,-1.26006],[45.87623,-1.26023],[45.87706,-1.26025],[45.87765,-1.26106],[45.87831,-1.26225],[45.87893,-1.263],[45.87971,-1.26366],[45.8805,-1.26427],
[45.88123,-1.26476],[45.88164,-1.26581],[45.88203,-1.26683],[45.88234,-1.26791],[45.88278,-1.26886],[45.88302,-1.27015],[45.88342,-1.27117],[45.88384,-1.27213],[45.8841,-1.27324],[45.88479,-1.2742],
[45.88548,-1.27561],[45.88669,-1.27606],[45.88642,-1.27731],[45.88747,-1.27982],[45.88806,-1.28072],[45.88922,-1.28159],[45.88998,-1.28232],[45.89093,-1.28302],[45.89194,-1.28393],[45.89288,-1.28499],
[45.8939,-1.28632],[45.89504,-1.2879],[45.89594,-1.28918],[45.89685,-1.2901],[45.89777,-1.29072],[45.89861,-1.29128],[45.89962,-1.29235],[45.90043,-1.29414],[45.90081,-1.29587],[45.90072,-1.29748],
[45.90076,-1.29886],[45.90051,-1.29997],[45.90047,-1.30183],[45.90104,-1.30302],[45.90132,-1.30449],[45.90216,-1.30563],[45.90273,-1.30689],[45.90406,-1.30858],[45.90478,-1.30854],[45.90539,-1.3095],
[45.9071,-1.31132],[45.90756,-1.31328],[45.9079,-1.31445],[45.90883,-1.31528],[45.91028,-1.31669],[45.91105,-1.3182],[45.91142,-1.3197],[45.91197,-1.32092],[45.91276,-1.32236],[45.91254,-1.3233],
[45.91162,-1.32397],[45.91068,-1.32496],[45.91036,-1.32603],[45.91141,-1.32591],[45.91251,-1.32462],[45.91322,-1.32382],[45.91403,-1.32417],[45.91469,-1.32595],[45.91554,-1.32833],[45.91547,-1.3299],
[45.91504,-1.33111],[45.91493,-1.33203],[45.91594,-1.33351],[45.91661,-1.33449],[45.91743,-1.33578],[45.91789,-1.33714],[45.91846,-1.33847],[45.91893,-1.33988],[45.91917,-1.34125],[45.91993,-1.34262],
[45.92096,-1.34335],[45.92216,-1.34459],[45.92278,-1.34356],[45.92379,-1.34254],[45.9249,-1.34259],[45.92561,-1.34177],[45.92654,-1.34061],[45.92771,-1.33953],[45.92884,-1.3398],[45.92996,-1.34008],
[45.93082,-1.34168],[45.93176,-1.34261],[45.93244,-1.34404],[45.93276,-1.34525],[45.93316,-1.34701],[45.93458,-1.34912],[45.93564,-1.3506],[45.93625,-1.35171],[45.93696,-1.3527],[45.93784,-1.35366],
[45.93834,-1.35492],[45.939,-1.35604],[45.93971,-1.35698],[45.93905,-1.35831],[45.93977,-1.35941],[45.94065,-1.36037],[45.94233,-1.36173],[45.94267,-1.36262],[45.94364,-1.36405],[45.94274,-1.36545],
[45.9419,-1.36702],[45.94177,-1.3684],[45.94136,-1.36955],[45.94168,-1.37072],[45.94225,-1.37228],[45.94348,-1.37388],[45.94431,-1.37484],[45.94523,-1.37542],[45.94729,-1.37718],[45.94897,-1.37836],
[45.95,-1.37928],[45.95081,-1.38048],[45.95123,-1.38177],[45.9518,-1.38317],[45.95192,-1.38476],[45.95327,-1.38634],[45.95433,-1.38718],[45.95569,-1.38774],[45.95692,-1.38814],[45.95808,-1.38824],
[45.95889,-1.38753],[45.95938,-1.38568],[45.95956,-1.38497],[45.96027,-1.38559],[45.96114,-1.38481],[45.96184,-1.38502],[45.96238,-1.38551],[45.96326,-1.38565],[45.96411,-1.38601],[45.96428,-1.38468],
[45.96351,-1.38378],[45.96355,-1.38237],[45.96361,-1.38108],[45.96442,-1.38105],[45.96528,-1.38024],[45.96601,-1.37956],[45.96672,-1.3786],[45.96754,-1.37825],[45.96852,-1.37799],[45.96939,-1.37874],
[45.97031,-1.37834],[45.97125,-1.37668],[45.97212,-1.37861],[45.97068,-1.37985],[45.97121,-1.38103],[45.97197,-1.38118],[45.97265,-1.38186],[45.973,-1.38275],[45.97292,-1.3843],[45.97264,-1.38549],
[45.97237,-1.38687],[45.9732,-1.3898],[45.9744,-1.39092],[45.97499,-1.39203],[45.9757,-1.39276],[45.97631,-1.39357],[45.97692,-1.39507],[45.97779,-1.39561],[45.97871,-1.39519],[45.97973,-1.39454],
[45.98136,-1.39376],[45.98233,-1.39293],[45.98317,-1.39191],[45.98311,-1.39033],[45.98398,-1.3902],[45.98461,-1.38921],[45.98485,-1.38745],[45.98537,-1.38906],[45.98602,-1.38909],[45.9869,-1.38878],
[45.9878,-1.38813],[45.98864,-1.38768],[45.98945,-1.38704],[45.99072,-1.38678],[45.99168,-1.38635],[45.99254,-1.38594],[45.99354,-1.38523],[45.99441,-1.38484],[45.99557,-1.38402],[45.99638,-1.38314],
[45.9972,-1.38216],[45.99777,-1.38191],[45.99837,-1.38252],[45.99959,-1.38305],[46.00081,-1.38361],[46.00158,-1.3815],[46.00189,-1.37971],[46.00276,-1.38015],[46.00367,-1.38053],[46.00478,-1.3801],
[46.00593,-1.3812],[46.00655,-1.38197],[46.00727,-1.38217],[46.00911,-1.38168],[46.01039,-1.38143],[46.01132,-1.38121],[46.01376,-1.38153],[46.01446,-1.38189],[46.01472,-1.3831],[46.01466,-1.38462],
[46.01474,-1.38592],[46.01514,-1.3871],[46.01634,-1.38716],[46.01809,-1.38645],[46.01932,-1.38586],[46.01993,-1.38853],[46.02034,-1.39005],[46.02075,-1.39111],[46.02168,-1.39273],[46.02121,-1.39386],
[46.02182,-1.39492],[46.02196,-1.3964],[46.02276,-1.39748],[46.02365,-1.39807],[46.02432,-1.39899],[46.02387,-1.40005],[46.02478,-1.4015],[46.02562,-1.4014],[46.02596,-1.40261],[46.0279,-1.40402],
[46.02889,-1.40471],[46.0298,-1.40451],[46.03061,-1.40494],[46.03139,-1.40584],[46.03316,-1.40661],[46.0348,-1.40716],[46.03635,-1.40771],[46.03747,-1.40807],[46.03843,-1.40841],[46.04,-1.40897],
[46.04168,-1.40961],[46.04253,-1.40923],[46.04393,-1.40783],[46.04481,-1.41046],[46.0455,-1.41069],[46.04602,-1.41178],[46.04666,-1.41277],[46.0474,-1.4118],[46.04777,-1.41071],[46.04762,-1.40944],
[46.04755,-1.40818],[46.04772,-1.4069],[46.04708,-1.40602],[46.04601,-1.406],[46.04564,-1.404],[46.04526,-1.4026],[46.0448,-1.40136],[46.04426,-1.39983],[46.04455,-1.39861],[46.0445,-1.39718],
[46.04417,-1.39556],[46.04337,-1.39415],[46.0428,-1.39317],[46.04237,-1.39197],[46.04193,-1.39079],[46.04184,-1.38961],[46.04157,-1.3884],[46.04146,-1.38675],[46.041,-1.38547],[46.0397,-1.38384],
[46.03882,-1.38311],[46.03785,-1.38196],[46.03853,-1.38087],[46.03946,-1.38057],[46.04028,-1.38093],[46.04073,-1.38017],[46.04055,-1.3785],[46.04012,-1.37681],[46.03982,-1.37544],[46.03954,-1.37399],
[46.03935,-1.37254],[46.03844,-1.3731],[46.03783,-1.37323],[46.03757,-1.37192],[46.0364,-1.37222],[46.03586,-1.37129],[46.0351,-1.37111],[46.03434,-1.37197],[46.03324,-1.3722],[46.03226,-1.37207],
[46.03142,-1.37163],[46.03064,-1.37072],[46.02987,-1.36997],[46.02913,-1.36924],[46.02841,-1.3681],[46.02782,-1.36708],[46.02702,-1.36517],[46.02656,-1.36395],[46.02588,-1.36312],[46.02544,-1.36175],
[46.02496,-1.3603],[46.02471,-1.35899],[46.02434,-1.35763],[46.0234,-1.35683],[46.02263,-1.35579],[46.02156,-1.35492],[46.02045,-1.35443],[46.01968,-1.35327],[46.01893,-1.35213],[46.01839,-1.35116],
[46.0176,-1.34981],[46.01703,-1.34849],[46.01617,-1.34621],[46.01514,-1.34612],[46.01457,-1.3449],[46.01441,-1.34355],[46.01419,-1.34243],[46.01368,-1.33995],[46.01348,-1.33857],[46.01313,-1.33697],
[46.01228,-1.33742],[46.01143,-1.33706],[46.01072,-1.33686],[46.00982,-1.33763],[46.00902,-1.33865],[46.00744,-1.33984],[46.0064,-1.34074],[46.0058,-1.33987],[46.00525,-1.33833],[46.00513,-1.33722],
[46.00564,-1.33626],[46.00521,-1.33455],[46.00499,-1.33304],[46.00515,-1.33165],[46.00534,-1.33002],[46.00468,-1.32911],[46.00384,-1.32803],[46.00282,-1.32664],[46.00245,-1.32545],[46.00183,-1.32425],
[46.00107,-1.32343],[46.00034,-1.32273],[45.9996,-1.3219],[45.99864,-1.32171],[45.99785,-1.32191],[45.99696,-1.32103],[45.9962,-1.31983],[45.99562,-1.31866],[45.995,-1.31749],[45.99419,-1.31693],
[45.99339,-1.31621],[45.99295,-1.3148],[45.99237,-1.31353],[45.99202,-1.31243],[45.99092,-1.31165],[45.99073,-1.31042],[45.99081,-1.30923],[45.99073,-1.30759],[45.98965,-1.30738],[45.98909,-1.30591],
[45.98863,-1.30407],[45.98779,-1.30565],[45.98673,-1.30774],[45.986,-1.30713],[45.98593,-1.30539],[45.98604,-1.3035],[45.98626,-1.30044],[45.98571,-1.29426],[45.98682,-1.29404],[45.98761,-1.29348],
[45.9878,-1.29221],[45.9878,-1.29085],[45.98764,-1.28948],[45.98711,-1.28835],[45.98669,-1.28726],[45.98684,-1.28592],[45.98673,-1.28446],[45.98671,-1.28327],[45.98622,-1.28206],[45.98593,-1.28074],
[45.98633,-1.27963],[45.98692,-1.27849],[45.98679,-1.27766],[45.98701,-1.27648],[45.98432,-1.27629],[45.98322,-1.27652],[45.98227,-1.27675],[45.98071,-1.2771],[45.9798,-1.27731],[45.97852,-1.27757],
[45.97875,-1.27634],[45.97877,-1.27497],[45.97924,-1.27357],[45.98006,-1.27257],[45.98053,-1.27154],[45.98128,-1.2706],[45.98196,-1.26991],[45.98241,-1.26871],[45.98287,-1.26743],[45.98384,-1.26678],
[45.98481,-1.26603],[45.98571,-1.26606],[45.98657,-1.26578],[45.98756,-1.2649],[45.98753,-1.26343],[45.98743,-1.26154],[45.98758,-1.26019],[45.98775,-1.25839],[45.98792,-1.25668],[45.98868,-1.25537],
[45.98931,-1.2548],[45.9895,-1.25342],[45.98975,-1.25206],[45.98968,-1.25054],[45.98947,-1.24903],[45.98971,-1.24779],[45.9896,-1.2463],[45.98874,-1.24479],[45.98812,-1.24387],[45.98748,-1.24277],
[45.98687,-1.24181],[45.98498,-1.23979],[45.98424,-1.23904],[45.98336,-1.23814],[45.98227,-1.23879],[45.98133,-1.23881],[45.9804,-1.23868],[45.97974,-1.2375],[45.97874,-1.23787],[45.97761,-1.23831],
[45.9764,-1.23861],[45.97553,-1.23822],[45.97436,-1.23752],[45.97337,-1.23732],[45.97259,-1.23829],[45.97189,-1.238],[45.97116,-1.23899],[45.96974,-1.23873],[45.96876,-1.23833],[45.96791,-1.23885],
[45.96817,-1.2404],[45.96759,-1.24141],[45.9666,-1.24166],[45.96574,-1.24248],[45.96502,-1.2437],[45.96401,-1.24411],[45.9632,-1.24338],[45.96161,-1.24347],[45.96067,-1.24351],[45.95941,-1.24348],
[45.95838,-1.24344],[45.95742,-1.24338],[45.95653,-1.24327],[45.95491,-1.24286],[45.95391,-1.24248],[45.95255,-1.24301],[45.95151,-1.24223],[45.95063,-1.24167],[45.95066,-1.24019],[45.95025,-1.2393],
[45.94919,-1.2389],[45.94818,-1.23873],[45.94706,-1.2388],[45.94621,-1.23819],[45.94559,-1.23679],[45.94528,-1.23548],[45.94479,-1.23418],[45.94441,-1.23291],[45.94333,-1.23196],[45.94194,-1.23112],
[45.94165,-1.23859],[45.94059,-1.23831],[45.93752,-1.238],[45.93629,-1.23795],[45.93596,-1.23998],[45.93625,-1.24155],[45.93539,-1.24198],[45.93418,-1.24197],[45.93315,-1.24157],[45.93239,-1.24047],
[45.93165,-1.23866],[45.93105,-1.23758],[45.92997,-1.23756],[45.92876,-1.23708],[45.92752,-1.23648],[45.92695,-1.23779],[45.92589,-1.24056],[45.92569,-1.24187],[45.92508,-1.24306],[45.92389,-1.24147],
[45.92335,-1.24307],[45.92223,-1.24486],[45.92108,-1.24259],[45.92002,-1.24196],[45.91933,-1.24271],[45.91895,-1.24373],[45.91816,-1.24266],[45.91775,-1.24144],[45.91763,-1.23991],[45.91708,-1.23861],
[45.91637,-1.23586],[45.91546,-1.23671],[45.91429,-1.2378],[45.9137,-1.23664],[45.91328,-1.23544],[45.91279,-1.23344],[45.91198,-1.23326],[45.91073,-1.23377],[45.91066,-1.23224],[45.91052,-1.23061],
[45.91014,-1.22945],[45.91021,-1.22763],[45.91036,-1.22636],[45.90979,-1.22531],[45.90884,-1.2235],[45.90807,-1.22303],[45.9085,-1.22148],[45.90832,-1.22033],[45.90729,-1.21928],[45.90622,-1.21839],
[45.90544,-1.2172],[45.90618,-1.21588],[45.90686,-1.21465],[45.90602,-1.21429],[45.90534,-1.2129],[45.90495,-1.21153],[45.90397,-1.21109],[45.90266,-1.20912],[45.90197,-1.20989],[45.90127,-1.2089],
[45.90082,-1.2076],[45.90037,-1.20644],[45.89986,-1.20503],[45.89889,-1.20332],[45.89944,-1.20202],[45.89818,-1.2023],[45.89713,-1.20205],[45.89593,-1.20164],[45.89461,-1.20026],[45.89287,-1.19831],
[45.89179,-1.19707],[45.89104,-1.19633],[45.89053,-1.19493],[45.88936,-1.19322],[45.88885,-1.19171],[45.88758,-1.19023],[45.88679,-1.19017],[45.88604,-1.19023],[45.88513,-1.18933],[45.88513,-1.18933]
];

// Compute cumulative distance along track
const trackCum = [0];
for (let i = 1; i < TRACK.length; i++) {
  const R = 6371000, toRad = x => x * Math.PI / 180;
  const dLat = toRad(TRACK[i][0]-TRACK[i-1][0]), dLon = toRad(TRACK[i][1]-TRACK[i-1][1]);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(TRACK[i-1][0]))*Math.cos(toRad(TRACK[i][0]))*Math.sin(dLon/2)**2;
  trackCum.push(trackCum[i-1] + R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}
const trackTotal = trackCum[trackCum.length-1];

// Interpolate position at given distance (meters)
function posAtDist(distM) {
  if (distM <= 0) return TRACK[0];
  if (distM >= trackTotal) return TRACK[TRACK.length-1];
  for (let i = 0; i < trackCum.length-1; i++) {
    if (trackCum[i+1] >= distM) {
      const t = (distM - trackCum[i]) / (trackCum[i+1] - trackCum[i]);
      return [
        TRACK[i][0] + t*(TRACK[i+1][0]-TRACK[i][0]),
        TRACK[i][1] + t*(TRACK[i+1][1]-TRACK[i][1])
      ];
    }
  }
  return TRACK[TRACK.length-1];
}

// Init map
const map = L.map('map').setView([45.93, -1.30], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap', maxZoom: 18
}).addTo(map);

// Draw track
L.polyline(TRACK, { color: '#e8764b', weight: 3, opacity: 0.7 }).addTo(map);
map.fitBounds(L.polyline(TRACK).getBounds(), { padding: [20, 20] });

// Icons
function makeIcon(bg, content, size=28) {
  return L.divIcon({ className: '', html: `<div style="background:${bg};color:white;width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${size<26?11:14}px;font-weight:bold;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${content}</div>`, iconSize:[size,size], iconAnchor:[size/2,size/2] });
}

// Static markers — correct positions from GPX
L.marker([45.88425,-1.18953], {icon: makeIcon('#27ae60','🏁')}).addTo(map).bindPopup('<b>🏁 Départ & Arrivée</b><br>Citadelle du Château d\'Oléron<br>Départ 5h32');
L.marker([45.86076,-1.23926], {icon: makeIcon('#e74c3c','🔄')}).addTo(map).bindPopup('<b>🔄 Relais 1 — Grand-Village</b><br>km 25 · KLUMY → SISI');
L.marker([45.97165,-1.37734], {icon: makeIcon('#e74c3c','🔄')}).addTo(map).bindPopup('<b>🔄 Relais 2 — Domino</b><br>km 48 · SISI → MAT<br>⚠ Barrière 14h · 🏥 Staff médical');
L.marker([45.98746,-1.29371], {icon: makeIcon('#e74c3c','🔄')}).addTo(map).bindPopup('<b>🔄 Relais 3 — Gautrelle</b><br>km 75 · MAT → TOTO<br>⚠ Barrière 18h');

// Ravitos liquides — exact positions from GPX
L.marker([45.83778,-1.20794], {icon: makeIcon('#1a6b8a','💧',22)}).addTo(map).bindPopup('💧 Ravito liquide — km 12');
L.marker([45.91555,-1.32891], {icon: makeIcon('#1a6b8a','💧',22)}).addTo(map).bindPopup('💧 Ravito liquide — km 37');
L.marker([46.04599,-1.40590], {icon: makeIcon('#1a6b8a','💧',22)}).addTo(map).bindPopup('💧 Ravito liquide — km 62');
L.marker([45.96005,-1.24353], {icon: makeIcon('#1a6b8a','💧',22)}).addTo(map).bindPopup('💧 Ravito liquide — km 87');

// Live runner marker
const runnerColorHex = ['#2d9a4e','#2e7abf','#e8764b','#9b59b6'];
const runnerNameMap = ['KLUMY','SISI','MAT','TOTO'];
const runnerDistStart = [0, 25270, 48240, 76850]; // meters
const runnerDistEnd   = [25270, 48240, 76850, 101400];

let liveMarker = null;
let livePopup = null;

function updateLivePosition() {
  const now = new Date();
  const elapsed = (now - raceDate) / 60000; // minutes since start
  if (elapsed < 0 || elapsed > 24*60) {
    // Race not started or way past — remove marker
    if (liveMarker) { map.removeLayer(liveMarker); liveMarker = null; }
    return;
  }

  // Compute where each runner is based on their pace
  let cumTime = 0;
  let activeRunner = -1;
  let activeDistM = 0;

  for (let i = 0; i < 4; i++) {
    const paceSec = parseInt(document.getElementById(`pace-${i}`).value);
    const segDistKm = (runnerDistEnd[i] - runnerDistStart[i]) / 1000;
    const segTimeMin = segDistKm * paceSec / 60;

    if (elapsed < cumTime + segTimeMin) {
      // This runner is active
      activeRunner = i;
      const elapsedInSeg = elapsed - cumTime;
      const kmDone = elapsedInSeg / (paceSec / 60);
      activeDistM = runnerDistStart[i] + kmDone * 1000;
      break;
    }
    cumTime += segTimeMin;
  }

  if (activeRunner === -1) {
    // Race finished
    if (liveMarker) { map.removeLayer(liveMarker); liveMarker = null; }
    return;
  }

  const pos = posAtDist(activeDistM);
  const kmDone = (activeDistM / 1000).toFixed(1);
  const kmInSeg = ((activeDistM - runnerDistStart[activeRunner]) / 1000).toFixed(1);
  const segTotal = ((runnerDistEnd[activeRunner] - runnerDistStart[activeRunner]) / 1000).toFixed(1);
  const color = runnerColorHex[activeRunner];
  const name = runnerNameMap[activeRunner];

  const icon = L.divIcon({
    className: '',
    html: `<div style="background:${color};color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;border:4px solid white;box-shadow:0 0 12px ${color}88, 0 2px 8px rgba(0,0,0,0.3);animation:pulse 2s infinite">🏃</div>`,
    iconSize: [36,36], iconAnchor: [18,18]
  });

  if (liveMarker) {
    liveMarker.setLatLng(pos);
    liveMarker.setIcon(icon);
    liveMarker.setPopupContent(`<b>🏃 ${name}</b><br>km ${kmDone} (${kmInSeg}/${segTotal} km du relais)`);
  } else {
    liveMarker = L.marker(pos, { icon, zIndexOffset: 1000 }).addTo(map)
      .bindPopup(`<b>🏃 ${name}</b><br>km ${kmDone} (${kmInSeg}/${segTotal} km du relais)`);
  }
}

// Update live position every 10 seconds
updateLivePosition();
setInterval(updateLivePosition, 10000);
// Also update when paces change
document.querySelectorAll('[id^="pace-"]').forEach(el => el.addEventListener('change', updateLivePosition));


// ========== CHECKLIST ==========
const gear = [
  'Pièce d\'identité',
  'Téléphone portable (chargé et allumé)',
  'Réserve d\'eau 500 ml minimum',
  'Ecocup / gobelet réutilisable',
  'Couverture de survie (min. 2 m²)',
  'Sifflet d\'urgence',
  'Dossard nominatif (épinglettes)',
  'Dossard puce (ceinture orga)',
];

const clEl = document.getElementById('checklist');
const checkedState = JSON.parse(localStorage.getItem('jppjr-gear') || '{}');

gear.forEach((item, i) => {
  const li = document.createElement('li');
  li.innerHTML = `<span class="check-box">${checkedState[i] ? '✓' : ''}</span> ${item}`;
  if (checkedState[i]) li.classList.add('checked');
  li.addEventListener('click', () => {
    checkedState[i] = !checkedState[i];
    li.classList.toggle('checked');
    li.querySelector('.check-box').textContent = checkedState[i] ? '✓' : '';
    localStorage.setItem('jppjr-gear', JSON.stringify(checkedState));
  });
  clEl.appendChild(li);
});

// ========== PARKING ==========
const parkingData = [
  {
    title: 'Citadelle — Départ & Arrivée',
    km: 'km 0 / km 101',
    color: 'var(--klumy)',
    text: 'P1 : Parking citadelle (face au collège) · P2 : Place de la République · P3 : Boulevard Thiers · P4-P5 : Rue Aliénor d\'Aquitaine · P6 : Chemin de ronde. Stationnements vélos disponibles à la Citadelle.'
  },
  {
    title: 'Grand-Village — Relais 1',
    km: 'km 25',
    color: 'var(--sisi)',
    text: 'Boulevard de la plage · Parking U Express · Parking de l\'Épinette · Parking de la Giraudière. Ravitaillement à la Maison éco-paysanne.'
  },
  {
    title: 'Domino — Relais 2',
    km: 'km 48',
    color: 'var(--mat)',
    text: 'Deux parkings à l\'entrée du village + rues alentours. Bénévoles sur place pour vous aider. Accès en sens unique.'
  },
  {
    title: 'Gautrelle — Relais 3',
    km: 'km 75',
    color: 'var(--toto)',
    text: 'Accès difficile ! Circulation et stationnement en sens unique. Équipe de signaleurs renforcée. Les parkings de Foulerot (1,5 km du ravito) sont une alternative. Privilégiez la mobilité douce.'
  },
];

document.getElementById('parkingCards').innerHTML = parkingData.map(p => `
  <div class="pk-card" style="border-left-color:${p.color}">
    <span class="pk-km">${p.km}</span>
    <h3>${p.title}</h3>
    <p>${p.text}</p>
  </div>
`).join('');

// ========== LIVE PANEL TOGGLE (mobile) ==========
function toggleLivePanel() {
  const body = document.getElementById('livePanelBody');
  const btn = document.getElementById('liveToggle');
  const collapsed = body.classList.toggle('live-collapsed');
  btn.textContent = collapsed ? '▼' : '▲';
}
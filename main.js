import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ARButton } from "three/addons/webxr/ARButton.js";

// ─── Renderer ────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  20,
);
scene.add(new THREE.AmbientLight(0xffffff, 2.0));
const sun = new THREE.DirectionalLight(0xffffff, 2.0);
sun.position.set(2, 4, 2);
scene.add(sun);

const statusEl = document.getElementById("status");
if (statusEl) statusEl.style.display = "none";

// AR Button — we hide it visually and expose our own stop button
const arBtn = ARButton.createButton(renderer, {
  requiredFeatures: ["hit-test"],
  optionalFeatures: ["dom-overlay"],
  domOverlay: { root: document.body },
});
// Hide the default ARButton — we'll control session end ourselves
arBtn.style.cssText += "display:none!important;";
document.body.appendChild(arBtn);

// Font
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:wght@500;600&display=swap";
document.head.appendChild(fontLink);

// ─── CSS ─────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  :root {
    --sand: #EDE8DF;
    --ink: #18181A;
    --muted: #9A9590;
    --gold: #C9A96E;
    --gold-glow: rgba(201,169,110,0.35);
    --red: #D95F5F;
    --green: #5BAD8A;
    --glass-dark: rgba(18,18,20,0.82);
    --glass-mid: rgba(18,18,20,0.58);
    --glass-light: rgba(255,255,255,0.07);
    --blur: blur(24px);
    --f-body: 'DM Sans', sans-serif;
    --f-display: 'Cormorant Garamond', serif;
  }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }

  /* ── Start AR screen (shown before AR session) ── */
  #start-screen {
    position: fixed; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
    background: #0e0e10;
    z-index: 1000;
  }
  #start-screen h1 {
    font-family: var(--f-display); font-size: 32px; font-weight: 600;
    color: var(--sand); letter-spacing: 0.02em; margin: 0;
  }
  #start-screen p {
    font-family: var(--f-body); font-size: 13px;
    color: var(--muted); margin: 0;
  }
  #btn-start-ar {
    margin-top: 8px;
    padding: 14px 40px;
    background: var(--gold);
    color: var(--ink);
    font-family: var(--f-body); font-size: 14px; font-weight: 600;
    letter-spacing: 0.04em;
    border: none; border-radius: 50px; cursor: pointer;
    box-shadow: 0 8px 32px var(--gold-glow);
    transition: transform 0.15s;
  }
  #btn-start-ar:active { transform: scale(0.95); }

  /* ── Top bar ── */
  #ui-top {
    position: fixed; top: 0; left: 0; right: 0; height: 66px;
    display: none; align-items: center; justify-content: space-between;
    padding: 0 20px;
    background: var(--glass-dark);
    backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    z-index: 500;
  }
  #ui-top.on { display: flex; }
  #top-left { display: flex; flex-direction: column; gap: 1px; }
  #top-name {
    font-family: var(--f-display); font-size: 19px; font-weight: 600;
    color: var(--sand); letter-spacing: 0.01em;
  }
  #top-status {
    font-family: var(--f-body); font-size: 11px; font-weight: 400;
    color: var(--muted); letter-spacing: 0.05em; text-transform: uppercase;
  }
  #btn-stop {
    padding: 8px 18px;
    background: rgba(217,95,95,0.18);
    border: 1px solid rgba(217,95,95,0.35);
    border-radius: 50px; color: #E07070;
    font-family: var(--f-body); font-size: 12px; font-weight: 500;
    cursor: pointer; transition: background 0.15s;
    backdrop-filter: var(--blur);
  }
  #btn-stop:active { background: rgba(217,95,95,0.32); }

  /* ── Scan rings ── */
  .s-ring {
    position: fixed; top: 50%; left: 50%;
    border: 1.5px solid var(--gold); border-radius: 50%;
    pointer-events: none; z-index: 300; opacity: 0;
    transition: opacity 0.4s;
    transform: translate(-50%, -56%);
  }
  .s-ring.on { animation: sPulse 2s ease-in-out infinite; }
  #sr1 { width: 160px; height: 80px; }
  #sr2 { width: 220px; height: 110px; animation-delay: 0.35s; }
  #sr1.on { opacity: 0.65; }
  #sr2.on { opacity: 0.28; }
  @keyframes sPulse {
    0%,100% { transform: translate(-50%,-56%) scale(1); }
    50%      { transform: translate(-50%,-56%) scale(1.07); }
  }

  /* ── Hint pill ── */
  #hint-pill {
    position: fixed; top: 78px; left: 50%; transform: translateX(-50%);
    font-family: var(--f-body); font-size: 12px; font-weight: 500;
    color: rgba(255,255,255,0.9);
    background: var(--glass-mid); backdrop-filter: var(--blur);
    padding: 6px 16px; border-radius: 50px;
    border: 1px solid rgba(255,255,255,0.08);
    z-index: 500; pointer-events: none; white-space: nowrap;
    opacity: 0; transition: opacity 0.25s;
  }
  #hint-pill.on { opacity: 1; }

  /* ── Move banner ── */
  #move-banner {
    position: fixed;
    /* sits just above the bottom panel (panel is ~190px tall + safe area) */
    bottom: 210px;
    left: 50%; transform: translateX(-50%);
    font-family: var(--f-body); font-size: 11px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--ink); background: var(--gold);
    padding: 6px 20px; border-radius: 50px;
    z-index: 500; pointer-events: none;
    display: none; white-space: nowrap;
    box-shadow: 0 4px 20px var(--gold-glow);
  }

  /* ── Bottom panel ── */
  #ui-bottom {
    position: fixed; bottom: 0; left: 0; right: 0;
    display: none; flex-direction: column; gap: 14px;
    background: var(--glass-dark);
    backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
    border-top: 1px solid rgba(255,255,255,0.07);
    border-radius: 22px 22px 0 0;
    /* fixed height so nothing overlaps */
    padding: 12px 22px 44px;
    z-index: 500;
  }
  #ui-bottom.on { display: flex; }

  #drag-handle {
    width: 34px; height: 3px; background: rgba(255,255,255,0.15);
    border-radius: 2px; margin: 0 auto 2px;
  }

  .sec-label {
    font-family: var(--f-body); font-size: 10px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 8px;
  }

  #chip-rail {
    display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none;
    -webkit-overflow-scrolling: touch; padding: 2px 0;
  }
  #chip-rail::-webkit-scrollbar { display: none; }

  .p-chip {
    flex-shrink: 0; display: flex; align-items: center; gap: 10px;
    padding: 9px 14px 9px 9px;
    background: var(--glass-light);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 14px; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    min-width: 128px;
  }
  .p-chip.active { border-color: var(--gold); background: rgba(201,169,110,0.12); }
  .p-chip:active { opacity: 0.6; }
  .p-emoji {
    width: 38px; height: 38px; background: rgba(255,255,255,0.06);
    border-radius: 9px; display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .p-info { display: flex; flex-direction: column; gap: 1px; }
  .p-name { font-family: var(--f-body); font-size: 13px; font-weight: 500; color: var(--sand); }
  .p-cat  { font-family: var(--f-body); font-size: 11px; color: var(--muted); }

  /* ── Action row — 3 buttons, evenly spaced ── */
  #act-row {
    display: flex; align-items: center; justify-content: center; gap: 20px;
  }
  .a-btn {
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.12s, opacity 0.12s;
  }
  .a-btn:active { transform: scale(0.82); opacity: 0.7; }

  #a-undo {
    width: 52px; height: 52px; border-radius: 50%;
    background: var(--glass-light);
    border: 1px solid rgba(255,255,255,0.1);
  }
  #a-place {
    width: 70px; height: 70px; border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 0 8px rgba(201,169,110,0.15), 0 8px 28px var(--gold-glow);
  }
  #a-place.s-move {
    background: #E8B84B;
    box-shadow: 0 0 0 8px rgba(232,184,75,0.15), 0 8px 28px rgba(232,184,75,0.4);
  }
  #a-place.s-ok {
    background: var(--green);
    box-shadow: 0 0 0 8px rgba(91,173,138,0.18), 0 8px 28px rgba(91,173,138,0.38);
    animation: pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes pop { from { transform: scale(0.82); } to { transform: scale(1); } }

  #a-del {
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(217,95,95,0.13);
    border: 1px solid rgba(217,95,95,0.25);
  }

  @keyframes slideUp {
    from { transform: translateY(100%); } to { transform: translateY(0); }
  }
  #ui-bottom.on { animation: slideUp 0.38s cubic-bezier(0.16,1,0.3,1); }
`;
document.head.appendChild(style);

// ─── DOM ─────────────────────────────────────────────────────
// Start screen (shown before AR)
const startScreen = document.createElement("div");
startScreen.id = "start-screen";
startScreen.innerHTML = `
  <h1>CasaDeco AR</h1>
  <p>Visualise furniture in your space</p>
  <button id="btn-start-ar">Start AR Experience</button>`;
document.body.appendChild(startScreen);

// Top bar
const uiTop = document.createElement("div");
uiTop.id = "ui-top";
uiTop.innerHTML = `
  <div id="top-left">
    <div id="top-name">CasaDeco</div>
    <div id="top-status">Scanning…</div>
  </div>
  <button id="btn-stop">Stop AR</button>`;
document.body.appendChild(uiTop);

// Scan rings
["sr1", "sr2"].forEach((id) => {
  const el = document.createElement("div");
  el.id = id;
  el.className = "s-ring";
  document.body.appendChild(el);
});

// Hint pill
const hintPill = document.createElement("div");
hintPill.id = "hint-pill";
document.body.appendChild(hintPill);

// Move banner
const moveBanner = document.createElement("div");
moveBanner.id = "move-banner";
moveBanner.textContent = "Move phone · tap ✓ to lock position";
document.body.appendChild(moveBanner);

// Bottom panel
const uiBottom = document.createElement("div");
uiBottom.id = "ui-bottom";
uiBottom.innerHTML = `
  <div id="drag-handle"></div>
  <div>
    <div class="sec-label">Products</div>
    <div id="chip-rail"></div>
  </div>
  <div id="act-row">
    <button class="a-btn" id="a-undo">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
      </svg>
    </button>
    <button class="a-btn" id="a-place">
      <svg id="ico-aim" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round">
        <circle cx="12" cy="12" r="2.2"/>
        <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
      </svg>
      <svg id="ico-check" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" style="display:none">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <svg id="ico-move" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
        <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/>
        <line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>
      </svg>
    </button>
    <button class="a-btn" id="a-del">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D95F5F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
      </svg>
    </button>
  </div>`;
document.body.appendChild(uiBottom);

// ─── Refs ─────────────────────────────────────────────────────
const topStatus = document.getElementById("top-status");
const btnStop = document.getElementById("btn-stop");
const chipRail = document.getElementById("chip-rail");
const aPlace = document.getElementById("a-place");
const aUndo = document.getElementById("a-undo");
const aDel = document.getElementById("a-del");
const icoAim = document.getElementById("ico-aim");
const icoCheck = document.getElementById("ico-check");
const icoMove = document.getElementById("ico-move");
const sr1 = document.getElementById("sr1");
const sr2 = document.getElementById("sr2");

// ─── Reticle ─────────────────────────────────────────────────
const reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.1, 0.14, 32).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({
    color: 0xc9a96e,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  }),
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

// ─── Products ─────────────────────────────────────────────────
const urlParams = new URLSearchParams(window.location.search);
const modelParam = urlParams.get("model") || "/models/chaise.glb";
const products = [
  { id: "p1", name: "Chair", cat: "Seating", emoji: "🪑", url: modelParam },
];
let activeProductId = "p1";

// ─── State ───────────────────────────────────────────────────
let hitTestSource = null,
  hitTestSourceRequested = false;
const floorPos = new THREE.Vector3();
let floorFound = false;
let appMode = "idle";
let previewObj = null,
  selectedObj = null;
const placedList = [];
let gltfScene = null,
  modelScale = 1,
  modelLift = 0;

// ─── Helpers ─────────────────────────────────────────────────
function setPlaceIcon(s) {
  icoAim.style.display = s === "aim" ? "" : "none";
  icoCheck.style.display = s === "check" ? "" : "none";
  icoMove.style.display = s === "move" ? "" : "none";
  aPlace.classList.remove("s-move", "s-ok");
  if (s === "move") aPlace.classList.add("s-move");
  if (s === "check") aPlace.classList.add("s-ok");
}
function setHint(txt) {
  hintPill.textContent = txt || "";
  hintPill.classList.toggle("on", !!txt);
}
function setScan(on) {
  sr1.classList.toggle("on", on);
  sr2.classList.toggle("on", on);
}

// ─── Chip rail ────────────────────────────────────────────────
function buildRail() {
  chipRail.innerHTML = "";
  products.forEach((p) => {
    const c = document.createElement("div");
    c.className = "p-chip" + (p.id === activeProductId ? " active" : "");
    c.innerHTML = `<div class="p-emoji">${p.emoji}</div><div class="p-info"><div class="p-name">${p.name}</div><div class="p-cat">${p.cat}</div></div>`;
    c.addEventListener("click", () => {
      activeProductId = p.id;
      document
        .querySelectorAll(".p-chip")
        .forEach((x) => x.classList.remove("active"));
      c.classList.add("active");
      loadModel(p.url);
    });
    chipRail.appendChild(c);
  });
}

// ─── Load model ───────────────────────────────────────────────
function loadModel(url) {
  if (previewObj) {
    scene.remove(previewObj);
    previewObj = null;
  }
  gltfScene = null;
  appMode = "idle";
  topStatus.textContent = "Loading…";
  setHint(null);

  new GLTFLoader().load(
    url,
    (gltf) => {
      const probe = gltf.scene.clone(true);
      scene.add(probe);
      probe.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(probe);
      scene.remove(probe);
      const size = new THREE.Vector3();
      box.getSize(size);
      modelScale = 0.9 / size.y;
      modelLift = -box.min.y * modelScale;
      gltfScene = gltf.scene;
      startPreview();
    },
    undefined,
    (err) => console.error(err),
  );
}

function startPreview() {
  if (previewObj) scene.remove(previewObj);
  const g = new THREE.Group();
  g.add(gltfScene.clone(true));
  g.scale.setScalar(modelScale);
  g.visible = false;
  scene.add(g);
  previewObj = g;
  appMode = "previewing";
  setPlaceIcon("aim");
  setScan(true);
  topStatus.textContent = "Scanning surface…";
  setHint(null);
  moveBanner.style.display = "none";
}

function doConfirm() {
  if (appMode === "previewing" && previewObj && floorFound) {
    placedList.push(previewObj);
    previewObj = null;
    appMode = "idle";
    moveBanner.style.display = "none";
    setPlaceIcon("check");
    topStatus.textContent = "Placed!";
    setHint("Tap ↺ to undo · tap ✦ to move");
    // After short pause show confirmed state then go back to IDLE — no auto preview
    setTimeout(() => {
      setPlaceIcon("aim");
      setHint(null);
      topStatus.textContent = "Tap a product to place another";
      setScan(false);
    }, 1500);
  } else if (appMode === "selected" && selectedObj && floorFound) {
    selectedObj = null;
    appMode = "idle";
    moveBanner.style.display = "none";
    setPlaceIcon("check");
    topStatus.textContent = "Position locked";
    setTimeout(() => {
      setPlaceIcon("aim");
      topStatus.textContent = "Ready";
    }, 1200);
  }
}

// ─── Start button (launches AR session) ──────────────────────
document.getElementById("btn-start-ar").addEventListener("click", () => {
  // Trigger the hidden ARButton
  arBtn.click();
});

// ─── XR session events ────────────────────────────────────────
renderer.xr.addEventListener("sessionstart", () => {
  startScreen.style.display = "none";
  uiTop.classList.add("on");
  uiBottom.classList.add("on");
  buildRail();
  loadModel(products.find((p) => p.id === activeProductId).url);

  const session = renderer.xr.getSession();

  session.addEventListener("select", () => {
    if (appMode === "previewing") doConfirm();
    else if (appMode === "idle" && placedList.length > 0) {
      selectedObj = placedList[placedList.length - 1];
      appMode = "selected";
      moveBanner.style.display = "block";
      setPlaceIcon("move");
      topStatus.textContent = "Moving item";
    } else if (appMode === "selected") doConfirm();
  });

  aPlace.addEventListener("click", () => {
    if (appMode === "previewing" || appMode === "selected") doConfirm();
    else if (appMode === "idle" && placedList.length > 0) {
      selectedObj = placedList[placedList.length - 1];
      appMode = "selected";
      moveBanner.style.display = "block";
      setPlaceIcon("move");
      topStatus.textContent = "Moving item";
    }
  });

  aUndo.addEventListener("click", () => {
    if (appMode === "selected" && selectedObj) {
      const i = placedList.indexOf(selectedObj);
      if (i !== -1) placedList.splice(i, 1);
      scene.remove(selectedObj);
      selectedObj = null;
      appMode = "idle";
      moveBanner.style.display = "none";
      setPlaceIcon("aim");
      setHint(null);
      topStatus.textContent = "Removed";
      setTimeout(() => (topStatus.textContent = "Ready"), 1200);
    } else if (placedList.length > 0) {
      scene.remove(placedList.pop());
      topStatus.textContent = "Removed";
      setTimeout(() => (topStatus.textContent = "Ready"), 1200);
    }
    if (previewObj) {
      scene.remove(previewObj);
      previewObj = null;
      appMode = "idle";
      setScan(false);
    }
  });

  aDel.addEventListener("click", () => {
    placedList.forEach((o) => scene.remove(o));
    placedList.length = 0;
    if (previewObj) {
      scene.remove(previewObj);
      previewObj = null;
    }
    selectedObj = null;
    appMode = "idle";
    moveBanner.style.display = "none";
    setPlaceIcon("aim");
    setHint(null);
    setScan(false);
    topStatus.textContent = "Cleared";
    setTimeout(() => (topStatus.textContent = "Tap a product to place"), 1200);
  });

  btnStop.addEventListener("click", () => session.end());

  session.addEventListener("end", () => {
    uiTop.classList.remove("on");
    uiBottom.classList.remove("on");
    setScan(false);
    moveBanner.style.display = "none";
    setHint(null);
    startScreen.style.display = "flex";
    hitTestSource = null;
    hitTestSourceRequested = false;
    floorFound = false;
  });
});

// Flutter bridge
window.setModel = (url) => {
  products[0].url = url;
  loadModel(url);
};
window.removeLastObject = () => aUndo.click();
window.clearAll = () => aDel.click();

// ─── Render loop ─────────────────────────────────────────────
renderer.setAnimationLoop((_, frame) => {
  if (frame) {
    const refSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (!hitTestSourceRequested) {
      session.requestReferenceSpace("viewer").then((vs) => {
        session.requestHitTestSource({ space: vs }).then((src) => {
          hitTestSource = src;
        });
      });
      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      const hits = frame.getHitTestResults(hitTestSource);
      if (hits.length > 0) {
        const m = hits[0].getPose(refSpace).transform.matrix;
        reticle.visible = true;
        reticle.matrix.fromArray(m);
        floorPos.set(m[12], m[13], m[14]);
        floorFound = true;

        const camPos = new THREE.Vector3();
        renderer.xr.getCamera().getWorldPosition(camPos);

        if (appMode === "previewing" && previewObj) {
          previewObj.visible = true;
          previewObj.position.set(
            floorPos.x,
            floorPos.y + modelLift,
            floorPos.z,
          );
          previewObj.lookAt(camPos.x, previewObj.position.y, camPos.z);
          setScan(false);
          topStatus.textContent = "Tap ✓ to place";
        }
        if (appMode === "selected" && selectedObj) {
          selectedObj.position.set(
            floorPos.x,
            floorPos.y + modelLift,
            floorPos.z,
          );
          selectedObj.lookAt(camPos.x, selectedObj.position.y, camPos.z);
        }
      } else {
        reticle.visible = false;
        floorFound = false;
        if (appMode === "previewing") {
          setScan(true);
          topStatus.textContent = "Scanning surface…";
        }
      }
    }
  }
  renderer.render(scene, camera);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

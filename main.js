// ─── Globals from CDN scripts (no imports needed) ────────────
const { MindARThree } = window.MINDAR.WORLD;
const THREE = window.THREE;
const GLTFLoader = window.THREE.GLTFLoader || window.GLTFLoader;

// ─── MindAR init ─────────────────────────────────────────────
const mindarThree = new MindARThree({ container: document.body });
const { renderer, scene, camera } = mindarThree;

scene.add(new THREE.AmbientLight(0xffffff, 2.0));
const sun = new THREE.DirectionalLight(0xffffff, 2.0);
sun.position.set(2, 4, 2);
scene.add(sun);

// ─── Floor plane (replaces WebXR hit-test) ───────────────────
const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const tapRaycaster = new THREE.Raycaster();
const floorPos = new THREE.Vector3();
let floorFound = false;
let arStarted = false;

function screenToFloor(clientX, clientY) {
  const x = (clientX / window.innerWidth) * 2 - 1;
  const y = -(clientY / window.innerHeight) * 2 + 1;
  tapRaycaster.setFromCamera({ x, y }, camera);
  const target = new THREE.Vector3();
  const hit = tapRaycaster.ray.intersectPlane(floorPlane, target);
  return hit ? target : null;
}

function raycastPlacedObjects(clientX, clientY) {
  const x = (clientX / window.innerWidth) * 2 - 1;
  const y = -(clientY / window.innerHeight) * 2 + 1;
  tapRaycaster.setFromCamera({ x, y }, camera);
  const targets = [];
  placedList.forEach((obj) =>
    obj.traverse((c) => {
      if (c.isMesh) targets.push(c);
    }),
  );
  return tapRaycaster.intersectObjects(targets, false);
}

// ─── Reticle ─────────────────────────────────────────────────
const reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.1, 0.14, 32).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({
    color: 0x18534f,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  }),
);
reticle.visible = false;
scene.add(reticle);

const selectionBox = new THREE.BoxHelper(new THREE.Object3D(), 0x18534f);
selectionBox.visible = false;
scene.add(selectionBox);

function setSelectionHighlight(obj) {
  if (obj) {
    selectionBox.setFromObject(obj);
    selectionBox.visible = true;
  } else {
    selectionBox.visible = false;
  }
}

// ─── Font ─────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:wght@500;600&display=swap";
document.head.appendChild(fontLink);

// ─── CSS ─────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  :root {
    --teal:#18534F;--teal-dark:#0f3835;
    --teal-mid:rgba(24,83,79,0.75);--teal-glow:rgba(24,83,79,0.22);
    --teal-soft:rgba(24,83,79,0.1);--teal-chip:rgba(24,83,79,0.07);
    --sand:#18534F;--ink:#18534F;--muted:rgba(24,83,79,0.42);
    --red:#D95F5F;--green:#1e7a5e;
    --glass-dark:rgba(255,255,255,0.97);
    --glass-mid:rgba(255,255,255,0.88);
    --glass-light:rgba(24,83,79,0.05);
    --blur:blur(24px);
    --page-bg:#EEF3F2;
    --f-body:'DM Sans',sans-serif;--f-display:'Cormorant Garamond',serif;
  }
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}
  body{background:var(--page-bg);}

  /* ── Start screen ── */
  #start-screen{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#f5f9f8;z-index:1000;}
  #start-screen h1{font-family:var(--f-display);font-size:32px;font-weight:600;color:var(--teal);letter-spacing:0.02em;margin:0;}
  #start-screen p{font-family:var(--f-body);font-size:13px;color:var(--muted);margin:0;}
  #start-logo{width:180px;height:180px;object-fit:contain;margin-bottom:8px;animation:logoIn 0.8s ease both;}
  @keyframes logoIn{from{opacity:0;transform:scale(0.88);}to{opacity:1;transform:scale(1);}}
  #btn-start-ar{margin-top:8px;padding:14px 44px;background:var(--teal);color:#fff;font-family:var(--f-body);font-size:14px;font-weight:600;letter-spacing:0.05em;border:none;border-radius:50px;cursor:pointer;box-shadow:0 8px 32px var(--teal-glow);transition:transform 0.15s;}
  #btn-start-ar:active{transform:scale(0.95);}
  #btn-start-ar:disabled{opacity:0.6;cursor:not-allowed;}

  /* ── Top bar ── */
  #ui-top{position:fixed;top:0;left:0;right:0;height:62px;display:none;align-items:center;justify-content:space-between;padding:0 20px;background:rgba(255,255,255,0.96);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border-bottom:1px solid rgba(24,83,79,0.1);z-index:500;}
  #ui-top.on{display:flex;}
  #top-left{display:flex;flex-direction:column;gap:2px;}
  #top-name{font-family:var(--f-display);font-size:19px;font-weight:600;color:var(--teal);letter-spacing:0.01em;}
  #top-status{font-family:var(--f-body);font-size:10px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;}
  #btn-stop{padding:8px 18px;background:rgba(24,83,79,0.06);border:1px solid rgba(24,83,79,0.18);border-radius:50px;color:var(--teal);font-family:var(--f-body);font-size:12px;font-weight:500;cursor:pointer;transition:background 0.15s;}
  #btn-stop:active{background:rgba(24,83,79,0.14);}

  /* ── Tap hint overlay (replaces scan rings) ── */
  #tap-hint{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:12px;pointer-events:none;z-index:300;opacity:0;transition:opacity 0.4s;}
  #tap-hint.on{opacity:1;}
  #tap-hint-ring{width:72px;height:72px;border-radius:50%;border:2px solid var(--teal);animation:tapPulse 1.8s ease-in-out infinite;}
  #tap-hint-inner{width:20px;height:20px;border-radius:50%;background:var(--teal);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.7;}
  #tap-hint-lbl{font-family:var(--f-body);font-size:12px;font-weight:600;color:#fff;background:var(--teal);padding:5px 16px;border-radius:50px;white-space:nowrap;}
  @keyframes tapPulse{0%,100%{transform:scale(1);opacity:0.8;}50%{transform:scale(1.15);opacity:0.4;}}

  /* ── Scan rings (kept for visual continuity) ── */
  .s-ring{position:fixed;top:50%;left:50%;border:1.5px solid var(--teal);border-radius:50%;pointer-events:none;z-index:300;opacity:0;transition:opacity 0.4s;transform:translate(-50%,-56%);}
  .s-ring.on{animation:sPulse 2s ease-in-out infinite;}
  #sr1{width:160px;height:80px;}
  #sr2{width:220px;height:110px;animation-delay:0.35s;}
  #sr1.on{opacity:0.6;}#sr2.on{opacity:0.25;}
  @keyframes sPulse{0%,100%{transform:translate(-50%,-56%) scale(1);}50%{transform:translate(-50%,-56%) scale(1.07);}}

  /* ── Hint pill ── */
  #hint-pill{position:fixed;top:74px;left:50%;transform:translateX(-50%);font-family:var(--f-body);font-size:11.5px;font-weight:600;color:#fff;background:var(--teal);backdrop-filter:var(--blur);padding:6px 18px;border-radius:50px;border:none;z-index:500;pointer-events:none;white-space:nowrap;opacity:0;transition:opacity 0.25s;}
  #hint-pill.on{opacity:1;}

  /* ── Move banner ── */
  #move-banner{position:fixed;bottom:230px;left:50%;transform:translateX(-50%);font-family:var(--f-body);font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#fff;background:var(--teal);padding:7px 22px;border-radius:50px;z-index:500;pointer-events:none;display:none;white-space:nowrap;box-shadow:0 4px 20px var(--teal-glow);}

  /* ── Bottom panel ── */
  #ui-bottom{position:fixed;bottom:0;left:0;right:0;display:none;flex-direction:column;gap:10px;background:#fff;border-top:1px solid rgba(24,83,79,0.09);border-radius:22px 22px 0 0;padding:0 20px 44px;z-index:500;transition:transform 0.35s cubic-bezier(0.16,1,0.3,1);transform:translateY(0);}
  #ui-bottom.on{display:flex;}
  #ui-bottom.collapsed{transform:translateY(calc(100% - 36px));}

  /* ── Panel toggle ── */
  #panel-toggle{display:flex;align-items:center;justify-content:center;width:100%;padding:10px 0 4px;cursor:pointer;}
  #panel-toggle-inner{display:flex;flex-direction:column;align-items:center;gap:4px;}
  #drag-handle{width:36px;height:3px;background:rgba(24,83,79,0.15);border-radius:2px;transition:background 0.2s;}
  #panel-toggle:active #drag-handle{background:rgba(24,83,79,0.35);}
  #toggle-chevron{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:5px solid rgba(24,83,79,0.25);transition:transform 0.35s cubic-bezier(0.16,1,0.3,1);transform:rotate(0deg);}
  #ui-bottom.collapsed #toggle-chevron{transform:rotate(180deg);}
  #ui-bottom.collapsed #panel-content{visibility:hidden;}

  /* ── Labels ── */
  .sec-label{font-family:var(--f-body);font-size:9.5px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}

  /* ── Chip rail ── */
  #chip-rail{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding:2px 0 4px;}
  #chip-rail::-webkit-scrollbar{display:none;}
  .p-chip{flex-shrink:0;display:flex;align-items:center;gap:10px;padding:10px 14px 10px 10px;background:#f5f8f7;border:1.5px solid rgba(24,83,79,0.1);border-radius:14px;cursor:pointer;transition:border-color 0.2s,background 0.2s;min-width:150px;max-width:210px;}
  .p-chip.active{border-color:var(--teal);background:rgba(24,83,79,0.07);}
  .p-chip:active{opacity:0.6;}
  .p-thumb{width:42px;height:42px;flex-shrink:0;background:rgba(24,83,79,0.08);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:20px;overflow:hidden;}
  .p-thumb img{width:42px;height:42px;object-fit:cover;border-radius:9px;display:block;}
  .p-info{display:flex;align-items:center;min-width:0;}
  .p-name{font-family:var(--f-body);font-size:12.5px;font-weight:500;color:var(--teal);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;}

  /* ── Action row ── */
  #act-row{display:flex;flex-direction:column;gap:12px;width:100%;padding-top:6px;}
  .a-btn{border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform 0.12s,opacity 0.12s;background:transparent;}
  .a-btn:active{transform:scale(0.82);opacity:0.7;}
  #act-row-top{display:flex;align-items:center;justify-content:center;gap:12px;}

  #a-rot-l,#a-rot-r{width:64px;height:64px;border-radius:50%;background:#f0f4f3;border:1.5px solid rgba(24,83,79,0.18);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;transition:background 0.15s,border-color 0.15s,transform 0.12s,opacity 0.12s;flex-shrink:0;}
  .rot-lbl{font-family:var(--f-body);font-size:9px;font-weight:600;letter-spacing:0.04em;color:rgba(24,83,79,0.6);text-transform:capitalize;}
  #a-rot-l.spinning,#a-rot-r.spinning{background:rgba(24,83,79,0.1);border-color:var(--teal);}
  #a-rot-l.dim,#a-rot-r.dim{opacity:0.22;pointer-events:none;}

  #a-place{flex:1;height:58px;border-radius:50px;background:var(--teal);display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 6px 22px var(--teal-glow);border:none;transition:transform 0.15s,box-shadow 0.15s;}
  #a-place:active{transform:scale(0.97);}
  #place-lbl{font-family:var(--f-body);font-size:14px;font-weight:700;letter-spacing:0.08em;color:#fff;text-transform:uppercase;}
  #a-place.s-move{background:#1e6b60;}
  #a-place.s-ok{background:var(--green);animation:pop 0.3s cubic-bezier(0.34,1.56,0.64,1);}

  #act-row-bot{display:flex;align-items:center;justify-content:center;gap:10px;}

  .pill-btn{height:46px;border-radius:50px;padding:0 20px;background:#f5f8f7;border:1.5px solid rgba(24,83,79,0.12);display:flex;align-items:center;gap:8px;flex:1;justify-content:center;}
  .pill-btn span{font-family:var(--f-body);font-size:13px;font-weight:500;color:rgba(24,83,79,0.75);}
  .pill-btn:active{opacity:0.6;}

  .pill-danger{background:#fff0f0;border-color:rgba(217,95,95,0.2);}
  .pill-danger span{color:#D95F5F;}
  .pill-danger.dim{opacity:0.28;pointer-events:none;}

  #a-del-one{width:44px;height:44px;border-radius:50%;background:#fff0f0;border:1px solid rgba(217,95,95,0.22);}
  #a-del-one.dim{opacity:0.22;pointer-events:none;}
  #a-del{width:44px;height:44px;border-radius:50%;background:#f8f5f5;border:1px solid rgba(24,83,79,0.1);}

  @keyframes pop{from{transform:scale(0.82);}to{transform:scale(1);}}

  /* ── Rot label ── */
  #rot-label{position:fixed;bottom:195px;right:18px;font-family:var(--f-body);font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#fff;background:var(--teal);backdrop-filter:var(--blur);padding:5px 14px;border-radius:50px;z-index:500;pointer-events:none;opacity:0;transition:opacity 0.2s;white-space:nowrap;}
  #rot-label.on{opacity:1;}
`;
document.head.appendChild(style);

// ─── Start screen ─────────────────────────────────────────────
const startScreen = document.createElement("div");
startScreen.id = "start-screen";
startScreen.innerHTML = `
  <img id="start-logo" src="/ar_logo.png" alt="CasaDeco AR" />
  <h1>CasaDeco AR</h1>
  <p>Visualise furniture in your space</p>
  <button id="btn-start-ar">Start AR Experience</button>`;
document.body.appendChild(startScreen);

// ─── Top bar ─────────────────────────────────────────────────
const uiTop = document.createElement("div");
uiTop.id = "ui-top";
uiTop.innerHTML = `
  <div id="top-left">
    <div id="top-name">CasaDeco</div>
    <div id="top-status">Point camera at the floor</div>
  </div>
  <button id="btn-stop">Stop AR</button>`;
document.body.appendChild(uiTop);

// ─── Scan rings ───────────────────────────────────────────────
["sr1", "sr2"].forEach((id) => {
  const el = document.createElement("div");
  el.id = id;
  el.className = "s-ring";
  document.body.appendChild(el);
});

// ─── Tap hint overlay ─────────────────────────────────────────
const tapHint = document.createElement("div");
tapHint.id = "tap-hint";
tapHint.innerHTML = `
  <div style="position:relative;width:72px;height:72px;">
    <div id="tap-hint-ring"></div>
    <div id="tap-hint-inner"></div>
  </div>
  <div id="tap-hint-lbl">Tap floor to place</div>`;
document.body.appendChild(tapHint);

// ─── Hint pill ────────────────────────────────────────────────
const hintPill = document.createElement("div");
hintPill.id = "hint-pill";
document.body.appendChild(hintPill);

const moveBanner = document.createElement("div");
moveBanner.id = "move-banner";
moveBanner.textContent = "Tap the floor to move · tap ✓ to lock";
document.body.appendChild(moveBanner);

const rotLabel = document.createElement("div");
rotLabel.id = "rot-label";
document.body.appendChild(rotLabel);

// ─── Bottom bar ───────────────────────────────────────────────
const uiBottom = document.createElement("div");
uiBottom.id = "ui-bottom";
uiBottom.innerHTML = `
  <div id="panel-toggle">
    <div id="panel-toggle-inner">
      <div id="drag-handle"></div>
      <div id="toggle-chevron"></div>
    </div>
  </div>
  <div id="panel-content">
    <div style="padding-top:4px">
      <div class="sec-label">Products</div>
      <div id="chip-rail"></div>
    </div>
    <div id="act-row">
      <div id="act-row-top">
        <button class="a-btn dim" id="a-rot-l" title="Rotate left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18534F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2.5 12a9.5 9.5 0 1 1 1.8 5.6"/><polyline points="2 17 2.5 12 7.5 13.5"/>
          </svg>
          <span class="rot-lbl">Rotate</span>
        </button>

        <button class="a-btn" id="a-place">
          <svg width="18" height="18" viewBox="0 0 24 24" id="ico-aim-svg" fill="white" stroke="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" id="ico-check-svg" fill="none" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" style="display:none">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" id="ico-move-svg" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
            <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/>
            <line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>
          </svg>
          <span id="place-lbl">PLACE FURNITURE</span>
        </button>

        <button class="a-btn dim" id="a-rot-r" title="Rotate right">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18534F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 12a9.5 9.5 0 1 0-1.8 5.6"/><polyline points="22 17 21.5 12 16.5 13.5"/>
          </svg>
          <span class="rot-lbl">Rotate</span>
        </button>
      </div>

      <div id="act-row-bot">
        <button class="a-btn pill-btn" id="a-undo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(24,83,79,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
          </svg>
          <span>Undo</span>
        </button>

        <button class="a-btn pill-btn pill-danger dim" id="a-del-one">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D95F5F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
          </svg>
          <span>Delete</span>
        </button>

        <button class="a-btn pill-btn" id="a-del">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(24,83,79,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <span>Clear All</span>
        </button>
      </div>
    </div>
  </div>`;
document.body.appendChild(uiBottom);

// ─── Panel toggle ─────────────────────────────────────────────
let panelCollapsed = false;
document.getElementById("panel-toggle").addEventListener("click", () => {
  panelCollapsed = !panelCollapsed;
  uiBottom.classList.toggle("collapsed", panelCollapsed);
});

// ─── Refs ─────────────────────────────────────────────────────
const topStatus = document.getElementById("top-status");
const btnStop = document.getElementById("btn-stop");
const chipRail = document.getElementById("chip-rail");
const aPlace = document.getElementById("a-place");
const aUndo = document.getElementById("a-undo");
const aDel = document.getElementById("a-del");
const aDelOne = document.getElementById("a-del-one");
const aRotL = document.getElementById("a-rot-l");
const aRotR = document.getElementById("a-rot-r");
const icoAim = document.getElementById("ico-aim-svg");
const icoCheck = document.getElementById("ico-check-svg");
const icoMove = document.getElementById("ico-move-svg");
const sr1 = document.getElementById("sr1");
const sr2 = document.getElementById("sr2");

// ─── Products ────────────────────────────────────────────────
const urlParams = new URLSearchParams(window.location.search);

function getCategoryEmoji(category) {
  if (!category) return "🛋️";
  const map = {
    seating: "🪑",
    chair: "🪑",
    chaise: "🪑",
    sofa: "🛋️",
    canapé: "🛋️",
    couch: "🛋️",
    table: "🪵",
    desk: "🖥️",
    bed: "🛏️",
    storage: "🗄️",
    lamp: "💡",
    shelf: "📚",
  };
  const lower = category.toLowerCase();
  for (const [key, emoji] of Object.entries(map)) {
    if (lower.includes(key)) return emoji;
  }
  return "🛋️";
}

let products = [];
try {
  const productsParam = urlParams.get("products");
  if (productsParam) {
    const parsed = JSON.parse(decodeURIComponent(productsParam));
    products = parsed.map((p, i) => ({
      id: p.id || `p${i}`,
      name: p.name || "Product",
      cat: p.category || "",
      emoji: getCategoryEmoji(p.category),
      url: p.modelUrl,
      imageUrl: p.imageUrl || null,
    }));
  }
} catch (e) {
  console.warn("Could not parse products param", e);
}

if (products.length === 0) {
  const modelParam = urlParams.get("model") || "/models/chaise.glb";
  products = [
    {
      id: "p1",
      name: "Chair",
      cat: "Seating",
      emoji: "🪑",
      url: modelParam,
      imageUrl: null,
    },
  ];
}

const initialModelUrl = urlParams.get("model");
let activeProductId = products[0].id;
if (initialModelUrl) {
  const match = products.find(
    (p) => p.url === decodeURIComponent(initialModelUrl),
  );
  if (match) activeProductId = match.id;
}

// ─── State ───────────────────────────────────────────────────
let appMode = "idle";
let previewObj = null,
  selectedObj = null;
const placedList = [];
let gltfScene = null,
  modelScale = 1,
  modelLift = 0;
const userRotations = new WeakMap();
const frozenRotations = new WeakMap();
const ROT_STEP = Math.PI / 12;
const ROT_SPEED = Math.PI / 60;
let rotInterval = null;

// ─── Positioning ─────────────────────────────────────────────
function faceCameraY(objPos, camPos) {
  return Math.atan2(camPos.x - objPos.x, camPos.z - objPos.z);
}

function positionObject(obj) {
  obj.position.set(floorPos.x, floorPos.y + modelLift, floorPos.z);
  const camPos = new THREE.Vector3();
  camera.getWorldPosition(camPos);
  const baseAngle = faceCameraY(obj.position, camPos);
  const userDelta = userRotations.get(obj) ?? 0;
  obj.rotation.set(0, baseAngle + userDelta, 0);
}

// ─── Rotation UI ─────────────────────────────────────────────
function activeRotTarget() {
  if (appMode === "previewing" && previewObj) return previewObj;
  if (appMode === "selected" && selectedObj) return selectedObj;
  return null;
}

function updateRotUI() {
  const target = activeRotTarget();
  if (!target) {
    aRotL.classList.add("dim");
    aRotR.classList.add("dim");
    rotLabel.classList.remove("on");
    aDelOne.classList.add("dim");
    return;
  }
  aRotL.classList.remove("dim");
  aRotR.classList.remove("dim");
  if (appMode === "selected") {
    aDelOne.classList.remove("dim");
  } else {
    aDelOne.classList.add("dim");
  }
  const deg = Math.round(
    (((userRotations.get(target) ?? 0) * 180) / Math.PI + 3600) % 360,
  );
  rotLabel.textContent = `${deg}°`;
  rotLabel.classList.add("on");
}

function rotate(delta) {
  const target = activeRotTarget();
  if (!target) return;
  userRotations.set(target, (userRotations.get(target) ?? 0) + delta);
  updateRotUI();
}

function startSpin(dir, btn) {
  if (rotInterval) return;
  btn.classList.add("spinning");
  rotInterval = setInterval(() => rotate(dir * ROT_SPEED), 16);
}
function stopSpin() {
  if (rotInterval) {
    clearInterval(rotInterval);
    rotInterval = null;
  }
  aRotL.classList.remove("spinning");
  aRotR.classList.remove("spinning");
}

function wireRotBtn(btn, dir) {
  btn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      rotate(dir * ROT_STEP);
      startSpin(dir, btn);
    },
    { passive: false },
  );
  btn.addEventListener("touchend", stopSpin, { passive: true });
  btn.addEventListener("touchcancel", stopSpin, { passive: true });
  btn.addEventListener("mousedown", () => {
    rotate(dir * ROT_STEP);
    startSpin(dir, btn);
  });
  btn.addEventListener("mouseup", stopSpin);
  btn.addEventListener("mouseleave", stopSpin);
}
wireRotBtn(aRotL, -1);
wireRotBtn(aRotR, +1);

// ─── General UI ───────────────────────────────────────────────
function setPlaceIcon(s) {
  icoAim.style.display = s === "aim" ? "" : "none";
  icoCheck.style.display = s === "check" ? "" : "none";
  icoMove.style.display = s === "move" ? "" : "none";
  const lbl = document.getElementById("place-lbl");
  if (s === "aim") lbl.textContent = "PLACE FURNITURE";
  if (s === "check") lbl.textContent = "CONFIRM POSITION";
  if (s === "move") lbl.textContent = "LOCK POSITION";
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
function setTapHint(on) {
  tapHint.classList.toggle("on", on);
}

// ─── Chip rail ────────────────────────────────────────────────
function buildRail() {
  chipRail.innerHTML = "";
  products.forEach((p) => {
    const c = document.createElement("div");
    c.className = "p-chip" + (p.id === activeProductId ? " active" : "");
    const thumb = document.createElement("div");
    thumb.className = "p-thumb";
    if (p.imageUrl) {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.src = p.imageUrl;
      img.alt = p.name;
      img.onerror = () => {
        thumb.innerHTML = "";
        thumb.textContent = p.emoji;
      };
      thumb.appendChild(img);
    } else {
      thumb.textContent = p.emoji;
    }
    const nameEl = document.createElement("div");
    nameEl.className = "p-name";
    nameEl.textContent = p.name;
    const info = document.createElement("div");
    info.className = "p-info";
    info.appendChild(nameEl);
    c.appendChild(thumb);
    c.appendChild(info);
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
  selectedObj = null;
  setSelectionHighlight(null);
  gltfScene = null;
  appMode = "idle";
  topStatus.textContent = "Loading…";
  setHint(null);
  setTapHint(false);
  updateRotUI();

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
      const nativeHeight = size.y;
      if (nativeHeight < 0.01) modelScale = 1.0 / nativeHeight;
      else if (nativeHeight > 10) modelScale = 0.01;
      else modelScale = 1.0;
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
  userRotations.set(g, 0);
  appMode = "previewing";
  setPlaceIcon("aim");
  setTapHint(true);
  topStatus.textContent = "Tap floor to place";
  setHint(null);
  moveBanner.style.display = "none";
  updateRotUI();
  if (panelCollapsed) {
    panelCollapsed = false;
    uiBottom.classList.remove("collapsed");
  }
}

// ─── doConfirm ────────────────────────────────────────────────
function doConfirm() {
  if (appMode === "previewing" && previewObj && floorFound) {
    frozenRotations.set(previewObj, previewObj.rotation.y);
    placedList.push(previewObj);
    previewObj = null;
    appMode = "idle";
    setSelectionHighlight(null);
    setTapHint(false);
    moveBanner.style.display = "none";
    setPlaceIcon("check");
    topStatus.textContent = "Placed!";
    setHint("Tap ↺ to undo · hold ⟳ to rotate · tap item to move");
    updateRotUI();
    setTimeout(() => {
      setPlaceIcon("aim");
      setHint(null);
      topStatus.textContent = "Tap a product to place another";
    }, 2500);
  } else if (appMode === "selected" && selectedObj && floorFound) {
    frozenRotations.set(selectedObj, selectedObj.rotation.y);
    selectedObj = null;
    appMode = "idle";
    setSelectionHighlight(null);
    moveBanner.style.display = "none";
    setPlaceIcon("check");
    topStatus.textContent = "Position locked";
    updateRotUI();
    setTimeout(() => {
      setPlaceIcon("aim");
      topStatus.textContent = "Ready";
    }, 1200);
  }
}

// ─── isUIElement — prevents floor taps firing on UI ──────────
function isUIElement(target) {
  return target.closest("#ui-bottom") || target.closest("#ui-top");
}

// ─── Tap handler (replaces WebXR "select") ───────────────────
function handleTap(clientX, clientY, targetEl) {
  if (targetEl && isUIElement(targetEl)) return;

  if (appMode === "previewing") {
    const hit = screenToFloor(clientX, clientY);
    if (hit) {
      floorPos.copy(hit);
      floorFound = true;
      previewObj.visible = true;
      positionObject(previewObj);
      setTapHint(false);
      doConfirm();
    }
    return;
  }

  if (appMode === "selected") {
    const hit = screenToFloor(clientX, clientY);
    if (hit) {
      floorPos.copy(hit);
      floorFound = true;
      positionObject(selectedObj);
      setSelectionHighlight(selectedObj);
      // Freeze new position immediately
      frozenRotations.set(selectedObj, selectedObj.rotation.y);
    }
    return;
  }

  // idle — try to select a placed object
  if (appMode === "idle" && placedList.length > 0) {
    const hits = raycastPlacedObjects(clientX, clientY);
    if (hits.length > 0) {
      const hitMesh = hits[0].object;
      const hitObj = placedList.find((obj) => {
        let found = false;
        obj.traverse((c) => {
          if (c === hitMesh) found = true;
        });
        return found;
      });
      if (hitObj) {
        selectedObj = hitObj;
        appMode = "selected";
        setSelectionHighlight(hitObj);
        moveBanner.style.display = "block";
        setPlaceIcon("move");
        topStatus.textContent = "Tap floor to move · tap ✓ to lock";
        updateRotUI();
      }
    }
  }
}

// ─── Register tap listeners on the renderer canvas ───────────
renderer.domElement.addEventListener("click", (e) => {
  handleTap(e.clientX, e.clientY, e.target);
});
renderer.domElement.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    handleTap(
      t.clientX,
      t.clientY,
      document.elementFromPoint(t.clientX, t.clientY),
    );
  },
  { passive: false },
);

// ─── Button listeners ─────────────────────────────────────────
aPlace.addEventListener("click", () => {
  if (appMode === "previewing" || appMode === "selected") {
    doConfirm();
  } else if (appMode === "idle" && placedList.length > 0) {
    selectedObj = placedList[placedList.length - 1];
    appMode = "selected";
    setSelectionHighlight(selectedObj);
    moveBanner.style.display = "block";
    setPlaceIcon("move");
    topStatus.textContent = "Tap floor to move · tap ✓ to lock";
    updateRotUI();
  }
});

aUndo.addEventListener("click", () => {
  stopSpin();
  if (appMode === "selected" && selectedObj) {
    const i = placedList.indexOf(selectedObj);
    if (i !== -1) placedList.splice(i, 1);
    scene.remove(selectedObj);
    selectedObj = null;
    appMode = "idle";
    setSelectionHighlight(null);
    moveBanner.style.display = "none";
    setPlaceIcon("aim");
    setHint(null);
    topStatus.textContent = "Removed";
    updateRotUI();
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
    setTapHint(false);
    updateRotUI();
  }
});

aDel.addEventListener("click", () => {
  stopSpin();
  placedList.forEach((o) => scene.remove(o));
  placedList.length = 0;
  if (previewObj) {
    scene.remove(previewObj);
    previewObj = null;
  }
  selectedObj = null;
  appMode = "idle";
  setSelectionHighlight(null);
  moveBanner.style.display = "none";
  setPlaceIcon("aim");
  setHint(null);
  setTapHint(false);
  topStatus.textContent = "Cleared";
  updateRotUI();
  setTimeout(() => (topStatus.textContent = "Tap a product to place"), 1200);
});

aDelOne.addEventListener("click", (e) => {
  e.stopPropagation();
  stopSpin();
  if (appMode === "selected" && selectedObj) {
    const i = placedList.indexOf(selectedObj);
    if (i !== -1) placedList.splice(i, 1);
    scene.remove(selectedObj);
    selectedObj = null;
    appMode = "idle";
    setSelectionHighlight(null);
    moveBanner.style.display = "none";
    setPlaceIcon("aim");
    setHint(null);
    topStatus.textContent = "Deleted";
    updateRotUI();
    setTimeout(() => (topStatus.textContent = "Ready"), 1200);
  }
});

// ─── Start AR ─────────────────────────────────────────────────
document.getElementById("btn-start-ar").addEventListener("click", async () => {
  if (arStarted) return;
  const btn = document.getElementById("btn-start-ar");
  btn.disabled = true;
  btn.textContent = "Starting…";

  try {
    await mindarThree.start();
    arStarted = true;

    startScreen.style.display = "none";
    uiTop.classList.add("on");
    uiBottom.classList.add("on");
    panelCollapsed = false;
    uiBottom.classList.remove("collapsed");

    buildRail();
    loadModel(products.find((p) => p.id === activeProductId).url);

    // Render loop
    renderer.setAnimationLoop(() => {
      // Keep selection box updated while dragging
      if (appMode === "selected" && selectedObj) {
        setSelectionHighlight(selectedObj);
      }
      // Keep placed objects at their frozen rotation
      placedList.forEach((obj) => {
        if (obj !== selectedObj) {
          obj.rotation.y = frozenRotations.get(obj) ?? 0;
        }
      });
      renderer.render(scene, camera);
    });
  } catch (err) {
    console.error("[MindAR] start failed:", err);
    btn.disabled = false;
    btn.textContent = "Start AR Experience";
    topStatus.textContent = "Camera error — check permissions";
  }
});

// ─── Stop AR ─────────────────────────────────────────────────
btnStop.addEventListener("click", async () => {
  stopSpin();
  renderer.setAnimationLoop(null);
  await mindarThree.stop();
  arStarted = false;

  uiTop.classList.remove("on");
  uiBottom.classList.remove("on");
  panelCollapsed = false;
  setTapHint(false);
  setScan(false);
  moveBanner.style.display = "none";
  rotLabel.classList.remove("on");
  setHint(null);
  floorFound = false;

  const btn = document.getElementById("btn-start-ar");
  btn.disabled = false;
  btn.textContent = "Start AR Experience";
  startScreen.style.display = "flex";
});

// ─── Flutter bridge ───────────────────────────────────────────
window.setModel = (url) => {
  const p = products.find((x) => x.url === url);
  if (p) {
    activeProductId = p.id;
    buildRail();
  }
  loadModel(url);
};
window.removeLastObject = () => aUndo.click();
window.clearAll = () => aDel.click();

// ─── Resize ───────────────────────────────────────────────────
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

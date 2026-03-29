// import * as THREE from "three";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { ARButton } from "three/addons/webxr/ARButton.js";

// // ─── Renderer ────────────────────────────────────────────────
// const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.xr.enabled = true;
// document.body.appendChild(renderer.domElement);

// // ─── Scene & Camera ──────────────────────────────────────────
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   70,
//   window.innerWidth / window.innerHeight,
//   0.01,
//   20,
// );

// // ─── Lighting ────────────────────────────────────────────────
// scene.add(new THREE.AmbientLight(0xffffff, 2.0));
// const sun = new THREE.DirectionalLight(0xffffff, 2.0);
// sun.position.set(2, 4, 2);
// scene.add(sun);

// // ─── Status UI ───────────────────────────────────────────────
// const statusEl = document.getElementById("status");
// const setStatus = (msg) => {
//   statusEl.textContent = msg;
// };

// // ─── AR Button ───────────────────────────────────────────────
// document.body.appendChild(
//   ARButton.createButton(renderer, {
//     requiredFeatures: ["hit-test"],
//     optionalFeatures: ["dom-overlay"],
//     domOverlay: { root: document.body },
//   }),
// );

// // ─── Inject UI styles ────────────────────────────────────────
// const style = document.createElement("style");
// style.textContent = `
//   #ar-ui {
//     position: fixed;
//     bottom: 40px;
//     left: 0; right: 0;
//     display: none;
//     flex-direction: column;
//     align-items: center;
//     gap: 16px;
//     z-index: 100;
//     pointer-events: none;
//   }
//   #ar-ui.visible { display: flex; }

//   #ar-hint {
//     color: rgba(255,255,255,0.85);
//     font-size: 13px;
//     font-family: -apple-system, sans-serif;
//     background: rgba(0,0,0,0.45);
//     padding: 6px 16px;
//     border-radius: 20px;
//     backdrop-filter: blur(6px);
//   }

//   #ar-controls {
//     display: flex;
//     align-items: center;
//     gap: 20px;
//     pointer-events: all;
//   }

//   .ar-btn {
//     width: 56px; height: 56px;
//     border-radius: 50%;
//     border: none;
//     cursor: pointer;
//     display: flex; align-items: center; justify-content: center;
//     backdrop-filter: blur(10px);
//     transition: transform 0.15s, opacity 0.15s;
//     -webkit-tap-highlight-color: transparent;
//   }
//   .ar-btn:active { transform: scale(0.88); opacity: 0.7; }

//   #btn-delete {
//     background: rgba(220, 53, 69, 0.85);
//     box-shadow: 0 4px 20px rgba(220,53,69,0.4);
//   }
//   #btn-place {
//     width: 72px; height: 72px;
//     background: rgba(255,255,255,0.95);
//     box-shadow: 0 4px 24px rgba(0,0,0,0.3);
//   }
//   #btn-place.placed {
//     background: rgba(40, 167, 69, 0.9);
//     box-shadow: 0 4px 24px rgba(40,167,69,0.4);
//   }
//   #btn-clear {
//     background: rgba(255,255,255,0.18);
//     border: 1.5px solid rgba(255,255,255,0.35);
//     box-shadow: 0 4px 16px rgba(0,0,0,0.2);
//   }

//   /* Reticle ring animation */
//   @keyframes pulse {
//     0%,100% { opacity: 1; }
//     50%      { opacity: 0.5; }
//   }
// `;
// document.head.appendChild(style);

// // ─── Inject UI HTML ──────────────────────────────────────────
// const uiEl = document.createElement("div");
// uiEl.id = "ar-ui";
// uiEl.innerHTML = `
//   <div id="ar-hint">Point at floor to detect surface</div>
//   <div id="ar-controls">
//     <button class="ar-btn" id="btn-delete" title="Delete last">
//       <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
//         <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
//       </svg>
//     </button>

//     <button class="ar-btn" id="btn-place" title="Place / Move">
//       <svg id="icon-place" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
//         <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
//         <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>
//       </svg>
//       <svg id="icon-placed" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:none">
//         <polyline points="20 6 9 17 4 12"/>
//       </svg>
//     </button>

//     <button class="ar-btn" id="btn-clear" title="Clear all">
//       <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
//         <path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>
//       </svg>
//     </button>
//   </div>
// `;
// document.body.appendChild(uiEl);

// const hintEl = document.getElementById("ar-hint");
// const btnPlace = document.getElementById("btn-place");
// const btnDelete = document.getElementById("btn-delete");
// const btnClear = document.getElementById("btn-clear");
// const iconPlace = document.getElementById("icon-place");
// const iconPlaced = document.getElementById("icon-placed");

// // ─── Reticle ─────────────────────────────────────────────────
// const reticle = new THREE.Mesh(
//   new THREE.RingGeometry(0.1, 0.15, 32).rotateX(-Math.PI / 2),
//   new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     side: THREE.DoubleSide,
//     transparent: true,
//     opacity: 0.85,
//   }),
// );
// reticle.matrixAutoUpdate = false;
// reticle.visible = false;
// scene.add(reticle);

// // Small dot at center of reticle
// const dot = new THREE.Mesh(
//   new THREE.CircleGeometry(0.02, 16).rotateX(-Math.PI / 2),
//   new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
// );
// dot.matrixAutoUpdate = false;
// dot.visible = false;
// scene.add(dot);

// // ─── State ───────────────────────────────────────────────────
// let hitTestSource = null;
// let hitTestSourceRequested = false;
// const floorPos = new THREE.Vector3();
// let floorFound = false;

// // Modes: "preview" = following reticle, "placed" = fixed on floor
// let mode = "preview";
// let activeObject = null; // the object currently being previewed/moved
// const placedObjects = [];

// let gltfScene = null;
// let modelScale = 1;
// let modelLift = 0;
// const TARGET_H = 0.9;

// // ─── Load Model ───────────────────────────────────────────────
// function loadModel(url) {
//   gltfScene = null;
//   mode = "preview";
//   activeObject = null;
//   setStatus("Loading model...");

//   new GLTFLoader().load(
//     url,
//     (gltf) => {
//       const probe = gltf.scene.clone(true);
//       scene.add(probe);
//       probe.updateMatrixWorld(true);
//       const box = new THREE.Box3().setFromObject(probe);
//       scene.remove(probe);

//       const size = new THREE.Vector3();
//       box.getSize(size);
//       modelScale = TARGET_H / size.y;
//       modelLift = -box.min.y * modelScale;

//       console.log(
//         `scale=${modelScale.toFixed(6)} lift=${modelLift.toFixed(4)}`,
//       );

//       gltfScene = gltf.scene;
//       spawnPreview();
//     },
//     undefined,
//     (err) => {
//       setStatus("Error loading model");
//       console.error(err);
//     },
//   );
// }

// function spawnPreview() {
//   if (!gltfScene) return;
//   // Remove previous preview if any
//   if (activeObject) scene.remove(activeObject);

//   const group = new THREE.Group();
//   group.add(gltfScene.clone(true));
//   group.scale.setScalar(modelScale);
//   group.visible = false; // hidden until floor found
//   scene.add(group);
//   activeObject = group;
//   mode = "preview";

//   setStatus("Point at floor to place");
//   hintEl.textContent = "Point at floor to detect surface";
//   btnPlace.classList.remove("placed");
//   iconPlace.style.display = "";
//   iconPlaced.style.display = "none";
// }

// // ─── XR Session ──────────────────────────────────────────────
// renderer.xr.addEventListener("sessionstart", () => {
//   uiEl.classList.add("visible");

//   const session = renderer.xr.getSession();

//   // Place button
//   btnPlace.addEventListener("click", () => {
//     if (!floorFound || !activeObject) return;

//     if (mode === "preview") {
//       // Fix it on the floor
//       mode = "placed";
//       placedObjects.push(activeObject);
//       activeObject = null;

//       btnPlace.classList.add("placed");
//       iconPlace.style.display = "none";
//       iconPlaced.style.display = "";
//       hintEl.textContent = "Placed! Tap + to add another";

//       // Spawn next preview after short delay
//       setTimeout(() => {
//         spawnPreview();
//       }, 600);
//     }
//   });

//   // Also place via screen tap (select event)
//   session.addEventListener("select", () => {
//     if (!floorFound || !activeObject || mode !== "preview") return;
//     btnPlace.click();
//   });

//   // Delete last placed
//   btnDelete.addEventListener("click", () => {
//     if (placedObjects.length > 0) {
//       scene.remove(placedObjects.pop());
//       hintEl.textContent = "Removed last item";
//       setTimeout(() => {
//         hintEl.textContent = "Tap floor to place";
//       }, 1500);
//     }
//   });

//   // Clear all
//   btnClear.addEventListener("click", () => {
//     placedObjects.forEach((o) => scene.remove(o));
//     placedObjects.length = 0;
//     hintEl.textContent = "All cleared";
//     setTimeout(() => spawnPreview(), 800);
//   });

//   session.addEventListener("end", () => {
//     uiEl.classList.remove("visible");
//     hitTestSource = null;
//     hitTestSourceRequested = false;
//     floorFound = false;
//   });
// });

// // ─── Flutter Bridge ───────────────────────────────────────────
// const modelUrl =
//   new URLSearchParams(window.location.search).get("model") ||
//   "/models/chaise.glb";
// loadModel(modelUrl);

// window.setModel = (url) => loadModel(url);
// window.removeLastObject = () => btnDelete.click();
// window.clearAll = () => btnClear.click();

// // ─── Render Loop ─────────────────────────────────────────────
// renderer.setAnimationLoop((_, frame) => {
//   if (frame) {
//     const refSpace = renderer.xr.getReferenceSpace();
//     const session = renderer.xr.getSession();

//     if (!hitTestSourceRequested) {
//       session.requestReferenceSpace("viewer").then((vs) => {
//         session.requestHitTestSource({ space: vs }).then((src) => {
//           hitTestSource = src;
//         });
//       });
//       hitTestSourceRequested = true;
//     }

//     if (hitTestSource) {
//       const hits = frame.getHitTestResults(hitTestSource);
//       if (hits.length > 0) {
//         const m = hits[0].getPose(refSpace).transform.matrix;

//         reticle.visible = true;
//         reticle.matrix.fromArray(m);
//         dot.visible = true;
//         dot.matrix.fromArray(m);

//         floorPos.set(m[12], m[13], m[14]);
//         floorFound = true;

//         // Move preview object with reticle
//         if (activeObject && mode === "preview") {
//           activeObject.visible = true;
//           activeObject.position.set(
//             floorPos.x,
//             floorPos.y + modelLift,
//             floorPos.z,
//           );

//           // Face camera
//           const camPos = new THREE.Vector3();
//           renderer.xr.getCamera().getWorldPosition(camPos);
//           activeObject.lookAt(camPos.x, activeObject.position.y, camPos.z);

//           hintEl.textContent = "Tap screen or ✓ to place here";
//         }
//       } else {
//         reticle.visible = false;
//         dot.visible = false;
//         floorFound = false;
//         if (mode === "preview")
//           hintEl.textContent = "Point at floor to detect surface";
//       }
//     }
//   }

//   renderer.render(scene, camera);
// });

// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });
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
const setStatus = (msg) => {
  statusEl.textContent = msg;
};

document.body.appendChild(
  ARButton.createButton(renderer, {
    requiredFeatures: ["hit-test"],
    optionalFeatures: ["dom-overlay"],
    domOverlay: { root: document.body },
  }),
);

// ─── Styles ──────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  /* Override the default ARButton position */
  .ar-button, [id*="ARButton"], button[style*="bottom"] {
    bottom: 90px !important;
  }

  #hint-bar {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255,255,255,0.92);
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    background: rgba(0,0,0,0.5);
    padding: 7px 18px;
    border-radius: 20px;
    backdrop-filter: blur(8px);
    z-index: 200;
    white-space: nowrap;
    pointer-events: none;
    display: none;
  }

  /* ── Bottom action bar ── */
  #action-bar {
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    display: none;
    align-items: center;
    gap: 16px;
    z-index: 200;
    pointer-events: all;
  }
  #action-bar.visible { display: flex; }

  .ab-btn {
    width: 54px; height: 54px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(12px);
    transition: transform 0.12s;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .ab-btn:active { transform: scale(0.85); }

  #btn-delete {
    background: rgba(220,53,69,0.88);
    box-shadow: 0 4px 18px rgba(220,53,69,0.45);
  }
  #btn-confirm {
    width: 68px; height: 68px;
    background: rgba(255,255,255,0.96);
    box-shadow: 0 4px 24px rgba(0,0,0,0.28);
  }
  #btn-confirm.moving {
    background: rgba(255, 193, 7, 0.95);
  }
  #btn-confirm.placed {
    background: rgba(40, 167, 69, 0.95);
    box-shadow: 0 4px 24px rgba(40,167,69,0.45);
  }
  #btn-clear {
    background: rgba(255,255,255,0.16);
    border: 1.5px solid rgba(255,255,255,0.35);
    box-shadow: 0 2px 12px rgba(0,0,0,0.2);
  }

  /* ── Right sidebar ── */
  #sidebar {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: none;
    flex-direction: column;
    gap: 12px;
    padding: 12px 10px;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(12px);
    border-radius: 18px 0 0 18px;
    z-index: 200;
    pointer-events: all;
  }
  #sidebar.visible { display: flex; }

  .sb-item {
    width: 56px; height: 56px;
    border-radius: 12px;
    border: 2px solid transparent;
    background: rgba(255,255,255,0.12);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.15s, background 0.15s;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
  }
  .sb-item:active { background: rgba(255,255,255,0.25); }
  .sb-item.active {
    border-color: rgba(255,255,255,0.9);
    background: rgba(255,255,255,0.2);
  }
  .sb-item img {
    width: 44px; height: 44px;
    object-fit: contain;
    border-radius: 8px;
  }
  .sb-item .sb-icon {
    font-size: 26px;
    user-select: none;
  }

  /* ── Selected object highlight ── */
  #move-hint {
    position: fixed;
    bottom: 110px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 12px;
    font-family: -apple-system, sans-serif;
    background: rgba(255,193,7,0.85);
    color: #000;
    padding: 5px 14px;
    border-radius: 14px;
    display: none;
    z-index: 200;
    pointer-events: none;
  }
`;
document.head.appendChild(style);

// ─── Hint bar ────────────────────────────────────────────────
const hintBar = document.createElement("div");
hintBar.id = "hint-bar";
document.body.appendChild(hintBar);

const moveHint = document.createElement("div");
moveHint.id = "move-hint";
moveHint.textContent = "Move phone to reposition • Tap ✓ to fix";
document.body.appendChild(moveHint);

// ─── Action bar ──────────────────────────────────────────────
const actionBar = document.createElement("div");
actionBar.id = "action-bar";
actionBar.innerHTML = `
  <button class="ab-btn" id="btn-delete" title="Delete selected">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
    </svg>
  </button>

  <button class="ab-btn" id="btn-confirm" title="Place / Confirm">
    <svg id="icon-crosshair" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.2" stroke-linecap="round">
      <circle cx="12" cy="12" r="3"/>
      <line x1="12" y1="2" x2="12" y2="6"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="6" y2="12"/>
      <line x1="18" y1="12" x2="22" y2="12"/>
    </svg>
    <svg id="icon-check" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" style="display:none">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <svg id="icon-move" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
    </svg>
  </button>

  <button class="ab-btn" id="btn-clear" title="Clear all">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
    </svg>
  </button>
`;
document.body.appendChild(actionBar);

// ─── Sidebar ─────────────────────────────────────────────────
const sidebar = document.createElement("div");
sidebar.id = "sidebar";
document.body.appendChild(sidebar);

// Product list — populated from URL params or defaults
const products = [
  { id: "chaise", label: "Chair", url: "/models/chaise.glb", emoji: "🪑" },
  // Add more products here
];

// Read products from URL if passed
const urlParams = new URLSearchParams(window.location.search);
const modelParam = urlParams.get("model");
// If a single model is passed, use it for the first product
if (modelParam) products[0].url = modelParam;

let activeProductId = products[0].id;

function buildSidebar() {
  sidebar.innerHTML = "";
  products.forEach((p) => {
    const item = document.createElement("div");
    item.className = "sb-item" + (p.id === activeProductId ? " active" : "");
    item.dataset.id = p.id;
    item.innerHTML = `<span class="sb-icon">${p.emoji}</span>`;
    item.addEventListener("click", () => {
      if (activeProductId === p.id && previewObject) return; // already active
      activeProductId = p.id;
      document
        .querySelectorAll(".sb-item")
        .forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
      loadModel(p.url);
    });
    sidebar.appendChild(item);
  });
}

// ─── Reticle ─────────────────────────────────────────────────
const reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.1, 0.15, 32).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  }),
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

// ─── State ───────────────────────────────────────────────────
let hitTestSource = null;
let hitTestSourceRequested = false;
const floorPos = new THREE.Vector3();
let floorFound = false;

// "previewing" = following floor, "selected" = placed but can be moved, "idle" = fixed
let appMode = "idle";
let previewObject = null; // follows the reticle
let selectedObject = null; // placed object being moved
const placedObjects = [];

let gltfScene = null;
let modelScale = 1;
let modelLift = 0;
const TARGET_H = 0.9;

// ─── Build a scaled group from gltfScene ─────────────────────
function buildGroup() {
  const g = new THREE.Group();
  g.add(gltfScene.clone(true));
  g.scale.setScalar(modelScale);
  return g;
}

// ─── Load Model ───────────────────────────────────────────────
function loadModel(url) {
  // Remove any existing preview
  if (previewObject) {
    scene.remove(previewObject);
    previewObject = null;
  }
  gltfScene = null;
  appMode = "idle";
  setStatus("Loading...");
  hintBar.textContent = "Loading model...";

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
      modelScale = TARGET_H / size.y;
      modelLift = -box.min.y * modelScale;

      gltfScene = gltf.scene;
      startPreview();
    },
    undefined,
    (err) => {
      setStatus("Error loading model");
      console.error(err);
    },
  );
}

function startPreview() {
  if (previewObject) scene.remove(previewObject);
  previewObject = buildGroup();
  previewObject.visible = false;
  scene.add(previewObject);
  appMode = "previewing";

  setStatus("");
  hintBar.textContent = "Point at floor to place";
  hintBar.style.display = "block";
  moveHint.style.display = "none";
  setConfirmBtn("crosshair");
}

// ─── Confirm button states ────────────────────────────────────
function setConfirmBtn(state) {
  const btn = document.getElementById("btn-confirm");
  document.getElementById("icon-crosshair").style.display = "none";
  document.getElementById("icon-check").style.display = "none";
  document.getElementById("icon-move").style.display = "none";

  btn.classList.remove("placed", "moving");

  if (state === "crosshair") {
    document.getElementById("icon-crosshair").style.display = "";
  } else if (state === "check") {
    document.getElementById("icon-check").style.display = "";
    btn.classList.add("placed");
  } else if (state === "move") {
    document.getElementById("icon-move").style.display = "";
    btn.classList.add("moving");
  }
}

// ─── Place / confirm action ───────────────────────────────────
function onConfirm() {
  if (appMode === "previewing" && previewObject && floorFound) {
    // Fix preview in place
    placedObjects.push(previewObject);
    previewObject = null;
    appMode = "idle";

    hintBar.textContent = "Placed! Select from sidebar to add more";
    moveHint.style.display = "none";
    setConfirmBtn("check");

    setTimeout(() => {
      setConfirmBtn("crosshair");
      hintBar.style.display = "none";
    }, 1500);
  } else if (appMode === "selected" && selectedObject && floorFound) {
    // Fix the selected object where it is
    selectedObject = null;
    appMode = "idle";
    moveHint.style.display = "none";
    hintBar.textContent = "Fixed in place ✓";
    setConfirmBtn("check");
    setTimeout(() => {
      setConfirmBtn("crosshair");
      hintBar.style.display = "none";
    }, 1200);
  }
}

// ─── Tap placed object to select & move it ───────────────────
const raycaster = new THREE.Raycaster();
const tapPoint = new THREE.Vector2();

function onScreenTap(event) {
  // In AR we use session select instead, but keep this for non-XR fallback
  if (!renderer.xr.isPresenting) return;
}

// ─── XR Session ──────────────────────────────────────────────
renderer.xr.addEventListener("sessionstart", () => {
  actionBar.classList.add("visible");
  sidebar.classList.add("visible");
  buildSidebar();
  loadModel(products[0].url);

  const session = renderer.xr.getSession();

  // Tap = confirm placement OR select object to move
  session.addEventListener("select", () => {
    if (appMode === "previewing") {
      onConfirm();
    } else if (appMode === "idle") {
      // Try to pick a placed object to move
      if (!floorFound) return;
      // Pick the closest placed object to where user is looking
      if (placedObjects.length > 0) {
        // Select the last placed (simplest UX)
        selectedObject = placedObjects[placedObjects.length - 1];
        appMode = "selected";
        moveHint.style.display = "block";
        hintBar.style.display = "block";
        hintBar.textContent = "Move phone to reposition";
        setConfirmBtn("move");
      }
    } else if (appMode === "selected") {
      onConfirm();
    }
  });

  document.getElementById("btn-confirm").addEventListener("click", onConfirm);

  document.getElementById("btn-delete").addEventListener("click", () => {
    if (appMode === "selected" && selectedObject) {
      const idx = placedObjects.indexOf(selectedObject);
      if (idx !== -1) placedObjects.splice(idx, 1);
      scene.remove(selectedObject);
      selectedObject = null;
      appMode = "idle";
      moveHint.style.display = "none";
      hintBar.textContent = "Deleted";
      setTimeout(() => {
        hintBar.style.display = "none";
      }, 1200);
      setConfirmBtn("crosshair");
    } else if (placedObjects.length > 0) {
      scene.remove(placedObjects.pop());
      hintBar.style.display = "block";
      hintBar.textContent = "Removed last item";
      setTimeout(() => {
        hintBar.style.display = "none";
      }, 1200);
    }
    if (previewObject) {
      scene.remove(previewObject);
      previewObject = null;
      appMode = "idle";
    }
  });

  document.getElementById("btn-clear").addEventListener("click", () => {
    placedObjects.forEach((o) => scene.remove(o));
    placedObjects.length = 0;
    if (previewObject) {
      scene.remove(previewObject);
      previewObject = null;
    }
    selectedObject = null;
    appMode = "idle";
    moveHint.style.display = "none";
    hintBar.style.display = "block";
    hintBar.textContent = "Cleared — select a product to place";
    setConfirmBtn("crosshair");
  });

  session.addEventListener("end", () => {
    actionBar.classList.remove("visible");
    sidebar.classList.remove("visible");
    hitTestSource = null;
    hitTestSourceRequested = false;
    floorFound = false;
  });
});

// ─── Flutter Bridge ───────────────────────────────────────────
window.setModel = (url) => {
  if (modelParam) products[0].url = url;
  loadModel(url);
};
window.removeLastObject = () => document.getElementById("btn-delete").click();
window.clearAll = () => document.getElementById("btn-clear").click();

// ─── Render Loop ─────────────────────────────────────────────
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

        // Move preview object
        if (appMode === "previewing" && previewObject) {
          previewObject.visible = true;
          previewObject.position.set(
            floorPos.x,
            floorPos.y + modelLift,
            floorPos.z,
          );
          previewObject.lookAt(camPos.x, previewObject.position.y, camPos.z);
          hintBar.textContent = "Tap screen or ✓ to place";
        }

        // Move selected object
        if (appMode === "selected" && selectedObject) {
          selectedObject.position.set(
            floorPos.x,
            floorPos.y + modelLift,
            floorPos.z,
          );
          selectedObject.lookAt(camPos.x, selectedObject.position.y, camPos.z);
        }
      } else {
        reticle.visible = false;
        floorFound = false;
        if (appMode === "previewing")
          hintBar.textContent = "Point at floor to detect surface";
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

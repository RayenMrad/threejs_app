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

// Hide default status
const statusEl = document.getElementById("status");
if (statusEl) statusEl.style.display = "none";

// ─── AR Button ───────────────────────────────────────────────
const arBtn = ARButton.createButton(renderer, {
  requiredFeatures: ["hit-test"],
  optionalFeatures: ["dom-overlay"],
  domOverlay: { root: document.body },
});
document.body.appendChild(arBtn);

// ─── Inject Google Font ───────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@500&display=swap";
document.head.appendChild(fontLink);

// ─── Styles ──────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  :root {
    --cream: #F5F0E8;
    --charcoal: #1C1C1E;
    --warm-gray: #8A8680;
    --accent: #C8A882;
    --accent-dark: #A0845E;
    --glass: rgba(28, 28, 30, 0.72);
    --glass-light: rgba(255,255,255,0.10);
    --red: #E05252;
    --green: #4CAF7D;
    --yellow: #E8B84B;
    --radius: 20px;
    --font-body: 'DM Sans', sans-serif;
    --font-display: 'Playfair Display', serif;
  }

  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

  /* ── Hide / restyle default AR button ── */
  #ARButton {
    bottom: 100px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    font-family: var(--font-body) !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    letter-spacing: 0.04em !important;
    padding: 12px 32px !important;
    border-radius: 50px !important;
    background: var(--accent) !important;
    color: var(--charcoal) !important;
    border: none !important;
    box-shadow: 0 8px 32px rgba(200,168,130,0.45) !important;
  }

  /* ── Top bar ── */
  #top-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 64px;
    display: none;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background: var(--glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 300;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  #top-bar.visible { display: flex; }

  #top-title {
    font-family: var(--font-display);
    font-size: 18px;
    color: var(--cream);
    letter-spacing: 0.01em;
  }

  #top-hint {
    font-family: var(--font-body);
    font-size: 12px;
    color: var(--warm-gray);
    font-weight: 400;
    letter-spacing: 0.02em;
  }

  #btn-close-ar {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,0.1);
    color: var(--cream);
    font-size: 18px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  #btn-close-ar:active { background: rgba(255,255,255,0.2); }

  /* ── Surface scan animation ── */
  #scan-overlay {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    z-index: 200;
    pointer-events: none;
  }
  #scan-overlay.visible { display: flex; }

  .scan-ring {
    width: 160px; height: 80px;
    border: 2px solid var(--accent);
    border-radius: 50%;
    opacity: 0.7;
    animation: scanPulse 2s ease-in-out infinite;
  }
  .scan-ring:nth-child(2) {
    width: 200px; height: 100px;
    opacity: 0.4;
    animation-delay: 0.4s;
  }
  @keyframes scanPulse {
    0%,100% { opacity: 0.7; transform: scaleX(1); }
    50% { opacity: 0.3; transform: scaleX(1.05); }
  }

  #scan-label {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    color: var(--cream);
    background: var(--glass);
    backdrop-filter: blur(12px);
    padding: 8px 20px;
    border-radius: 50px;
    letter-spacing: 0.03em;
    border: 1px solid rgba(255,255,255,0.1);
  }

  /* ── Bottom sheet ── */
  #bottom-sheet {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    padding: 0 20px 36px;
    display: none;
    flex-direction: column;
    gap: 16px;
    z-index: 300;
  }
  #bottom-sheet.visible { display: flex; }

  /* Product carousel */
  #product-rail-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  #rail-label {
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 600;
    color: var(--warm-gray);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0 4px;
  }

  #product-rail {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scrollbar-width: none;
    padding: 4px 2px;
    -webkit-overflow-scrolling: touch;
  }
  #product-rail::-webkit-scrollbar { display: none; }

  .product-chip {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px 10px 10px;
    background: var(--glass);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    min-width: 120px;
  }
  .product-chip:active { background: rgba(255,255,255,0.12); }
  .product-chip.active {
    border-color: var(--accent);
    background: rgba(200,168,130,0.15);
  }

  .chip-icon {
    width: 40px; height: 40px;
    background: rgba(255,255,255,0.07);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .chip-text { display: flex; flex-direction: column; gap: 1px; }
  .chip-name {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    color: var(--cream);
  }
  .chip-cat {
    font-family: var(--font-body);
    font-size: 11px;
    color: var(--warm-gray);
  }

  /* Action buttons row */
  #action-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
  }

  .act-btn {
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.12s, opacity 0.12s;
    pointer-events: all;
    -webkit-tap-highlight-color: transparent;
  }
  .act-btn:active { transform: scale(0.86); opacity: 0.75; }

  #btn-undo {
    width: 50px; height: 50px;
    border-radius: 50%;
    background: var(--glass);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.1);
  }

  #btn-place {
    width: 68px; height: 68px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 8px 28px rgba(200,168,130,0.5);
    position: relative;
  }
  #btn-place::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px solid rgba(200,168,130,0.35);
  }
  #btn-place.moving {
    background: var(--yellow);
    box-shadow: 0 8px 28px rgba(232,184,75,0.5);
  }
  #btn-place.moving::after { border-color: rgba(232,184,75,0.35); }
  #btn-place.confirmed {
    background: var(--green);
    box-shadow: 0 8px 28px rgba(76,175,125,0.5);
  }
  #btn-place.confirmed::after { border-color: rgba(76,175,125,0.35); }

  #btn-clear {
    width: 50px; height: 50px;
    border-radius: 50%;
    background: rgba(224,82,82,0.18);
    border: 1px solid rgba(224,82,82,0.3);
    backdrop-filter: blur(16px);
  }

  /* ── Move mode pill ── */
  #move-pill {
    position: fixed;
    bottom: 220px;
    left: 50%; transform: translateX(-50%);
    background: rgba(232,184,75,0.92);
    color: var(--charcoal);
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    padding: 7px 18px;
    border-radius: 50px;
    display: none;
    z-index: 300;
    pointer-events: none;
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }

  /* Entrance animations */
  @keyframes slideUp {
    from { transform: translateY(24px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  #bottom-sheet.visible { animation: slideUp 0.35s cubic-bezier(0.16,1,0.3,1); }
  #top-bar.visible      { animation: slideUp 0.3s ease; }
`;
document.head.appendChild(style);

// ─── Top Bar HTML ─────────────────────────────────────────────
const topBar = document.createElement("div");
topBar.id = "top-bar";
topBar.innerHTML = `
  <div>
    <div id="top-title">Place Furniture</div>
    <div id="top-hint">Move camera over floor</div>
  </div>
  <button id="btn-close-ar">✕</button>
`;
document.body.appendChild(topBar);

// ─── Scan Overlay ─────────────────────────────────────────────
const scanOverlay = document.createElement("div");
scanOverlay.id = "scan-overlay";
scanOverlay.innerHTML = `
  <div class="scan-ring"></div>
  <div class="scan-ring"></div>
  <div id="scan-label">Scanning floor surface…</div>
`;
document.body.appendChild(scanOverlay);

// ─── Move Pill ────────────────────────────────────────────────
const movePill = document.createElement("div");
movePill.id = "move-pill";
movePill.textContent = "↕ Move phone to reposition · tap ✓ to fix";
document.body.appendChild(movePill);

// ─── Bottom Sheet ─────────────────────────────────────────────
const bottomSheet = document.createElement("div");
bottomSheet.id = "bottom-sheet";
bottomSheet.innerHTML = `
  <div id="product-rail-wrap">
    <div id="rail-label">Products</div>
    <div id="product-rail"></div>
  </div>
  <div id="action-row">
    <button class="act-btn" id="btn-undo" title="Remove last">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
      </svg>
    </button>

    <button class="act-btn" id="btn-place" title="Place">
      <svg id="ico-place" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round">
        <circle cx="12" cy="12" r="2.5"/>
        <line x1="12" y1="3" x2="12" y2="7"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
        <line x1="3" y1="12" x2="7" y2="12"/>
        <line x1="17" y1="12" x2="21" y2="12"/>
      </svg>
      <svg id="ico-check" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" style="display:none">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <svg id="ico-move" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
        <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <line x1="12" y1="2" x2="12" y2="22"/>
      </svg>
    </button>

    <button class="act-btn" id="btn-clear" title="Clear all">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E05252" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
      </svg>
    </button>
  </div>
`;
document.body.appendChild(bottomSheet);

// ─── Reticle ─────────────────────────────────────────────────
const reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.1, 0.15, 32).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({
    color: 0xc8a882,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
  }),
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

// ─── Products ─────────────────────────────────────────────────
const urlParams = new URLSearchParams(window.location.search);
const modelParam = urlParams.get("model") || "/models/chaise.glb";

const products = [
  {
    id: "p1",
    name: "Chair",
    category: "Seating",
    emoji: "🪑",
    url: modelParam,
  },
];

// ─── State ───────────────────────────────────────────────────
let hitTestSource = null;
let hitTestSourceRequested = false;
const floorPos = new THREE.Vector3();
let floorFound = false;

let appMode = "idle"; // "previewing" | "selected" | "idle"
let previewObject = null;
let selectedObject = null;
const placedObjects = [];

let gltfScene = null;
let modelScale = 1;
let modelLift = 0;
const TARGET_H = 0.9;

// ─── DOM refs ─────────────────────────────────────────────────
const topHint = document.getElementById("top-hint");
const btnPlace = document.getElementById("btn-place");
const btnUndo = document.getElementById("btn-undo");
const btnClear = document.getElementById("btn-clear");
const btnCloseAR = document.getElementById("btn-close-ar");
const icoPlace = document.getElementById("ico-place");
const icoCheck = document.getElementById("ico-check");
const icoMove = document.getElementById("ico-move");
const productRail = document.getElementById("product-rail");

// ─── Helpers ─────────────────────────────────────────────────
function setPlaceIcon(state) {
  icoPlace.style.display = "none";
  icoCheck.style.display = "none";
  icoMove.style.display = "none";
  btnPlace.classList.remove("moving", "confirmed");
  if (state === "place") {
    icoPlace.style.display = "";
  } else if (state === "check") {
    icoCheck.style.display = "";
    btnPlace.classList.add("confirmed");
  } else if (state === "move") {
    icoMove.style.display = "";
    btnPlace.classList.add("moving");
  }
}

function setHint(txt) {
  topHint.textContent = txt;
}

function buildRail() {
  productRail.innerHTML = "";
  products.forEach((p) => {
    const chip = document.createElement("div");
    chip.className =
      "product-chip" + (p.id === products[0].id ? " active" : "");
    chip.dataset.id = p.id;
    chip.innerHTML = `
      <div class="chip-icon">${p.emoji}</div>
      <div class="chip-text">
        <div class="chip-name">${p.name}</div>
        <div class="chip-cat">${p.category}</div>
      </div>`;
    chip.addEventListener("click", () => {
      document
        .querySelectorAll(".product-chip")
        .forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      loadModel(p.url);
    });
    productRail.appendChild(chip);
  });
}

// ─── Load & Preview ───────────────────────────────────────────
function loadModel(url) {
  if (previewObject) {
    scene.remove(previewObject);
    previewObject = null;
  }
  gltfScene = null;
  appMode = "idle";
  setHint("Loading model…");

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
    (err) => console.error(err),
  );
}

function startPreview() {
  if (previewObject) scene.remove(previewObject);
  const g = new THREE.Group();
  g.add(gltfScene.clone(true));
  g.scale.setScalar(modelScale);
  g.visible = false;
  scene.add(g);
  previewObject = g;
  appMode = "previewing";
  setHint("Point camera at floor");
  setPlaceIcon("place");
  movePill.style.display = "none";
  scanOverlay.classList.add("visible");
}

function confirmPlace() {
  if (appMode === "previewing" && previewObject && floorFound) {
    placedObjects.push(previewObject);
    previewObject = null;
    appMode = "idle";
    movePill.style.display = "none";
    scanOverlay.classList.remove("visible");
    setPlaceIcon("check");
    setHint("Placed! Tap object to reposition");
    setTimeout(() => {
      setPlaceIcon("place");
      setHint("Point camera at floor");
    }, 1600);
    setTimeout(() => startPreview(), 1700);
  } else if (appMode === "selected" && selectedObject && floorFound) {
    selectedObject = null;
    appMode = "idle";
    movePill.style.display = "none";
    setPlaceIcon("check");
    setHint("Position fixed ✓");
    setTimeout(() => {
      setPlaceIcon("place");
      setHint("Tap object to reposition");
    }, 1400);
  }
}

// ─── XR Session ──────────────────────────────────────────────
renderer.xr.addEventListener("sessionstart", () => {
  topBar.classList.add("visible");
  bottomSheet.classList.add("visible");
  buildRail();
  loadModel(products[0].url);

  const session = renderer.xr.getSession();
  session.addEventListener("select", () => {
    if (appMode === "previewing") {
      confirmPlace();
    } else if (appMode === "idle" && placedObjects.length > 0) {
      selectedObject = placedObjects[placedObjects.length - 1];
      appMode = "selected";
      movePill.style.display = "block";
      setPlaceIcon("move");
      setHint("Move to reposition");
    } else if (appMode === "selected") {
      confirmPlace();
    }
  });

  btnPlace.addEventListener("click", () => {
    if (appMode === "previewing" || appMode === "selected") confirmPlace();
    else if (appMode === "idle" && placedObjects.length > 0) {
      selectedObject = placedObjects[placedObjects.length - 1];
      appMode = "selected";
      movePill.style.display = "block";
      setPlaceIcon("move");
      setHint("Move to reposition");
    }
  });

  btnUndo.addEventListener("click", () => {
    if (appMode === "selected" && selectedObject) {
      const idx = placedObjects.indexOf(selectedObject);
      if (idx !== -1) placedObjects.splice(idx, 1);
      scene.remove(selectedObject);
      selectedObject = null;
      appMode = "idle";
      movePill.style.display = "none";
      setPlaceIcon("place");
      setHint("Removed");
      setTimeout(() => setHint("Point camera at floor"), 1200);
    } else if (placedObjects.length > 0) {
      scene.remove(placedObjects.pop());
      setHint("Removed last item");
      setTimeout(() => setHint("Point camera at floor"), 1200);
    }
    if (previewObject) {
      scene.remove(previewObject);
      previewObject = null;
      appMode = "idle";
    }
  });

  btnClear.addEventListener("click", () => {
    placedObjects.forEach((o) => scene.remove(o));
    placedObjects.length = 0;
    if (previewObject) {
      scene.remove(previewObject);
      previewObject = null;
    }
    selectedObject = null;
    appMode = "idle";
    movePill.style.display = "none";
    setHint("Cleared");
    setTimeout(() => startPreview(), 600);
  });

  btnCloseAR.addEventListener("click", () => session.end());

  session.addEventListener("end", () => {
    topBar.classList.remove("visible");
    bottomSheet.classList.remove("visible");
    scanOverlay.classList.remove("visible");
    movePill.style.display = "none";
    hitTestSource = null;
    hitTestSourceRequested = false;
    floorFound = false;
  });
});

// ─── Flutter Bridge ───────────────────────────────────────────
window.setModel = (url) => {
  products[0].url = url;
  loadModel(url);
};
window.removeLastObject = () => btnUndo.click();
window.clearAll = () => btnClear.click();

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

        if (appMode === "previewing" && previewObject) {
          previewObject.visible = true;
          previewObject.position.set(
            floorPos.x,
            floorPos.y + modelLift,
            floorPos.z,
          );
          previewObject.lookAt(camPos.x, previewObject.position.y, camPos.z);
          scanOverlay.classList.remove("visible");
          setHint("Tap ✓ to place here");
        }
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
        if (appMode === "previewing") {
          scanOverlay.classList.add("visible");
          setHint("Move camera slowly over floor");
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

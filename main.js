// import * as THREE from "three";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { ARButton } from "three/addons/webxr/ARButton.js";

// // ─── Renderer ────────────────────────────────────────────────
// const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.xr.enabled = true;
// document.body.appendChild(renderer.domElement);

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   70,
//   window.innerWidth / window.innerHeight,
//   0.01,
//   20,
// );
// scene.add(new THREE.AmbientLight(0xffffff, 2.0));
// const sun = new THREE.DirectionalLight(0xffffff, 2.0);
// sun.position.set(2, 4, 2);
// scene.add(sun);

// const statusEl = document.getElementById("status");
// if (statusEl) statusEl.style.display = "none";

// const arBtn = ARButton.createButton(renderer, {
//   requiredFeatures: ["hit-test"],
//   optionalFeatures: ["dom-overlay"],
//   domOverlay: { root: document.body },
// });
// arBtn.id = "ARButton";
// arBtn.style.cssText =
//   "position:fixed;bottom:-9999px;left:-9999px;opacity:0;pointer-events:none;width:1px;height:1px;";
// document.body.appendChild(arBtn);

// // ─── DOM ─────────────────────────────────────────────────────
// const startScreen = document.createElement("div");
// startScreen.id = "start-screen";
// startScreen.innerHTML = `
//  <img
//     id="start-logo"
//     src="/ar_logo.png"
//     alt="CasaDeco AR"
//   />
//   <h1>CasaDeco AR</h1>
//   <p>Visualise furniture in your space</p>
//   <button id="btn-start-ar">Start AR Experience</button>`;
// document.body.appendChild(startScreen);

// document
//   .getElementById("btn-start-ar")
//   .addEventListener("click", () => arBtn.click());

// const fontLink = document.createElement("link");
// fontLink.rel = "stylesheet";
// fontLink.href =
//   "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:wght@500;600&display=swap";
// document.head.appendChild(fontLink);

// // ─── CSS ─────────────────────────────────────────────────────
// const style = document.createElement("style");
// style.textContent = `
//   :root {
//     --sand:#EDE8DF;--ink:#18181A;--muted:#9A9590;
//     --gold:#C9A96E;--gold-glow:rgba(201,169,110,0.35);
//     --red:#D95F5F;--green:#5BAD8A;
//     --glass-dark:rgba(18,18,20,0.82);--glass-mid:rgba(18,18,20,0.58);
//     --glass-light:rgba(255,255,255,0.07);
//     --blur:blur(24px);
//     --f-body:'DM Sans',sans-serif;--f-display:'Cormorant Garamond',serif;
//   }
//   *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}

//   #start-screen{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#0e0e10;z-index:1000;}
//   #start-screen h1{font-family:var(--f-display);font-size:32px;font-weight:600;color:var(--sand);letter-spacing:0.02em;margin:0;}
//   #start-screen p{font-family:var(--f-body);font-size:13px;color:var(--muted);margin:0;}
//   #start-logo {
//     width: 180px;
//     height: 180px;
//     object-fit: contain;
//     margin-bottom: 8px;
//     /* subtle fade-in */
//     animation: logoIn 0.8s ease both;
//   }
//   @keyframes logoIn {
//     from { opacity: 0; transform: scale(0.88); }
//     to   { opacity: 1; transform: scale(1); }
//   }
//   #btn-start-ar{margin-top:8px;padding:14px 40px;background:var(--gold);color:var(--ink);font-family:var(--f-body);font-size:14px;font-weight:600;letter-spacing:0.04em;border:none;border-radius:50px;cursor:pointer;box-shadow:0 8px 32px var(--gold-glow);transition:transform 0.15s;}
//   #btn-start-ar:active{transform:scale(0.95);}

//   #ui-top{position:fixed;top:0;left:0;right:0;height:66px;display:none;align-items:center;justify-content:space-between;padding:0 20px;background:var(--glass-dark);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border-bottom:1px solid rgba(255,255,255,0.06);z-index:500;}
//   #ui-top.on{display:flex;}
//   #top-left{display:flex;flex-direction:column;gap:1px;}
//   #top-name{font-family:var(--f-display);font-size:19px;font-weight:600;color:var(--sand);letter-spacing:0.01em;}
//   #top-status{font-family:var(--f-body);font-size:11px;color:var(--muted);letter-spacing:0.05em;text-transform:uppercase;}
//   #btn-stop{padding:8px 18px;background:rgba(217,95,95,0.18);border:1px solid rgba(217,95,95,0.35);border-radius:50px;color:#E07070;font-family:var(--f-body);font-size:12px;font-weight:500;cursor:pointer;transition:background 0.15s;backdrop-filter:var(--blur);}
//   #btn-stop:active{background:rgba(217,95,95,0.32);}

//   .s-ring{position:fixed;top:50%;left:50%;border:1.5px solid var(--gold);border-radius:50%;pointer-events:none;z-index:300;opacity:0;transition:opacity 0.4s;transform:translate(-50%,-56%);}
//   .s-ring.on{animation:sPulse 2s ease-in-out infinite;}
//   #sr1{width:160px;height:80px;}
//   #sr2{width:220px;height:110px;animation-delay:0.35s;}
//   #sr1.on{opacity:0.65;}#sr2.on{opacity:0.28;}
//   @keyframes sPulse{0%,100%{transform:translate(-50%,-56%) scale(1);}50%{transform:translate(-50%,-56%) scale(1.07);}}

//   #hint-pill{position:fixed;top:78px;left:50%;transform:translateX(-50%);font-family:var(--f-body);font-size:12px;font-weight:500;color:rgba(255,255,255,0.9);background:var(--glass-mid);backdrop-filter:var(--blur);padding:6px 16px;border-radius:50px;border:1px solid rgba(255,255,255,0.08);z-index:500;pointer-events:none;white-space:nowrap;opacity:0;transition:opacity 0.25s;}
//   #hint-pill.on{opacity:1;}

//   #move-banner{position:fixed;bottom:230px;left:50%;transform:translateX(-50%);font-family:var(--f-body);font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink);background:var(--gold);padding:6px 20px;border-radius:50px;z-index:500;pointer-events:none;display:none;white-space:nowrap;box-shadow:0 4px 20px var(--gold-glow);}

//   /* ── Bottom panel ── */
//   #ui-bottom {
//     position: fixed; bottom: 0; left: 0; right: 0;
//     display: none; flex-direction: column; gap: 12px;
//     background: var(--glass-dark);
//     backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
//     border-top: 1px solid rgba(255,255,255,0.07);
//     border-radius: 22px 22px 0 0;
//     padding: 0 22px 44px;
//     z-index: 500;
//     /* smooth open/close */
//     transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
//     transform: translateY(0);
//   }
//   #ui-bottom.on { display: flex; }
//   /* collapsed: slide down so only the handle tab peeks out */
//   #ui-bottom.collapsed { transform: translateY(calc(100% - 36px)); }

//   /* ── Toggle tab — always visible when panel is open ── */
//   #panel-toggle {
//     display: flex; align-items: center; justify-content: center;
//     width: 100%; padding: 10px 0 6px; cursor: pointer;
//     /* extends the tap area without adding height to the panel */
//     margin-bottom: 2px;
//   }
//   /* Animated chevron pill */
//   #panel-toggle-inner {
//     display: flex; flex-direction: column; align-items: center; gap: 3px;
//   }
//   #drag-handle {
//     width: 34px; height: 3px;
//     background: rgba(255,255,255,0.25);
//     border-radius: 2px;
//     transition: background 0.2s;
//   }
//   #panel-toggle:active #drag-handle { background: rgba(255,255,255,0.55); }

//   /* chevron arrow */
//   #toggle-chevron {
//     width: 0; height: 0;
//     border-left: 5px solid transparent;
//     border-right: 5px solid transparent;
//     border-bottom: 5px solid rgba(255,255,255,0.35);
//     transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.2s;
//     /* default: pointing UP (panel open → tap to close) */
//     transform: rotate(0deg);
//   }
//   /* when collapsed: chevron points DOWN (tap to open) */
//   #ui-bottom.collapsed #toggle-chevron {
//     transform: rotate(180deg);
//   }

//   /* hide inner content when collapsed so it can't be tapped */
//   #ui-bottom.collapsed #panel-content { visibility: hidden; }

//   .sec-label{font-family:var(--f-body);font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}

//   #chip-rail{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding:2px 0;}
//   #chip-rail::-webkit-scrollbar{display:none;}

//   .p-chip{flex-shrink:0;display:flex;align-items:center;gap:10px;padding:9px 16px 9px 9px;background:var(--glass-light);border:1.5px solid rgba(255,255,255,0.08);border-radius:14px;cursor:pointer;transition:border-color 0.2s,background 0.2s;min-width:160px;max-width:220px;}
//   .p-chip.active{border-color:var(--gold);background:rgba(201,169,110,0.12);}
//   .p-chip:active{opacity:0.6;}
//   .p-thumb{width:44px;height:44px;flex-shrink:0;background:rgba(255,255,255,0.06);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;overflow:hidden;}
//   .p-thumb img{width:44px;height:44px;object-fit:cover;border-radius:10px;display:block;}
//   .p-info{display:flex;align-items:center;min-width:0;}
//   .p-name{font-family:var(--f-body);font-size:13px;font-weight:500;color:var(--sand);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;}

//   #act-row{display:flex;align-items:center;justify-content:center;gap:14px;}
//   .a-btn{border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.12s,opacity 0.12s;}
//   .a-btn:active{transform:scale(0.82);opacity:0.7;}

//   #a-rot-l,#a-rot-r{width:48px;height:48px;border-radius:50%;background:var(--glass-light);border:1.5px solid rgba(201,169,110,0.35);transition:background 0.15s,border-color 0.15s,transform 0.12s,opacity 0.12s;}
//   #a-rot-l.spinning,#a-rot-r.spinning{background:rgba(201,169,110,0.18);border-color:rgba(201,169,110,0.7);}
//   #a-rot-l.dim,#a-rot-r.dim{opacity:0.25;pointer-events:none;}

//   #a-undo{width:52px;height:52px;border-radius:50%;background:var(--glass-light);border:1px solid rgba(255,255,255,0.1);}
//   #a-place{width:70px;height:70px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 8px rgba(201,169,110,0.15),0 8px 28px var(--gold-glow);}
//   #a-place.s-move{background:#E8B84B;box-shadow:0 0 0 8px rgba(232,184,75,0.15),0 8px 28px rgba(232,184,75,0.4);}
//   #a-place.s-ok{background:var(--green);box-shadow:0 0 0 8px rgba(91,173,138,0.18),0 8px 28px rgba(91,173,138,0.38);animation:pop 0.3s cubic-bezier(0.34,1.56,0.64,1);}
//   #ARButton{display:none!important;visibility:hidden!important;pointer-events:none!important;}
//   @keyframes pop{from{transform:scale(0.82);}to{transform:scale(1);}}
//   #a-del{width:52px;height:52px;border-radius:50%;background:rgba(217,95,95,0.13);border:1px solid rgba(217,95,95,0.25);}

//   #rot-label{position:fixed;bottom:200px;right:20px;font-family:var(--f-body);font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--sand);background:var(--glass-mid);backdrop-filter:var(--blur);padding:5px 14px;border-radius:50px;border:1px solid rgba(201,169,110,0.25);z-index:500;pointer-events:none;opacity:0;transition:opacity 0.2s;white-space:nowrap;}
//   #rot-label.on{opacity:1;}

//   @keyframes slideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
// `;
// document.head.appendChild(style);

// // ─── Top bar ─────────────────────────────────────────────────
// const uiTop = document.createElement("div");
// uiTop.id = "ui-top";
// uiTop.innerHTML = `
//   <div id="top-left">
//     <div id="top-name">CasaDeco</div>
//     <div id="top-status">Scanning…</div>
//   </div>
//   <button id="btn-stop">Stop AR</button>`;
// document.body.appendChild(uiTop);

// ["sr1", "sr2"].forEach((id) => {
//   const el = document.createElement("div");
//   el.id = id;
//   el.className = "s-ring";
//   document.body.appendChild(el);
// });

// const hintPill = document.createElement("div");
// hintPill.id = "hint-pill";
// document.body.appendChild(hintPill);

// const moveBanner = document.createElement("div");
// moveBanner.id = "move-banner";
// moveBanner.textContent = "Move phone · tap ✓ to lock position";
// document.body.appendChild(moveBanner);

// const rotLabel = document.createElement("div");
// rotLabel.id = "rot-label";
// document.body.appendChild(rotLabel);

// // ─── Bottom bar ───────────────────────────────────────────────
// const uiBottom = document.createElement("div");
// uiBottom.id = "ui-bottom";
// uiBottom.innerHTML = `
//   <!-- Tap anywhere on this strip to toggle the panel -->
//   <div id="panel-toggle">
//     <div id="panel-toggle-inner">
//       <div id="drag-handle"></div>
//       <div id="toggle-chevron"></div>
//     </div>
//   </div>

//   <!-- Everything below here is hidden when collapsed -->
//   <div id="panel-content">
//     <div style="padding-top:4px">
//       <div class="sec-label">Products</div>
//       <div id="chip-rail"></div>
//     </div>
//     <div id="act-row">
//       <button class="a-btn dim" id="a-rot-l" title="Rotate left">
//         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
//           <path d="M2.5 12a9.5 9.5 0 1 1 1.8 5.6"/><polyline points="2 17 2.5 12 7.5 13.5"/>
//         </svg>
//       </button>
//       <button class="a-btn" id="a-undo">
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//           <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
//         </svg>
//       </button>
//       <button class="a-btn" id="a-place">
//         <svg id="ico-aim" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round">
//           <circle cx="12" cy="12" r="2.2"/>
//           <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
//           <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
//         </svg>
//         <svg id="ico-check" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" style="display:none">
//           <polyline points="20 6 9 17 4 12"/>
//         </svg>
//         <svg id="ico-move" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
//           <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/>
//           <line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>
//         </svg>
//       </button>
//       <button class="a-btn" id="a-del">
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D95F5F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//           <polyline points="3 6 5 6 21 6"/>
//           <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
//         </svg>
//       </button>
//       <button class="a-btn dim" id="a-rot-r" title="Rotate right">
//         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
//           <path d="M21.5 12a9.5 9.5 0 1 0-1.8 5.6"/><polyline points="22 17 21.5 12 16.5 13.5"/>
//         </svg>
//       </button>
//     </div>
//   </div>
// `;
// document.body.appendChild(uiBottom);

// // ─── Panel toggle logic ───────────────────────────────────────
// let panelCollapsed = false;

// document.getElementById("panel-toggle").addEventListener("click", () => {
//   panelCollapsed = !panelCollapsed;
//   uiBottom.classList.toggle("collapsed", panelCollapsed);
// });

// // ─── Refs ─────────────────────────────────────────────────────
// const topStatus = document.getElementById("top-status");
// const btnStop = document.getElementById("btn-stop");
// const chipRail = document.getElementById("chip-rail");
// const aPlace = document.getElementById("a-place");
// const aUndo = document.getElementById("a-undo");
// const aDel = document.getElementById("a-del");
// const aRotL = document.getElementById("a-rot-l");
// const aRotR = document.getElementById("a-rot-r");
// const icoAim = document.getElementById("ico-aim");
// const icoCheck = document.getElementById("ico-check");
// const icoMove = document.getElementById("ico-move");
// const sr1 = document.getElementById("sr1");
// const sr2 = document.getElementById("sr2");

// // ─── Reticle ─────────────────────────────────────────────────
// const reticle = new THREE.Mesh(
//   new THREE.RingGeometry(0.1, 0.14, 32).rotateX(-Math.PI / 2),
//   new THREE.MeshBasicMaterial({
//     color: 0xc9a96e,
//     side: THREE.DoubleSide,
//     transparent: true,
//     opacity: 0.85,
//   }),
// );
// reticle.matrixAutoUpdate = false;
// reticle.visible = false;
// scene.add(reticle);

// // ─── Products ────────────────────────────────────────────────
// const urlParams = new URLSearchParams(window.location.search);

// function getCategoryEmoji(category) {
//   if (!category) return "🛋️";
//   const map = {
//     seating: "🪑",
//     chair: "🪑",
//     chaise: "🪑",
//     sofa: "🛋️",
//     canapé: "🛋️",
//     couch: "🛋️",
//     table: "🪵",
//     desk: "🖥️",
//     bed: "🛏️",
//     storage: "🗄️",
//     lamp: "💡",
//     shelf: "📚",
//   };
//   const lower = category.toLowerCase();
//   for (const [key, emoji] of Object.entries(map)) {
//     if (lower.includes(key)) return emoji;
//   }
//   return "🛋️";
// }

// let products = [];
// try {
//   const productsParam = urlParams.get("products");
//   if (productsParam) {
//     const parsed = JSON.parse(decodeURIComponent(productsParam));
//     products = parsed.map((p, i) => ({
//       id: p.id || `p${i}`,
//       name: p.name || "Product",
//       cat: p.category || "",
//       emoji: getCategoryEmoji(p.category),
//       url: p.modelUrl,
//       imageUrl: p.imageUrl || null,
//     }));
//   }
// } catch (e) {
//   console.warn("Could not parse products param", e);
// }

// if (products.length === 0) {
//   const modelParam = urlParams.get("model") || "/models/chaise.glb";
//   products = [
//     {
//       id: "p1",
//       name: "Chair",
//       cat: "Seating",
//       emoji: "🪑",
//       url: modelParam,
//       imageUrl: null,
//     },
//   ];
// }

// const initialModelUrl = urlParams.get("model");
// let activeProductId = products[0].id;
// if (initialModelUrl) {
//   const match = products.find(
//     (p) => p.url === decodeURIComponent(initialModelUrl),
//   );
//   if (match) activeProductId = match.id;
// }

// // ─── State ───────────────────────────────────────────────────
// let hitTestSource = null,
//   hitTestSourceRequested = false;
// const floorPos = new THREE.Vector3();
// let floorFound = false;
// let appMode = "idle";
// let previewObj = null,
//   selectedObj = null;
// const placedList = [];
// let gltfScene = null,
//   modelScale = 1,
//   modelLift = 0;

// const userRotations = new WeakMap();
// const frozenRotations = new WeakMap();

// const ROT_STEP = Math.PI / 12;
// const ROT_SPEED = Math.PI / 60;
// let rotInterval = null;

// // ─── Positioning ─────────────────────────────────────────────
// function faceCameraY(objPos, camPos) {
//   return Math.atan2(camPos.x - objPos.x, camPos.z - objPos.z);
// }

// function positionObject(obj, camPos) {
//   obj.position.set(floorPos.x, floorPos.y + modelLift, floorPos.z);
//   const baseAngle = faceCameraY(obj.position, camPos);
//   const userDelta = userRotations.get(obj) ?? 0;
//   obj.rotation.set(0, baseAngle + userDelta, 0);
// }

// // ─── Rotation UI ─────────────────────────────────────────────
// function activeRotTarget() {
//   if (appMode === "previewing" && previewObj) return previewObj;
//   if (appMode === "selected" && selectedObj) return selectedObj;
//   return null;
// }

// function updateRotUI() {
//   const target = activeRotTarget();
//   if (!target) {
//     aRotL.classList.add("dim");
//     aRotR.classList.add("dim");
//     rotLabel.classList.remove("on");
//     return;
//   }
//   aRotL.classList.remove("dim");
//   aRotR.classList.remove("dim");
//   const deg = Math.round(
//     (((userRotations.get(target) ?? 0) * 180) / Math.PI + 3600) % 360,
//   );
//   rotLabel.textContent = `${deg}°`;
//   rotLabel.classList.add("on");
// }

// function rotate(delta) {
//   const target = activeRotTarget();
//   if (!target) return;
//   userRotations.set(target, (userRotations.get(target) ?? 0) + delta);
//   updateRotUI();
// }

// function startSpin(dir, btn) {
//   if (rotInterval) return;
//   btn.classList.add("spinning");
//   rotInterval = setInterval(() => rotate(dir * ROT_SPEED), 16);
// }
// function stopSpin() {
//   if (rotInterval) {
//     clearInterval(rotInterval);
//     rotInterval = null;
//   }
//   aRotL.classList.remove("spinning");
//   aRotR.classList.remove("spinning");
// }

// function wireRotBtn(btn, dir) {
//   btn.addEventListener(
//     "touchstart",
//     (e) => {
//       e.preventDefault();
//       rotate(dir * ROT_STEP);
//       startSpin(dir, btn);
//     },
//     { passive: false },
//   );
//   btn.addEventListener("touchend", stopSpin, { passive: true });
//   btn.addEventListener("touchcancel", stopSpin, { passive: true });
//   btn.addEventListener("mousedown", () => {
//     rotate(dir * ROT_STEP);
//     startSpin(dir, btn);
//   });
//   btn.addEventListener("mouseup", stopSpin);
//   btn.addEventListener("mouseleave", stopSpin);
// }
// wireRotBtn(aRotL, -1);
// wireRotBtn(aRotR, +1);

// // ─── General UI ───────────────────────────────────────────────
// function setPlaceIcon(s) {
//   icoAim.style.display = s === "aim" ? "" : "none";
//   icoCheck.style.display = s === "check" ? "" : "none";
//   icoMove.style.display = s === "move" ? "" : "none";
//   aPlace.classList.remove("s-move", "s-ok");
//   if (s === "move") aPlace.classList.add("s-move");
//   if (s === "check") aPlace.classList.add("s-ok");
// }
// function setHint(txt) {
//   hintPill.textContent = txt || "";
//   hintPill.classList.toggle("on", !!txt);
// }
// function setScan(on) {
//   sr1.classList.toggle("on", on);
//   sr2.classList.toggle("on", on);
// }

// // ─── Chip rail ────────────────────────────────────────────────
// function buildRail() {
//   chipRail.innerHTML = "";
//   products.forEach((p) => {
//     const c = document.createElement("div");
//     c.className = "p-chip" + (p.id === activeProductId ? " active" : "");
//     const thumb = document.createElement("div");
//     thumb.className = "p-thumb";
//     if (p.imageUrl) {
//       const img = document.createElement("img");
//       img.crossOrigin = "anonymous";
//       img.src = p.imageUrl;
//       img.alt = p.name;
//       img.onerror = () => {
//         thumb.innerHTML = "";
//         thumb.textContent = p.emoji;
//       };
//       thumb.appendChild(img);
//     } else {
//       thumb.textContent = p.emoji;
//     }
//     const nameEl = document.createElement("div");
//     nameEl.className = "p-name";
//     nameEl.textContent = p.name;
//     const info = document.createElement("div");
//     info.className = "p-info";
//     info.appendChild(nameEl);
//     c.appendChild(thumb);
//     c.appendChild(info);
//     c.addEventListener("click", () => {
//       activeProductId = p.id;
//       document
//         .querySelectorAll(".p-chip")
//         .forEach((x) => x.classList.remove("active"));
//       c.classList.add("active");
//       loadModel(p.url);
//     });
//     chipRail.appendChild(c);
//   });
// }

// // ─── Load model ───────────────────────────────────────────────
// function loadModel(url) {
//   if (previewObj) {
//     scene.remove(previewObj);
//     previewObj = null;
//   }
//   gltfScene = null;
//   appMode = "idle";
//   topStatus.textContent = "Loading…";
//   setHint(null);
//   updateRotUI();

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
//       const nativeHeight = size.y;
//       if (nativeHeight < 0.01) modelScale = 1.0 / nativeHeight;
//       else if (nativeHeight > 10) modelScale = 0.01;
//       else modelScale = 1.0;
//       modelLift = -box.min.y * modelScale;
//       gltfScene = gltf.scene;
//       startPreview();
//     },
//     undefined,
//     (err) => console.error(err),
//   );
// }

// function startPreview() {
//   if (previewObj) scene.remove(previewObj);
//   const g = new THREE.Group();
//   g.add(gltfScene.clone(true));
//   g.scale.setScalar(modelScale);
//   g.visible = false;
//   scene.add(g);
//   previewObj = g;
//   userRotations.set(g, 0);
//   appMode = "previewing";
//   setPlaceIcon("aim");
//   setScan(true);
//   topStatus.textContent = "Scanning surface…";
//   setHint(null);
//   moveBanner.style.display = "none";
//   updateRotUI();
//   // auto-expand panel when a new model is loaded
//   if (panelCollapsed) {
//     panelCollapsed = false;
//     uiBottom.classList.remove("collapsed");
//   }
// }

// function doConfirm() {
//   if (appMode === "previewing" && previewObj && floorFound) {
//     frozenRotations.set(previewObj, previewObj.rotation.y);
//     placedList.push(previewObj);
//     previewObj = null;
//     appMode = "idle";
//     moveBanner.style.display = "none";
//     setPlaceIcon("check");
//     topStatus.textContent = "Placed!";
//     setHint("Tap ↺ to undo · hold ⟳ to rotate · tap ✦ to move");
//     updateRotUI();
//     setTimeout(() => {
//       setPlaceIcon("aim");
//       setHint(null);
//       topStatus.textContent = "Tap a product to place another";
//       setScan(false);
//     }, 2000);
//   } else if (appMode === "selected" && selectedObj && floorFound) {
//     frozenRotations.set(selectedObj, selectedObj.rotation.y);
//     selectedObj = null;
//     appMode = "idle";
//     moveBanner.style.display = "none";
//     setPlaceIcon("check");
//     topStatus.textContent = "Position locked";
//     updateRotUI();
//     setTimeout(() => {
//       setPlaceIcon("aim");
//       topStatus.textContent = "Ready";
//     }, 1200);
//   }
// }

// // ─── XR session ───────────────────────────────────────────────
// renderer.xr.addEventListener("sessionstart", () => {
//   const arBtnEl = document.getElementById("ARButton");
//   if (arBtnEl) arBtnEl.remove();
//   startScreen.style.display = "none";
//   uiTop.classList.add("on");
//   uiBottom.classList.add("on");
//   // always start expanded
//   panelCollapsed = false;
//   uiBottom.classList.remove("collapsed");
//   buildRail();
//   loadModel(products.find((p) => p.id === activeProductId).url);

//   const session = renderer.xr.getSession();
//   const raycaster = new THREE.Raycaster();

//   session.addEventListener("select", () => {
//     if (appMode === "previewing") {
//       doConfirm();
//       return;
//     }
//     if (appMode === "selected") {
//       doConfirm();
//       return;
//     }
//     if (appMode === "idle" && placedList.length > 0) {
//       const xrCamera = renderer.xr.getCamera();
//       raycaster.setFromCamera({ x: 0, y: 0 }, xrCamera);
//       const targets = [];
//       placedList.forEach((obj) =>
//         obj.traverse((child) => {
//           if (child.isMesh) targets.push(child);
//         }),
//       );
//       const hits = raycaster.intersectObjects(targets, false);
//       if (hits.length > 0) {
//         const hitMesh = hits[0].object;
//         const hitObj = placedList.find((obj) => {
//           let f = false;
//           obj.traverse((c) => {
//             if (c === hitMesh) f = true;
//           });
//           return f;
//         });
//         if (hitObj) {
//           selectedObj = hitObj;
//           appMode = "selected";
//           moveBanner.style.display = "block";
//           setPlaceIcon("move");
//           topStatus.textContent = "Moving item";
//           updateRotUI();
//         }
//       }
//     }
//   });

//   aPlace.addEventListener("click", () => {
//     if (appMode === "previewing" || appMode === "selected") {
//       doConfirm();
//     } else if (appMode === "idle" && placedList.length > 0) {
//       selectedObj = placedList[placedList.length - 1];
//       appMode = "selected";
//       moveBanner.style.display = "block";
//       setPlaceIcon("move");
//       topStatus.textContent = "Moving item";
//       updateRotUI();
//     }
//   });

//   aUndo.addEventListener("click", () => {
//     stopSpin();
//     if (appMode === "selected" && selectedObj) {
//       const i = placedList.indexOf(selectedObj);
//       if (i !== -1) placedList.splice(i, 1);
//       scene.remove(selectedObj);
//       selectedObj = null;
//       appMode = "idle";
//       moveBanner.style.display = "none";
//       setPlaceIcon("aim");
//       setHint(null);
//       topStatus.textContent = "Removed";
//       updateRotUI();
//       setTimeout(() => (topStatus.textContent = "Ready"), 1200);
//     } else if (placedList.length > 0) {
//       scene.remove(placedList.pop());
//       topStatus.textContent = "Removed";
//       setTimeout(() => (topStatus.textContent = "Ready"), 1200);
//     }
//     if (previewObj) {
//       scene.remove(previewObj);
//       previewObj = null;
//       appMode = "idle";
//       setScan(false);
//       updateRotUI();
//     }
//   });

//   aDel.addEventListener("click", () => {
//     stopSpin();
//     placedList.forEach((o) => scene.remove(o));
//     placedList.length = 0;
//     if (previewObj) {
//       scene.remove(previewObj);
//       previewObj = null;
//     }
//     selectedObj = null;
//     appMode = "idle";
//     moveBanner.style.display = "none";
//     setPlaceIcon("aim");
//     setHint(null);
//     setScan(false);
//     topStatus.textContent = "Cleared";
//     updateRotUI();
//     setTimeout(() => (topStatus.textContent = "Tap a product to place"), 1200);
//   });

//   btnStop.addEventListener("click", () => {
//     stopSpin();
//     session.end();
//   });

//   session.addEventListener("end", () => {
//     stopSpin();
//     uiTop.classList.remove("on");
//     uiBottom.classList.remove("on");
//     panelCollapsed = false;
//     setScan(false);
//     moveBanner.style.display = "none";
//     rotLabel.classList.remove("on");
//     setHint(null);
//     startScreen.style.display = "flex";
//     hitTestSource = null;
//     hitTestSourceRequested = false;
//     floorFound = false;
//   });
// });

// // Flutter bridge
// window.setModel = (url) => {
//   const p = products.find((x) => x.url === url);
//   if (p) {
//     activeProductId = p.id;
//     buildRail();
//   }
//   loadModel(url);
// };
// window.removeLastObject = () => aUndo.click();
// window.clearAll = () => aDel.click();

// // ─── Render loop ─────────────────────────────────────────────
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
//         floorPos.set(m[12], m[13], m[14]);
//         floorFound = true;

//         const camPos = new THREE.Vector3();
//         renderer.xr.getCamera().getWorldPosition(camPos);

//         if (appMode === "previewing" && previewObj) {
//           previewObj.visible = true;
//           positionObject(previewObj, camPos);
//           setScan(false);
//           topStatus.textContent = "Tap ✓ to place";
//         }

//         if (appMode === "selected" && selectedObj) {
//           positionObject(selectedObj, camPos);
//         }
//       } else {
//         reticle.visible = false;
//         floorFound = false;
//         if (appMode === "previewing") {
//           setScan(true);
//           topStatus.textContent = "Scanning surface…";
//         }
//       }

//       placedList.forEach((obj) => {
//         if (obj !== selectedObj) {
//           obj.rotation.y = frozenRotations.get(obj) ?? 0;
//         }
//       });
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
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true, // required for toDataURL()
});
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

const arBtn = ARButton.createButton(renderer, {
  requiredFeatures: ["hit-test"],
  optionalFeatures: ["dom-overlay"],
  domOverlay: { root: document.body },
});
arBtn.id = "ARButton";
arBtn.style.cssText =
  "position:fixed;bottom:-9999px;left:-9999px;opacity:0;pointer-events:none;width:1px;height:1px;";
document.body.appendChild(arBtn);

// ─── DOM ─────────────────────────────────────────────────────
const startScreen = document.createElement("div");
startScreen.id = "start-screen";
startScreen.innerHTML = `
  <img id="start-logo" src="/ar_logo.png" alt="CasaDeco AR" />
  <h1>CasaDeco AR</h1>
  <p>Visualise furniture in your space</p>
  <button id="btn-start-ar">Start AR Experience</button>`;
document.body.appendChild(startScreen);
document
  .getElementById("btn-start-ar")
  .addEventListener("click", () => arBtn.click());

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:wght@500;600&display=swap";
document.head.appendChild(fontLink);

// ─── CSS ─────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  :root {
    --sand:#EDE8DF;--ink:#18181A;--muted:#9A9590;
    --gold:#C9A96E;--gold-glow:rgba(201,169,110,0.35);
    --red:#D95F5F;--green:#5BAD8A;
    --glass-dark:rgba(18,18,20,0.82);--glass-mid:rgba(18,18,20,0.58);
    --glass-light:rgba(255,255,255,0.07);
    --blur:blur(24px);
    --f-body:'DM Sans',sans-serif;--f-display:'Cormorant Garamond',serif;
  }
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}

  #start-screen{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#0e0e10;z-index:1000;}
  #start-screen h1{font-family:var(--f-display);font-size:32px;font-weight:600;color:var(--sand);letter-spacing:0.02em;margin:0;}
  #start-screen p{font-family:var(--f-body);font-size:13px;color:var(--muted);margin:0;}
  #start-logo{width:180px;height:180px;object-fit:contain;margin-bottom:8px;animation:logoIn 0.8s ease both;}
  @keyframes logoIn{from{opacity:0;transform:scale(0.88);}to{opacity:1;transform:scale(1);}}
  #btn-start-ar{margin-top:8px;padding:14px 40px;background:var(--gold);color:var(--ink);font-family:var(--f-body);font-size:14px;font-weight:600;letter-spacing:0.04em;border:none;border-radius:50px;cursor:pointer;box-shadow:0 8px 32px var(--gold-glow);transition:transform 0.15s;}
  #btn-start-ar:active{transform:scale(0.95);}

  #ui-top{position:fixed;top:0;left:0;right:0;height:66px;display:none;align-items:center;justify-content:space-between;padding:0 20px;background:var(--glass-dark);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border-bottom:1px solid rgba(255,255,255,0.06);z-index:500;}
  #ui-top.on{display:flex;}
  #top-left{display:flex;flex-direction:column;gap:1px;}
  #top-name{font-family:var(--f-display);font-size:19px;font-weight:600;color:var(--sand);letter-spacing:0.01em;}
  #top-status{font-family:var(--f-body);font-size:11px;color:var(--muted);letter-spacing:0.05em;text-transform:uppercase;}
  #btn-stop{padding:8px 18px;background:rgba(217,95,95,0.18);border:1px solid rgba(217,95,95,0.35);border-radius:50px;color:#E07070;font-family:var(--f-body);font-size:12px;font-weight:500;cursor:pointer;transition:background 0.15s;backdrop-filter:var(--blur);}
  #btn-stop:active{background:rgba(217,95,95,0.32);}

  /* ── Screenshot button ── */
  #btn-screenshot {
    position: fixed; top: 78px; right: 16px;
    width: 46px; height: 46px; border-radius: 50%;
    background: var(--glass-dark); backdrop-filter: var(--blur);
    border: 1.5px solid rgba(201,169,110,0.5);
    display: none; align-items: center; justify-content: center;
    cursor: pointer; z-index: 500;
    transition: background 0.15s, transform 0.12s, border-color 0.15s;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  }
  #btn-screenshot.on { display: flex; }
  #btn-screenshot:active { transform: scale(0.82); background: rgba(201,169,110,0.18); }

  /* Shutter flash */
  #shutter-flash {
    position: fixed; inset: 0; background: #fff;
    opacity: 0; pointer-events: none; z-index: 9000;
    transition: opacity 0.06s ease-out;
  }
  #shutter-flash.fire { opacity: 1; }

  /* ── Toast ── */
  #shot-toast {
    position: fixed; bottom: 120px; left: 50%; transform: translateX(-50%);
    font-family: var(--f-body); font-size: 13px; font-weight: 600;
    padding: 10px 22px; border-radius: 50px;
    z-index: 9001; pointer-events: none;
    opacity: 0; white-space: nowrap;
    transition: opacity 0.3s;
  }
  #shot-toast.ok  { color: var(--ink); background: var(--gold); box-shadow: 0 4px 20px var(--gold-glow); opacity: 1; }
  #shot-toast.err { color: #fff; background: var(--red); opacity: 1; }

  /* ── iOS save overlay ── */
  #ios-save-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.82);
    display: none; flex-direction: column; align-items: center; justify-content: flex-end;
    padding-bottom: 40px; z-index: 9500;
  }
  #ios-save-overlay.on { display: flex; }
  #ios-save-box {
    width: 88%; background: #1c1c1e; border-radius: 20px;
    padding: 0; overflow: hidden;
  }
  #ios-save-img {
    width: 100%; max-height: 260px; object-fit: contain;
    background: #000; display: block; border-radius: 0;
  }
  #ios-save-actions {
    display: flex; flex-direction: column; gap: 0;
  }
  .ios-action-btn {
    width: 100%; padding: 16px; border: none; background: none;
    font-family: var(--f-body); font-size: 15px; font-weight: 500;
    color: var(--gold); cursor: pointer; border-top: 1px solid rgba(255,255,255,0.08);
    transition: background 0.15s;
  }
  .ios-action-btn:active { background: rgba(255,255,255,0.06); }
  .ios-action-btn.cancel { color: var(--red); font-weight: 600; }
  #ios-save-hint {
    font-family: var(--f-body); font-size: 11px; color: var(--muted);
    padding: 10px 16px 4px; text-align: center;
  }

  .s-ring{position:fixed;top:50%;left:50%;border:1.5px solid var(--gold);border-radius:50%;pointer-events:none;z-index:300;opacity:0;transition:opacity 0.4s;transform:translate(-50%,-56%);}
  .s-ring.on{animation:sPulse 2s ease-in-out infinite;}
  #sr1{width:160px;height:80px;}
  #sr2{width:220px;height:110px;animation-delay:0.35s;}
  #sr1.on{opacity:0.65;}#sr2.on{opacity:0.28;}
  @keyframes sPulse{0%,100%{transform:translate(-50%,-56%) scale(1);}50%{transform:translate(-50%,-56%) scale(1.07);}}

  #hint-pill{position:fixed;top:78px;left:50%;transform:translateX(-50%);font-family:var(--f-body);font-size:12px;font-weight:500;color:rgba(255,255,255,0.9);background:var(--glass-mid);backdrop-filter:var(--blur);padding:6px 16px;border-radius:50px;border:1px solid rgba(255,255,255,0.08);z-index:500;pointer-events:none;white-space:nowrap;opacity:0;transition:opacity 0.25s;}
  #hint-pill.on{opacity:1;}

  #move-banner{position:fixed;bottom:230px;left:50%;transform:translateX(-50%);font-family:var(--f-body);font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink);background:var(--gold);padding:6px 20px;border-radius:50px;z-index:500;pointer-events:none;display:none;white-space:nowrap;box-shadow:0 4px 20px var(--gold-glow);}

  #ui-bottom{position:fixed;bottom:0;left:0;right:0;display:none;flex-direction:column;gap:12px;background:var(--glass-dark);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border-top:1px solid rgba(255,255,255,0.07);border-radius:22px 22px 0 0;padding:0 22px 44px;z-index:500;transition:transform 0.35s cubic-bezier(0.16,1,0.3,1);transform:translateY(0);}
  #ui-bottom.on{display:flex;}
  #ui-bottom.collapsed{transform:translateY(calc(100% - 36px));}

  #panel-toggle{display:flex;align-items:center;justify-content:center;width:100%;padding:10px 0 6px;cursor:pointer;margin-bottom:2px;}
  #panel-toggle-inner{display:flex;flex-direction:column;align-items:center;gap:3px;}
  #drag-handle{width:34px;height:3px;background:rgba(255,255,255,0.25);border-radius:2px;transition:background 0.2s;}
  #panel-toggle:active #drag-handle{background:rgba(255,255,255,0.55);}
  #toggle-chevron{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:5px solid rgba(255,255,255,0.35);transition:transform 0.35s cubic-bezier(0.16,1,0.3,1);transform:rotate(0deg);}
  #ui-bottom.collapsed #toggle-chevron{transform:rotate(180deg);}
  #ui-bottom.collapsed #panel-content{visibility:hidden;}

  .sec-label{font-family:var(--f-body);font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}
  #chip-rail{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding:2px 0;}
  #chip-rail::-webkit-scrollbar{display:none;}

  .p-chip{flex-shrink:0;display:flex;align-items:center;gap:10px;padding:9px 16px 9px 9px;background:var(--glass-light);border:1.5px solid rgba(255,255,255,0.08);border-radius:14px;cursor:pointer;transition:border-color 0.2s,background 0.2s;min-width:160px;max-width:220px;}
  .p-chip.active{border-color:var(--gold);background:rgba(201,169,110,0.12);}
  .p-chip:active{opacity:0.6;}
  .p-thumb{width:44px;height:44px;flex-shrink:0;background:rgba(255,255,255,0.06);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;overflow:hidden;}
  .p-thumb img{width:44px;height:44px;object-fit:cover;border-radius:10px;display:block;}
  .p-info{display:flex;align-items:center;min-width:0;}
  .p-name{font-family:var(--f-body);font-size:13px;font-weight:500;color:var(--sand);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;}

  #act-row{display:flex;align-items:center;justify-content:center;gap:14px;}
  .a-btn{border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.12s,opacity 0.12s;}
  .a-btn:active{transform:scale(0.82);opacity:0.7;}
  #a-rot-l,#a-rot-r{width:48px;height:48px;border-radius:50%;background:var(--glass-light);border:1.5px solid rgba(201,169,110,0.35);transition:background 0.15s,border-color 0.15s,transform 0.12s,opacity 0.12s;}
  #a-rot-l.spinning,#a-rot-r.spinning{background:rgba(201,169,110,0.18);border-color:rgba(201,169,110,0.7);}
  #a-rot-l.dim,#a-rot-r.dim{opacity:0.25;pointer-events:none;}
  #a-undo{width:52px;height:52px;border-radius:50%;background:var(--glass-light);border:1px solid rgba(255,255,255,0.1);}
  #a-place{width:70px;height:70px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 8px rgba(201,169,110,0.15),0 8px 28px var(--gold-glow);}
  #a-place.s-move{background:#E8B84B;box-shadow:0 0 0 8px rgba(232,184,75,0.15),0 8px 28px rgba(232,184,75,0.4);}
  #a-place.s-ok{background:var(--green);box-shadow:0 0 0 8px rgba(91,173,138,0.18),0 8px 28px rgba(91,173,138,0.38);animation:pop 0.3s cubic-bezier(0.34,1.56,0.64,1);}
  #ARButton{display:none!important;visibility:hidden!important;pointer-events:none!important;}
  @keyframes pop{from{transform:scale(0.82);}to{transform:scale(1);}}
  #a-del{width:52px;height:52px;border-radius:50%;background:rgba(217,95,95,0.13);border:1px solid rgba(217,95,95,0.25);}

  #rot-label{position:fixed;bottom:200px;right:20px;font-family:var(--f-body);font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--sand);background:var(--glass-mid);backdrop-filter:var(--blur);padding:5px 14px;border-radius:50px;border:1px solid rgba(201,169,110,0.25);z-index:500;pointer-events:none;opacity:0;transition:opacity 0.2s;white-space:nowrap;}
  #rot-label.on{opacity:1;}
  @keyframes slideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
`;
document.head.appendChild(style);

// ─── Top bar ─────────────────────────────────────────────────
const uiTop = document.createElement("div");
uiTop.id = "ui-top";
uiTop.innerHTML = `
  <div id="top-left">
    <div id="top-name">CasaDeco</div>
    <div id="top-status">Scanning…</div>
  </div>
  <button id="btn-stop">Stop AR</button>`;
document.body.appendChild(uiTop);

["sr1", "sr2"].forEach((id) => {
  const el = document.createElement("div");
  el.id = id;
  el.className = "s-ring";
  document.body.appendChild(el);
});

const hintPill = document.createElement("div");
hintPill.id = "hint-pill";
document.body.appendChild(hintPill);
const moveBanner = document.createElement("div");
moveBanner.id = "move-banner";
moveBanner.textContent = "Move phone · tap ✓ to lock position";
document.body.appendChild(moveBanner);
const rotLabel = document.createElement("div");
rotLabel.id = "rot-label";
document.body.appendChild(rotLabel);

// ── Screenshot button ─────────────────────────────────────────
const btnScreenshot = document.createElement("button");
btnScreenshot.id = "btn-screenshot";
btnScreenshot.title = "Save screenshot";
btnScreenshot.innerHTML = `
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
       stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>`;
document.body.appendChild(btnScreenshot);

// ── Shutter flash ─────────────────────────────────────────────
const shutterFlash = document.createElement("div");
shutterFlash.id = "shutter-flash";
document.body.appendChild(shutterFlash);

// ── Toast ─────────────────────────────────────────────────────
const shotToast = document.createElement("div");
shotToast.id = "shot-toast";
document.body.appendChild(shotToast);
let toastTimer = null;
function showToast(msg, type = "ok") {
  shotToast.textContent = msg;
  shotToast.className = type;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    shotToast.className = "";
  }, 3000);
}

// ── iOS save overlay ──────────────────────────────────────────
// On iOS, <a download> is ignored and Web Share opens social apps.
// Instead we show a full-screen image preview with a long-press hint,
// plus an "Open image" button that opens the dataURL in a new tab
// where the user can long-press → Save to Photos.
const iosSaveOverlay = document.createElement("div");
iosSaveOverlay.id = "ios-save-overlay";
iosSaveOverlay.innerHTML = `
  <div id="ios-save-box">
    <img id="ios-save-img" src="" alt="Screenshot preview" />
    <div id="ios-save-hint">Long-press the image above → "Save to Photos"</div>
    <div id="ios-save-actions">
      <button class="ios-action-btn" id="ios-open-btn">Open image in new tab → Save to Photos</button>
      <button class="ios-action-btn cancel" id="ios-cancel-btn">Cancel</button>
    </div>
  </div>`;
document.body.appendChild(iosSaveOverlay);

document.getElementById("ios-cancel-btn").addEventListener("click", () => {
  iosSaveOverlay.classList.remove("on");
});

// ── Detect platform ───────────────────────────────────────────
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isAndroid = /Android/.test(navigator.userAgent);

// ── Core screenshot function ──────────────────────────────────
async function takeScreenshot() {
  // Render a fresh frame so the buffer has latest pixels
  renderer.render(scene, camera);

  const canvas = renderer.domElement;
  const dataUrl = canvas.toDataURL("image/png");

  // Shutter flash
  shutterFlash.classList.add("fire");
  setTimeout(() => shutterFlash.classList.remove("fire"), 200);

  if (isIOS) {
    // ── iOS: show preview overlay with long-press + open-in-tab option ──
    const imgEl = document.getElementById("ios-save-img");
    imgEl.src = dataUrl;
    iosSaveOverlay.classList.add("on");

    document.getElementById("ios-open-btn").onclick = () => {
      window.open(dataUrl, "_blank");
      iosSaveOverlay.classList.remove("on");
      showToast("Long-press the image → Save to Photos", "ok");
    };
    return;
  }

  // ── Android / desktop: direct download ───────────────────────
  // On Android Chrome this lands in Downloads which is visible
  // in the Gallery app under the "Downloads" album.
  try {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `casadeco_ar_${Date.now()}.png`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("📸 Saved to Downloads / Gallery!", "ok");
  } catch (e) {
    showToast("Could not save image", "err");
    console.error("Screenshot error:", e);
  }
}

btnScreenshot.addEventListener("click", takeScreenshot);

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
      <button class="a-btn dim" id="a-rot-l" title="Rotate left">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2.5 12a9.5 9.5 0 1 1 1.8 5.6"/><polyline points="2 17 2.5 12 7.5 13.5"/>
        </svg>
      </button>
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
      <button class="a-btn dim" id="a-rot-r" title="Rotate right">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 12a9.5 9.5 0 1 0-1.8 5.6"/><polyline points="22 17 21.5 12 16.5 13.5"/>
        </svg>
      </button>
    </div>
  </div>`;
document.body.appendChild(uiBottom);

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
const aRotL = document.getElementById("a-rot-l");
const aRotR = document.getElementById("a-rot-r");
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

const userRotations = new WeakMap();
const frozenRotations = new WeakMap();
const ROT_STEP = Math.PI / 12,
  ROT_SPEED = Math.PI / 60;
let rotInterval = null;

function faceCameraY(objPos, camPos) {
  return Math.atan2(camPos.x - objPos.x, camPos.z - objPos.z);
}
function positionObject(obj, camPos) {
  obj.position.set(floorPos.x, floorPos.y + modelLift, floorPos.z);
  obj.rotation.set(
    0,
    faceCameraY(obj.position, camPos) + (userRotations.get(obj) ?? 0),
    0,
  );
}

function activeRotTarget() {
  if (appMode === "previewing" && previewObj) return previewObj;
  if (appMode === "selected" && selectedObj) return selectedObj;
  return null;
}
function updateRotUI() {
  const t = activeRotTarget();
  if (!t) {
    aRotL.classList.add("dim");
    aRotR.classList.add("dim");
    rotLabel.classList.remove("on");
    return;
  }
  aRotL.classList.remove("dim");
  aRotR.classList.remove("dim");
  rotLabel.textContent = `${Math.round((((userRotations.get(t) ?? 0) * 180) / Math.PI + 3600) % 360)}°`;
  rotLabel.classList.add("on");
}
function rotate(delta) {
  const t = activeRotTarget();
  if (!t) return;
  userRotations.set(t, (userRotations.get(t) ?? 0) + delta);
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

function loadModel(url) {
  if (previewObj) {
    scene.remove(previewObj);
    previewObj = null;
  }
  gltfScene = null;
  appMode = "idle";
  topStatus.textContent = "Loading…";
  setHint(null);
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
      const h = size.y;
      if (h < 0.01) modelScale = 1 / h;
      else if (h > 10) modelScale = 0.01;
      else modelScale = 1;
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
  setScan(true);
  topStatus.textContent = "Scanning surface…";
  setHint(null);
  moveBanner.style.display = "none";
  updateRotUI();
  if (panelCollapsed) {
    panelCollapsed = false;
    uiBottom.classList.remove("collapsed");
  }
}

function doConfirm() {
  if (appMode === "previewing" && previewObj && floorFound) {
    frozenRotations.set(previewObj, previewObj.rotation.y);
    placedList.push(previewObj);
    previewObj = null;
    appMode = "idle";
    moveBanner.style.display = "none";
    setPlaceIcon("check");
    topStatus.textContent = "Placed!";
    setHint("Tap 📷 to save a photo of your room");
    updateRotUI();
    setTimeout(() => {
      setPlaceIcon("aim");
      setHint(null);
      topStatus.textContent = "Tap a product to place another";
      setScan(false);
    }, 2500);
  } else if (appMode === "selected" && selectedObj && floorFound) {
    frozenRotations.set(selectedObj, selectedObj.rotation.y);
    selectedObj = null;
    appMode = "idle";
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

renderer.xr.addEventListener("sessionstart", () => {
  const arBtnEl = document.getElementById("ARButton");
  if (arBtnEl) arBtnEl.remove();
  startScreen.style.display = "none";
  uiTop.classList.add("on");
  uiBottom.classList.add("on");
  btnScreenshot.classList.add("on");
  panelCollapsed = false;
  uiBottom.classList.remove("collapsed");
  buildRail();
  loadModel(products.find((p) => p.id === activeProductId).url);

  const session = renderer.xr.getSession();
  const raycaster = new THREE.Raycaster();

  session.addEventListener("select", () => {
    if (appMode === "previewing") {
      doConfirm();
      return;
    }
    if (appMode === "selected") {
      doConfirm();
      return;
    }
    if (appMode === "idle" && placedList.length > 0) {
      const xrCam = renderer.xr.getCamera();
      raycaster.setFromCamera({ x: 0, y: 0 }, xrCam);
      const targets = [];
      placedList.forEach((obj) =>
        obj.traverse((c) => {
          if (c.isMesh) targets.push(c);
        }),
      );
      const hits = raycaster.intersectObjects(targets, false);
      if (hits.length > 0) {
        const hm = hits[0].object;
        const ho = placedList.find((obj) => {
          let f = false;
          obj.traverse((c) => {
            if (c === hm) f = true;
          });
          return f;
        });
        if (ho) {
          selectedObj = ho;
          appMode = "selected";
          moveBanner.style.display = "block";
          setPlaceIcon("move");
          topStatus.textContent = "Moving item";
          updateRotUI();
        }
      }
    }
  });

  aPlace.addEventListener("click", () => {
    if (appMode === "previewing" || appMode === "selected") {
      doConfirm();
    } else if (appMode === "idle" && placedList.length > 0) {
      selectedObj = placedList[placedList.length - 1];
      appMode = "selected";
      moveBanner.style.display = "block";
      setPlaceIcon("move");
      topStatus.textContent = "Moving item";
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
      setScan(false);
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
    moveBanner.style.display = "none";
    setPlaceIcon("aim");
    setHint(null);
    setScan(false);
    topStatus.textContent = "Cleared";
    updateRotUI();
    setTimeout(() => (topStatus.textContent = "Tap a product to place"), 1200);
  });

  btnStop.addEventListener("click", () => {
    stopSpin();
    session.end();
  });

  session.addEventListener("end", () => {
    stopSpin();
    uiTop.classList.remove("on");
    uiBottom.classList.remove("on");
    btnScreenshot.classList.remove("on");
    panelCollapsed = false;
    setScan(false);
    moveBanner.style.display = "none";
    rotLabel.classList.remove("on");
    setHint(null);
    startScreen.style.display = "flex";
    hitTestSource = null;
    hitTestSourceRequested = false;
    floorFound = false;
  });
});

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

renderer.setAnimationLoop((_, frame) => {
  if (frame) {
    const refSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();
    if (!hitTestSourceRequested) {
      session.requestReferenceSpace("viewer").then((vs) =>
        session.requestHitTestSource({ space: vs }).then((src) => {
          hitTestSource = src;
        }),
      );
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
          positionObject(previewObj, camPos);
          setScan(false);
          topStatus.textContent = "Tap ✓ to place";
        }
        if (appMode === "selected" && selectedObj) {
          positionObject(selectedObj, camPos);
        }
      } else {
        reticle.visible = false;
        floorFound = false;
        if (appMode === "previewing") {
          setScan(true);
          topStatus.textContent = "Scanning surface…";
        }
      }
      placedList.forEach((obj) => {
        if (obj !== selectedObj) {
          obj.rotation.y = frozenRotations.get(obj) ?? 0;
        }
      });
    }
  }
  renderer.render(scene, camera);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

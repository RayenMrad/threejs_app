import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ARButton } from "three/addons/webxr/ARButton.js";

// ─────────────────────────────────────────
// SCENE SETUP
// ─────────────────────────────────────────

const scene = new THREE.Scene();

// Camera — WebXR will control this automatically
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  20,
);

// Renderer — must have xr: true and alpha: true for AR
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true; // ← This enables WebXR
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 2, 1);
scene.add(directionalLight);

// ─────────────────────────────────────────
// STATUS HELPER
// ─────────────────────────────────────────

const statusEl = document.getElementById("status");
function setStatus(msg) {
  statusEl.textContent = msg;
  console.log(msg);
}

// ─────────────────────────────────────────
// AR BUTTON — triggers camera permission + WebXR session
// ─────────────────────────────────────────

const arButton = ARButton.createButton(renderer, {
  requiredFeatures: ["hit-test"], // ← needed for surface detection
  optionalFeatures: ["dom-overlay"],
  domOverlay: { root: document.body },
});
document.body.appendChild(arButton);
setStatus('Tap "Start AR" to begin');

// ─────────────────────────────────────────
// HIT TESTING — detects real surfaces (floor, table)
// ─────────────────────────────────────────

let hitTestSource = null;
let hitTestSourceRequested = false;

// Reticle = the ring that shows WHERE you'll place the object
const reticleGeometry = new THREE.RingGeometry(0.08, 0.1, 32).rotateX(
  -Math.PI / 2,
);
const reticleMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

// ─────────────────────────────────────────
// MODEL LOADING
// ─────────────────────────────────────────

const loader = new GLTFLoader();
let currentModelUrl = "/models/chaise.glb"; // default model

const urlParams = new URLSearchParams(window.location.search);
const modelParam = urlParams.get("model");
if (modelParam) {
  currentModelUrl = modelParam;
  setStatus("Model ready — tap floor to place!");
}

let placedObjects = []; // keeps track of everything placed in AR

function loadModel(url, callback) {
  setStatus("Loading model...");
  loader.load(
    url,
    (gltf) => {
      setStatus("Model ready — tap to place!");
      callback(gltf.scene);
    },
    (progress) => {
      const pct = Math.round((progress.loaded / progress.total) * 100);
      setStatus(`Loading ${pct}%`);
    },
    (error) => {
      setStatus("Error loading model");
      console.error(error);
    },
  );
}

// ─────────────────────────────────────────
// PLACING OBJECTS ON TAP
// ─────────────────────────────────────────

renderer.domElement.addEventListener("click", () => {
  if (reticle.visible) {
    // Clone the model at the reticle's position
    loadModel(currentModelUrl, (model) => {
      model.position.setFromMatrixPosition(reticle.matrix);
      model.scale.set(0.3, 0.3, 0.3); // adjust size here
      scene.add(model);
      placedObjects.push(model);
      setStatus("Placed! Tap again to add more.");
    });
  }
});

// ─────────────────────────────────────────
// JS BRIDGE — Flutter will call these functions
// This is how Flutter communicates with Three.js
// ─────────────────────────────────────────

// Flutter calls this to change which model to show
window.setModel = function (url) {
  currentModelUrl = url;
  setStatus("New model selected — tap floor to place!");
};

// Flutter calls this to remove the last placed object
window.removeLastObject = function () {
  if (placedObjects.length > 0) {
    const obj = placedObjects.pop();
    scene.remove(obj);
    setStatus("Object removed");
  }
};

// Flutter calls this to clear everything
window.clearAll = function () {
  placedObjects.forEach((obj) => scene.remove(obj));
  placedObjects = [];
  setStatus("All cleared");
};

// ─────────────────────────────────────────
// MAIN RENDER LOOP
// ─────────────────────────────────────────

renderer.setAnimationLoop((timestamp, frame) => {
  if (frame) {
    // Surface detection (hit testing)
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (!hitTestSourceRequested) {
      session.requestReferenceSpace("viewer").then((refSpace) => {
        session.requestHitTestSource({ space: refSpace }).then((source) => {
          hitTestSource = source;
        });
      });
      session.addEventListener("end", () => {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });
      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      const results = frame.getHitTestResults(hitTestSource);
      if (results.length > 0) {
        const hit = results[0];
        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
      } else {
        reticle.visible = false;
      }
    }
  }

  renderer.render(scene, camera);
});

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

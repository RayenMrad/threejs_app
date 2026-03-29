import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ARButton } from "three/addons/webxr/ARButton.js";

// ─────────────────────────────────────────
// SCENE SETUP
// ─────────────────────────────────────────

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  20,
);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
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
// AR BUTTON
// ─────────────────────────────────────────

const arButton = ARButton.createButton(renderer, {
  requiredFeatures: ["hit-test"],
  optionalFeatures: ["dom-overlay"],
  domOverlay: { root: document.body },
});
document.body.appendChild(arButton);
setStatus('Tap "Start AR" to begin');

// ─────────────────────────────────────────
// HIT TESTING
// ─────────────────────────────────────────

let hitTestSource = null;
let hitTestSourceRequested = false;

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
// MODEL LOADING WITH AUTO-SCALE
// ─────────────────────────────────────────

const loader = new GLTFLoader();
let currentModelUrl = "/models/chaise.glb";

const urlParams = new URLSearchParams(window.location.search);
const modelParam = urlParams.get("model");
if (modelParam) {
  currentModelUrl = modelParam;
  setStatus("Model ready — tap floor to place!");
}

let placedObjects = [];

// Automatically scale model to fit within a target real-world size
function autoScale(model, targetSizeMeters = 0.6) {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);

  // Find the largest dimension
  const maxDim = Math.max(size.x, size.y, size.z);

  // Scale so the largest dimension equals targetSizeMeters
  const scale = targetSizeMeters / maxDim;
  model.scale.set(scale, scale, scale);

  // Re-calculate bounding box after scaling and center the model on the floor
  const scaledBox = new THREE.Box3().setFromObject(model);
  const scaledSize = new THREE.Vector3();
  scaledBox.getSize(scaledSize);

  // Shift model up so its bottom sits on the floor (y=0)
  model.position.y -= scaledBox.min.y;
}

function loadModel(url, callback) {
  setStatus("Loading model...");
  loader.load(
    url,
    (gltf) => {
      setStatus("Model ready — tap to place!");
      const model = gltf.scene;
      autoScale(model, 0.6); // 0.6 meters tall — adjust this value as needed
      callback(model);
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
    loadModel(currentModelUrl, (model) => {
      // Place at reticle position (already floor-aligned by autoScale)
      const position = new THREE.Vector3();
      position.setFromMatrixPosition(reticle.matrix);
      model.position.x = position.x;
      model.position.z = position.z;
      // model.position.y is already set by autoScale to sit on floor

      scene.add(model);
      placedObjects.push(model);
      setStatus("Placed! Tap again to add more.");
    });
  }
});

// ─────────────────────────────────────────
// JS BRIDGE — Flutter calls these
// ─────────────────────────────────────────

window.setModel = function (url) {
  currentModelUrl = url;
  setStatus("New model selected — tap floor to place!");
};

window.removeLastObject = function () {
  if (placedObjects.length > 0) {
    const obj = placedObjects.pop();
    scene.remove(obj);
    setStatus("Object removed");
  }
};

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

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

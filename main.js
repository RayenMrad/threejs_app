import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ARButton } from "three/addons/webxr/ARButton.js";

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

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(1, 3, 2);
scene.add(directionalLight);

const statusEl = document.getElementById("status");
function setStatus(msg) {
  statusEl.textContent = msg;
}

const arButton = ARButton.createButton(renderer, {
  requiredFeatures: ["hit-test"],
  optionalFeatures: ["dom-overlay"],
  domOverlay: { root: document.body },
});
document.body.appendChild(arButton);
setStatus('Tap "Start AR" to begin');

// ── Reticle ──────────────────────────────
let hitTestSource = null;
let hitTestSourceRequested = false;

const reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.08, 0.13, 32).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide }),
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

// ── Model ────────────────────────────────
const loader = new GLTFLoader();
let currentModelUrl = "/models/chaise.glb";

const urlParams = new URLSearchParams(window.location.search);
const modelParam = urlParams.get("model");
if (modelParam) currentModelUrl = modelParam;

let placedObjects = [];
let modelTemplate = null;
let floorOffset = 0;

function preloadModel(url) {
  setStatus("Loading model...");
  loader.load(
    url,
    (gltf) => {
      const model = gltf.scene;

      // ── Step 1: measure raw bounding box ──
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);

      console.log("Raw model size:", size, "maxDim:", maxDim);

      // ── Step 2: force scale to exactly 0.9m tall ──
      // This works regardless of whether the GLB is in cm, mm, or m
      const TARGET_HEIGHT_METERS = 0.9; // realistic chair height
      const scale = TARGET_HEIGHT_METERS / maxDim;
      model.scale.set(scale, scale, scale);

      console.log("Applied scale:", scale);

      // ── Step 3: measure bottom after scaling ──
      // Re-compute bounding box with the new scale applied
      model.updateMatrixWorld(true);
      const scaledBox = new THREE.Box3().setFromObject(model);
      // floorOffset = how much to raise model so its bottom sits at y=0
      floorOffset = -scaledBox.min.y;

      console.log("Floor offset:", floorOffset);

      modelTemplate = model;
      setStatus("Point camera at floor — tap to place!");
    },
    undefined,
    (error) => {
      setStatus("Error loading model");
      console.error(error);
    },
  );
}

preloadModel(currentModelUrl);

// ── Place on tap ─────────────────────────
renderer.domElement.addEventListener("click", () => {
  if (!reticle.visible || !modelTemplate) return;

  const clone = modelTemplate.clone(true);

  const reticlePos = new THREE.Vector3();
  reticlePos.setFromMatrixPosition(reticle.matrix);

  // Place at floor level — floorOffset lifts model so bottom = floor
  clone.position.set(reticlePos.x, reticlePos.y + floorOffset, reticlePos.z);

  // Face the model toward the camera
  const camPos = new THREE.Vector3();
  renderer.xr.getCamera().getWorldPosition(camPos);
  clone.lookAt(camPos.x, clone.position.y, camPos.z);

  scene.add(clone);
  placedObjects.push(clone);
  setStatus("Placed! Tap again to add more.");
});

// ── Flutter JS Bridge ────────────────────
window.setModel = function (url) {
  modelTemplate = null;
  floorOffset = 0;
  preloadModel(url);
};

window.removeLastObject = function () {
  if (placedObjects.length > 0) {
    scene.remove(placedObjects.pop());
    setStatus("Removed");
  }
};

window.clearAll = function () {
  placedObjects.forEach((o) => scene.remove(o));
  placedObjects = [];
  setStatus("Cleared");
};

// ── Render loop ──────────────────────────
renderer.setAnimationLoop((timestamp, frame) => {
  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (!hitTestSourceRequested) {
      session.requestReferenceSpace("viewer").then((refSpace) => {
        session.requestHitTestSource({ space: refSpace }).then((src) => {
          hitTestSource = src;
        });
      });
      session.addEventListener("end", () => {
        hitTestSourceRequested = false;
        hitTestSource = null;
        modelTemplate = null;
      });
      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      const results = frame.getHitTestResults(hitTestSource);
      if (results.length > 0) {
        reticle.visible = true;
        reticle.matrix.fromArray(
          results[0].getPose(referenceSpace).transform.matrix,
        );
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

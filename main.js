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

// ── Reticle ──────────────────────────────────────────
let hitTestSource = null;
let hitTestSourceRequested = false;

const reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.08, 0.13, 32).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide }),
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

// ── Model loading ────────────────────────────────────
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

      // Step 1: measure raw bounding box (no scale applied yet)
      const rawBox = new THREE.Box3().setFromObject(model);
      const rawSize = new THREE.Vector3();
      rawBox.getSize(rawSize);
      const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z);

      // Step 2: compute scale so the largest dimension = 0.9m (chair height)
      // Works for any unit (cm, mm, m) the GLB was exported in
      const TARGET = 0.9; // meters — realistic chair height
      const scale = TARGET / maxDim;

      // Step 3: apply scale
      model.scale.set(scale, scale, scale);

      // Step 4: force matrix update THEN measure floor
      model.updateMatrixWorld(true);
      const scaledBox = new THREE.Box3().setFromObject(model);
      floorOffset = -scaledBox.min.y; // lift so bottom = 0

      console.log(
        `GLB raw maxDim: ${maxDim}, scale applied: ${scale}, floorOffset: ${floorOffset}`,
      );

      modelTemplate = model;
      setStatus("Point at floor → tap to place");
    },
    undefined,
    (err) => {
      setStatus("Error loading model");
      console.error(err);
    },
  );
}

preloadModel(currentModelUrl);

// ── Place on tap ──────────────────────────────────────
renderer.domElement.addEventListener("click", () => {
  if (!reticle.visible || !modelTemplate) return;

  const clone = modelTemplate.clone(true);

  const reticlePos = new THREE.Vector3();
  reticlePos.setFromMatrixPosition(reticle.matrix);

  clone.position.set(reticlePos.x, reticlePos.y + floorOffset, reticlePos.z);

  // Face toward camera
  const camPos = new THREE.Vector3();
  renderer.xr.getCamera().getWorldPosition(camPos);
  clone.lookAt(camPos.x, clone.position.y, camPos.z);

  scene.add(clone);
  placedObjects.push(clone);
  setStatus("Placed! Tap again to add more.");
});

// ── Flutter JS Bridge ─────────────────────────────────
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

// ── Render loop ───────────────────────────────────────
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

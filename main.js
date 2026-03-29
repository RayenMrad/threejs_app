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

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 2, 1);
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

// Reticle
let hitTestSource = null;
let hitTestSourceRequested = false;

const reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

// Model
const loader = new GLTFLoader();
let currentModelUrl = "/models/chaise.glb";

const urlParams = new URLSearchParams(window.location.search);
const modelParam = urlParams.get("model");
if (modelParam) {
  currentModelUrl = modelParam;
}

let placedObjects = [];
let modelTemplate = null;
let floorOffset = 0;

function preloadModel(url) {
  setStatus("Loading model...");
  loader.load(
    url,
    (gltf) => {
      const model = gltf.scene;

      // Scale to 0.6m real-world height
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 0.6 / maxDim;
      model.scale.set(scale, scale, scale);

      // Measure bottom of model after scaling so we can sit it on the floor
      const scaledBox = new THREE.Box3().setFromObject(model);
      floorOffset = -scaledBox.min.y;

      modelTemplate = model;
      setStatus("Model ready — point at floor and tap!");
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

preloadModel(currentModelUrl);

// Place on tap
renderer.domElement.addEventListener("click", () => {
  if (reticle.visible && modelTemplate) {
    const clone = modelTemplate.clone(true);

    const position = new THREE.Vector3();
    position.setFromMatrixPosition(reticle.matrix);

    // y = reticle floor position + lift so bottom of model touches floor
    clone.position.set(position.x, position.y + floorOffset, position.z);

    scene.add(clone);
    placedObjects.push(clone);
    setStatus("Placed! Tap again to add more.");
  }
});

// JS Bridge for Flutter
window.setModel = function (url) {
  currentModelUrl = url;
  modelTemplate = null;
  floorOffset = 0;
  preloadModel(url);
};

window.removeLastObject = function () {
  if (placedObjects.length > 0) {
    scene.remove(placedObjects.pop());
    setStatus("Removed last object");
  }
};

window.clearAll = function () {
  placedObjects.forEach((obj) => scene.remove(obj));
  placedObjects = [];
  setStatus("All cleared");
};

// Render loop
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
        modelTemplate = null;
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

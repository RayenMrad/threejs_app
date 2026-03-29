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

scene.add(new THREE.AmbientLight(0xffffff, 2));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(3, 6, 4);
scene.add(dirLight);

const statusEl = document.getElementById("status");
const setStatus = (msg) => (statusEl.textContent = msg);

const arButton = ARButton.createButton(renderer, {
  requiredFeatures: ["hit-test"],
  optionalFeatures: ["dom-overlay"],
  domOverlay: { root: document.body },
});
document.body.appendChild(arButton);
setStatus('Tap "Start AR" to begin');

// ── Reticle ──────────────────────────────────────────────────
let hitTestSource = null;
let hitTestSourceRequested = false;

const reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.08, 0.13, 32).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide }),
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

// ── Model ────────────────────────────────────────────────────
const loader = new GLTFLoader();
let currentModelUrl = "/models/chaise.glb";

const urlParams = new URLSearchParams(window.location.search);
const modelParam = urlParams.get("model");
if (modelParam) currentModelUrl = modelParam;

let placedObjects = [];
let cachedGltf = null; // raw gltf result
let computedScale = 1;
let computedFloorOffset = 0;
const TARGET_HEIGHT = 0.9; // metres

function preloadModel(url) {
  setStatus("Loading...");
  cachedGltf = null;

  loader.load(
    url,
    (gltf) => {
      cachedGltf = gltf;

      // ── Measure raw size by wrapping in a Group at scale=1 ──
      const probe = new THREE.Group();
      probe.add(gltf.scene.clone(true));
      scene.add(probe);
      probe.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(probe);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);

      scene.remove(probe); // remove the probe, don't need it anymore

      computedScale = TARGET_HEIGHT / maxDim;

      // ── Measure floor offset at the computed scale ──
      const floorProbe = new THREE.Group();
      floorProbe.scale.setScalar(computedScale);
      floorProbe.add(gltf.scene.clone(true));
      scene.add(floorProbe);
      floorProbe.updateMatrixWorld(true);

      const scaledBox = new THREE.Box3().setFromObject(floorProbe);
      computedFloorOffset = -scaledBox.min.y;

      scene.remove(floorProbe);

      console.log(
        `maxDim=${maxDim.toFixed(3)}  scale=${computedScale.toFixed(6)}  floorOffset=${computedFloorOffset.toFixed(4)}`,
      );

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

// ── Place on tap ─────────────────────────────────────────────
renderer.domElement.addEventListener("click", () => {
  if (!reticle.visible || !cachedGltf) return;

  // Wrap fresh clone inside a Group — scale the GROUP, not the model
  const pivot = new THREE.Group();
  pivot.scale.setScalar(computedScale);
  pivot.add(cachedGltf.scene.clone(true));

  const reticlePos = new THREE.Vector3();
  reticlePos.setFromMatrixPosition(reticle.matrix);

  pivot.position.set(
    reticlePos.x,
    reticlePos.y + computedFloorOffset,
    reticlePos.z,
  );

  // Face toward camera
  const camPos = new THREE.Vector3();
  renderer.xr.getCamera().getWorldPosition(camPos);
  pivot.lookAt(camPos.x, pivot.position.y, camPos.z);

  scene.add(pivot);
  placedObjects.push(pivot);
  setStatus("Placed! Tap again to add more.");
});

// ── Flutter JS Bridge ─────────────────────────────────────────
window.setModel = (url) => preloadModel(url);
window.removeLastObject = () => {
  if (placedObjects.length) {
    scene.remove(placedObjects.pop());
    setStatus("Removed");
  }
};
window.clearAll = () => {
  placedObjects.forEach((o) => scene.remove(o));
  placedObjects = [];
  setStatus("Cleared");
};

// ── Render loop ───────────────────────────────────────────────
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
      session.addEventListener("end", () => {
        hitTestSourceRequested = false;
        hitTestSource = null;
        cachedGltf = null;
      });
      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      const hits = frame.getHitTestResults(hitTestSource);
      if (hits.length > 0) {
        reticle.visible = true;
        reticle.matrix.fromArray(hits[0].getPose(refSpace).transform.matrix);
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

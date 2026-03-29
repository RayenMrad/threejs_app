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

document.body.appendChild(
  ARButton.createButton(renderer, {
    requiredFeatures: ["hit-test"],
    optionalFeatures: ["dom-overlay"],
    domOverlay: { root: document.body },
  }),
);
setStatus('Tap "Start AR" to begin');

// ── Reticle ──────────────────────────────────────────────────
const reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.08, 0.13, 32).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide }),
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

// ── KEY FIX: store last hit position updated every frame ─────
const lastHitPosition = new THREE.Vector3();
let hasHit = false;

// ── Model ────────────────────────────────────────────────────
const loader = new GLTFLoader();
let currentModelUrl = "/models/chaise.glb";
const urlParams = new URLSearchParams(window.location.search);
const modelParam = urlParams.get("model");
if (modelParam) currentModelUrl = modelParam;

let placedObjects = [];
let cachedGltf = null;
let computedScale = 1;
let computedFloorOffset = 0;
const TARGET_HEIGHT = 0.9; // metres

function preloadModel(url) {
  setStatus("Loading...");
  cachedGltf = null;
  hasHit = false;

  loader.load(
    url,
    (gltf) => {
      cachedGltf = gltf;

      // Measure raw bounding box
      const tempMesh = gltf.scene.clone(true);
      const box = new THREE.Box3().setFromObject(tempMesh);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      computedScale = TARGET_HEIGHT / maxDim;

      // Measure floor offset at computed scale
      const floorGroup = new THREE.Group();
      floorGroup.scale.setScalar(computedScale);
      const tempMesh2 = gltf.scene.clone(true);
      floorGroup.add(tempMesh2);

      // Force matrix world update manually
      floorGroup.position.set(0, 0, 0);
      floorGroup.updateMatrix();
      floorGroup.updateMatrixWorld(true);

      const scaledBox = new THREE.Box3();
      // traverse and expand box manually to respect group scale
      floorGroup.traverse((child) => {
        if (child.isMesh) {
          child.geometry.computeBoundingBox();
          const geomBox = child.geometry.boundingBox.clone();
          geomBox.applyMatrix4(child.matrixWorld);
          scaledBox.union(geomBox);
        }
      });

      computedFloorOffset = scaledBox.isEmpty() ? 0 : -scaledBox.min.y;

      console.log(
        `maxDim=${maxDim.toFixed(3)} scale=${computedScale.toFixed(6)} floorOffset=${computedFloorOffset.toFixed(6)}`,
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

// ── Place on SELECT (controller button / screen tap in XR) ───
// Using renderer.xr session select event — fires INSIDE the XR frame
renderer.xr.addEventListener("sessionstart", () => {
  const session = renderer.xr.getSession();
  session.addEventListener("select", () => {
    if (!hasHit || !cachedGltf) return;

    const pivot = new THREE.Group();
    pivot.scale.setScalar(computedScale);
    pivot.add(cachedGltf.scene.clone(true));

    // Use lastHitPosition — updated every frame inside XR
    pivot.position.set(
      lastHitPosition.x,
      lastHitPosition.y + computedFloorOffset,
      lastHitPosition.z,
    );

    // Face toward camera
    const camPos = new THREE.Vector3();
    renderer.xr.getCamera().getWorldPosition(camPos);
    pivot.lookAt(camPos.x, pivot.position.y, camPos.z);

    scene.add(pivot);
    placedObjects.push(pivot);
    setStatus("Placed! Tap again to add more.");
  });
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
let hitTestSource = null;
let hitTestSourceRequested = false;

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
        hasHit = false;
      });
      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      const hits = frame.getHitTestResults(hitTestSource);
      if (hits.length > 0) {
        const pose = hits[0].getPose(refSpace);
        const m = pose.transform.matrix;

        // Update reticle
        reticle.visible = true;
        reticle.matrix.fromArray(m);

        // ── Store hit position every frame ──
        lastHitPosition.set(m[12], m[13], m[14]);
        hasHit = true;
      } else {
        reticle.visible = false;
        hasHit = false;
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

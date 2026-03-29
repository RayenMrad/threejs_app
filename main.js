import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ARButton } from "three/addons/webxr/ARButton.js";

// ─── Renderer ────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// ─── Scene & Camera ──────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  20,
);

// ─── Lighting ────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 2.0));
const sun = new THREE.DirectionalLight(0xffffff, 2.0);
sun.position.set(2, 4, 2);
scene.add(sun);

// ─── Status UI ───────────────────────────────────────────────
const statusEl = document.getElementById("status");
const setStatus = (msg) => {
  statusEl.textContent = msg;
};

// ─── AR Button ───────────────────────────────────────────────
document.body.appendChild(
  ARButton.createButton(renderer, {
    requiredFeatures: ["hit-test"],
    optionalFeatures: ["dom-overlay"],
    domOverlay: { root: document.body },
  }),
);

// ─── Reticle (placement ring on floor) ───────────────────────
const reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.1, 0.15, 32).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

// ─── Hit Test State ──────────────────────────────────────────
let hitTestSource = null;
let hitTestSourceRequested = false;

// Last confirmed floor hit — set every render frame
const floorPosition = new THREE.Vector3();
let floorFound = false;

// ─── Model State ─────────────────────────────────────────────
const loader = new GLTFLoader();
const placedObjects = [];

let gltfScene = null; // raw loaded scene (never scaled)
let modelScale = 1; // uniform scale to apply at placement
let modelLift = 0; // y offset so model bottom sits on floor

// Read ?model= param from URL
const modelUrl =
  new URLSearchParams(window.location.search).get("model") ||
  "/models/chaise.glb";

// ─── Load Model ───────────────────────────────────────────────
function loadModel(url) {
  gltfScene = null;
  floorFound = false;
  setStatus("Loading model...");

  loader.load(
    url,
    (gltf) => {
      // Work on a temporary clone to measure — never modify the original
      const probe = gltf.scene.clone(true);

      // Add to scene temporarily so matrixWorld gets computed correctly
      scene.add(probe);
      probe.updateMatrixWorld(true);

      // Get world-space bounding box
      const box = new THREE.Box3().setFromObject(probe);
      scene.remove(probe);

      const size = new THREE.Vector3();
      box.getSize(size);

      // Use Y (height) as the reference — chair should be ~0.9m tall
      const rawHeight = size.y;
      const TARGET = 0.9; // metres
      modelScale = TARGET / rawHeight;

      // Floor lift = distance from model origin to its bottom face, scaled
      // box.min.y is the lowest point in world space when the probe is at origin
      modelLift = -box.min.y * modelScale;

      // Store original for cloning at placement time
      gltfScene = gltf.scene;

      console.log(
        `size(raw): x=${size.x.toFixed(2)} y=${size.y.toFixed(2)} z=${size.z.toFixed(2)}`,
      );
      console.log(
        `scale: ${modelScale.toFixed(6)}  lift: ${modelLift.toFixed(4)}`,
      );

      setStatus("Move camera over floor, then tap");
    },
    undefined,
    (err) => {
      setStatus("Failed to load model");
      console.error(err);
    },
  );
}

loadModel(modelUrl);

// ─── Place Model (called from session "select" inside XR frame) ──
function placeModel() {
  if (!floorFound || !gltfScene) return;

  // Fresh clone each placement
  const clone = gltfScene.clone(true);

  // Wrap in a Group — this is the object we position/scale
  const group = new THREE.Group();
  group.add(clone);

  // Apply scale to the group
  group.scale.setScalar(modelScale);

  // Place on floor: x,z from hit test, y = floor y + lift
  group.position.set(
    floorPosition.x,
    floorPosition.y + modelLift,
    floorPosition.z,
  );

  // Rotate to face camera (horizontal only)
  const cam = renderer.xr.getCamera();
  const camWorld = new THREE.Vector3();
  cam.getWorldPosition(camWorld);
  group.lookAt(camWorld.x, group.position.y, camWorld.z);

  scene.add(group);
  placedObjects.push(group);
  setStatus("Placed! Tap floor again to add more.");
}

// ─── XR Session Events ────────────────────────────────────────
renderer.xr.addEventListener("sessionstart", () => {
  const session = renderer.xr.getSession();

  // "select" fires inside the XR frame — safe to use floorPosition here
  session.addEventListener("select", placeModel);

  session.addEventListener("end", () => {
    hitTestSource = null;
    hitTestSourceRequested = false;
    floorFound = false;
  });
});

// ─── Flutter JS Bridge ────────────────────────────────────────
window.setModel = (url) => loadModel(url);

window.removeLastObject = () => {
  if (placedObjects.length) {
    scene.remove(placedObjects.pop());
    setStatus("Removed last item");
  }
};

window.clearAll = () => {
  placedObjects.forEach((o) => scene.remove(o));
  placedObjects.length = 0;
  setStatus("Cleared");
};

// ─── Render Loop ─────────────────────────────────────────────
renderer.setAnimationLoop((_, frame) => {
  if (frame) {
    const refSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    // Request hit-test source once per session
    if (!hitTestSourceRequested) {
      session.requestReferenceSpace("viewer").then((viewerSpace) => {
        session.requestHitTestSource({ space: viewerSpace }).then((source) => {
          hitTestSource = source;
        });
      });
      hitTestSourceRequested = true;
    }

    // Update reticle + floor position every frame
    if (hitTestSource) {
      const hits = frame.getHitTestResults(hitTestSource);
      if (hits.length > 0) {
        const pose = hits[0].getPose(refSpace);
        const m = pose.transform.matrix;

        // Update reticle visual
        reticle.visible = true;
        reticle.matrix.fromArray(m);

        // Store floor position — column-major: translation is at [12],[13],[14]
        floorPosition.set(m[12], m[13], m[14]);
        floorFound = true;

        if (gltfScene) setStatus("Tap to place furniture");
      } else {
        reticle.visible = false;
        floorFound = false;
        if (gltfScene) setStatus("Move camera over floor...");
      }
    }
  }

  renderer.render(scene, camera);
});

// ─── Resize ───────────────────────────────────────────────────
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

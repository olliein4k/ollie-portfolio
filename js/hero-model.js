import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MODEL_PATH = '/assets/model.glb'; // ← update this to match your filename

function initHeroModel() {
  const container = document.getElementById('hero-model-container');
  if (!container) return;

  // ── Scene & camera ──
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 4);

  // ── Renderer (transparent background) ──
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // ── Wireframe material (matches your --c-blue) ──
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  });

  // ── Load model ──
  let model;
  const pivot = new THREE.Group();
  scene.add(pivot);
  const loader = new GLTFLoader();

  loader.load(
    MODEL_PATH,
    (gltf) => {
      model = gltf.scene;

      model.traverse((child) => {
        if (child.isMesh) {
          child.material = wireMat;
          child.material.needsUpdate = true;
        }
      });

      // Scale first
      const box    = new THREE.Box3().setFromObject(model);
      const size   = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      model.scale.setScalar(2.5 / maxDim);

      // Add to pivot and force matrix update BEFORE computing centre
      pivot.add(model);
      model.updateMatrixWorld(true);

      // Now the centre is accurate
      const scaledBox    = new THREE.Box3().setFromObject(model);
      const scaledCentre = scaledBox.getCenter(new THREE.Vector3());

      // Offset in pivot-local space
      model.position.sub(pivot.worldToLocal(scaledCentre));

      // Tilt the pivot
      pivot.rotation.z = 0.4;
    },
    undefined,
    (err) => console.error('Model load error:', err)
  );

  // ── Animation loop ──
  function animate() {
    requestAnimationFrame(animate);
    if (model) {
      pivot.rotation.y += 0.005; // spins the whole tilted group
    }
    renderer.render(scene, camera);
  }
  animate();

  // ── Handle resize ──
  new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }).observe(container);
}

initHeroModel();
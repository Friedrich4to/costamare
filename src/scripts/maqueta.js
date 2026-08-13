import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SparkRenderer, SplatMesh } from '@sparkjsdev/spark';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x181818);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(18.7, 15.1, 27);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
const isMobile = window.innerWidth < 768;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));

const spark = new SparkRenderer({
  renderer,
  ...(isMobile && { lodSplatScale: 0.5 }),
});
scene.add(spark);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(8.5, 1, -6);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 12;
controls.maxDistance = 50;

const loadingEl = document.querySelector('.loading-container');
const camX = document.querySelector('#cam-x');
const camY = document.querySelector('#cam-y');
const camZ = document.querySelector('#cam-z');
const tgtX = document.querySelector('#tgt-x');
const tgtY = document.querySelector('#tgt-y');
const tgtZ = document.querySelector('#tgt-z');

const splatMesh = new SplatMesh({
  url: '/hriv.sog',
  lod: true,
  ...(isMobile && { maxSplats: 500_000 }),
  onLoad: () => loadingEl?.classList.add('hidden'),
});
splatMesh.quaternion.set(1, 0, 0, 0);
splatMesh.position.set(0, 0, 0);
splatMesh.scale.set(1, 1, 1);
scene.add(splatMesh);

const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene.add(ambientLight);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1 : 2));
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  camX.textContent = `x: ${camera.position.x.toFixed(2)}`;
  camY.textContent = `y: ${camera.position.y.toFixed(2)}`;
  camZ.textContent = `z: ${camera.position.z.toFixed(2)}`;
  tgtX.textContent = `x: ${controls.target.x.toFixed(2)}`;
  tgtY.textContent = `y: ${controls.target.y.toFixed(2)}`;
  tgtZ.textContent = `z: ${controls.target.z.toFixed(2)}`;
}

animate();

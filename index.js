import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.body.style.backgroundImage = "url('assets/image.jpg')";

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

// Renderer centering
function centerRenderer() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
centerRenderer();
window.addEventListener('resize', centerRenderer);

document.body.appendChild(renderer.domElement);

// Image loading and processing
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const image = new Image();
image.src = 'assets/image.jpg';
image.onload = function () {
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);

  // Dynamic dimensions calculation
  const BOX_HEIGHT = 3;
  const SPINE_DEPTH = 0.25;
  const imageAspect = image.width / image.height;

  // Calculate front/back panel width based on image proportions
  const frontBackWidth = (3 * imageAspect - SPINE_DEPTH) / 2;
  const totalUnwrappedWidth = 2 * frontBackWidth + SPINE_DEPTH;

  // Texture parameters calculation
  const frontRepeatX = frontBackWidth / totalUnwrappedWidth;
  const spineRepeatX = SPINE_DEPTH / totalUnwrappedWidth;
  const frontOffsetX = (frontBackWidth + SPINE_DEPTH) / totalUnwrappedWidth;

  // Texture creation helper
  const createTexture = () => {
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Create textures with calculated parameters
  const frontTexture = createTexture();
  frontTexture.repeat.set(frontRepeatX, 1);
  frontTexture.offset.set(frontOffsetX, 1);

  const spineTexture = createTexture();
  spineTexture.repeat.set(spineRepeatX, 1);
  spineTexture.offset.set(frontRepeatX, 1);

  const backTexture = createTexture();
  backTexture.repeat.set(frontRepeatX, 1);

  // Create DVD box geometry with dynamic width
  const geometry = new THREE.BoxGeometry(frontBackWidth, BOX_HEIGHT, SPINE_DEPTH);
  const materials = [
    new THREE.MeshBasicMaterial({ color: '#0d0d0d' }),    // Left side
    new THREE.MeshBasicMaterial({ map: spineTexture }),   // Right side (spine)
    new THREE.MeshBasicMaterial({ color: '#0d0d0d' }),    // Top
    new THREE.MeshBasicMaterial({ color: '#0d0d0d' }),    // Bottom
    new THREE.MeshBasicMaterial({ map: frontTexture }),   // Front
    new THREE.MeshBasicMaterial({ map: backTexture })     // Back
  ];

  const dvdBox = new THREE.Mesh(geometry, materials);
  scene.add(dvdBox);
  camera.position.z = 4;

  // Controls setup
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.5;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
};
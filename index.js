import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.body.style.backgroundImage = "url('assets/image.jpg')";

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the texture which will be stretched across the left, front, and back sides of the 3D DVD box
const textureLoader = new THREE.TextureLoader();
const boxArtTextureFront = textureLoader.load('assets/image.jpg');
const boxArtTextureLeft = textureLoader.load('assets/image.jpg');
const boxArtTextureBack = textureLoader.load('assets/image.jpg');

boxArtTextureFront.wrapS = THREE.RepeatWrapping;
boxArtTextureFront.wrapT = THREE.RepeatWrapping;
boxArtTextureFront.repeat.set(0.47, 1);
boxArtTextureFront.offset.set(0.53, 1);

boxArtTextureLeft.wrapS = THREE.RepeatWrapping;
boxArtTextureLeft.wrapT = THREE.RepeatWrapping;
boxArtTextureLeft.repeat.set(0.055, 1);
boxArtTextureLeft.offset.set(0.475, 1);

boxArtTextureBack.wrapS = THREE.RepeatWrapping;
boxArtTextureBack.wrapT = THREE.RepeatWrapping;
boxArtTextureBack.repeat.set(0.47, 1);

// Create the DVD box geometry with the loaded textures
const geometry = new THREE.BoxGeometry(2, 3, 0.25);
const materials = [
  new THREE.MeshBasicMaterial({ color: '#0d0d0d' }),
  new THREE.MeshBasicMaterial({ map: boxArtTextureLeft }),
  new THREE.MeshBasicMaterial({ color: '#0d0d0d' }),
  new THREE.MeshBasicMaterial({ color: '#0d0d0d' }),
  new THREE.MeshBasicMaterial({ map: boxArtTextureFront }),
  new THREE.MeshBasicMaterial({ map: boxArtTextureBack })
];
const dvdBox = new THREE.Mesh(geometry, materials);

// Add the DVD box to the scene and position the camera
scene.add(dvdBox);
camera.position.z = 3;

// Enable mouse controls for the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 2;

// Animate the scene and handle mouse movement
function animate() {
  requestAnimationFrame(animate);

  // Update the camera controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
}
animate();
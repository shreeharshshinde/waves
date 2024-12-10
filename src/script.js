import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Debug
 */
const gui = new GUI();

/**
 * Canvas and Scene
 */
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load('./textures/particles/2.png');

/**
 * Particles
 */
// Geometry
const particleGeometery = new THREE.BufferGeometry();
const count = 10000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15; // Spread particles within a cube
    colors[i] = (Math.random() - 0.5);
}

particleGeometery.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometery.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Material
const particleMaterial = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
    // color: new THREE.Color('#ff88cc'),
    transparent: true,
    depthWrite: false, // Avoid writing depth buffer
    blending: THREE.AdditiveBlending,
    alphaMap: starTexture,
    vertexColors: true
});

// Points
const particles = new THREE.Points(particleGeometery, particleMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const updateSizes = () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera and renderer
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

window.addEventListener('resize', updateSizes);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5; // Provide better depth perspective
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animation
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Animate particles
    const positionArray = particleGeometery.attributes.position.array;
    for (let i = 0; i < count; i++) {
        const i3 = i * 3; // Index multiplier for x, y, z coordinates
        positionArray[i3 + 1] = Math.sin(elapsedTime + positionArray[i3]); // Add variation for each particle
    }
    particleGeometery.attributes.position.needsUpdate = true; // Notify WebGL of the position update

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    requestAnimationFrame(tick);
};

tick();

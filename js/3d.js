//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position for interaction
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object in a global variable for later access
let object;

//OrbitControls to allow the camera to move around the scene
let controls;

//Set which object to render (pillow in this case)
let objToRender = 'square_pillow';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the texture image
const textureLoader = new THREE.TextureLoader();
const pillowTexture = textureLoader.load('image/PersonilzedSquarePillow.png'); // Replace with your image path

//Update the pillow file
const updatePillow = () => {
    loader.load(
        `models/${objToRender}/scene.gltf`, // Change the path to your actual pillow model
        function (gltf) {
            // If the file is loaded, add it to the scene
            object = gltf.scene;

            // Traverse the object and change the material color
            object.traverse((child) => {
                if (child.isMesh) {

                    //child.material.map = pillowTexture; // Apply the texture to the material
                    //child.material.needsUpdate = true;  // Ensure material updates with the texture
                    // Change the material color to, for example, blue
                    child.material.color.set(new THREE.Color(0xffffFF)); // Set to white color
                }
            });

            scene.add(object);
        },
        function (xhr) {
            // While it is loading, log the progress
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            // If there is an error, log it
            console.error(error);
        }
    );
}



//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for a transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model (adjust for the pillow)
switch (objToRender)
{
    case 'square_pillow':
        camera.position.z = 100;
        break;
    case 'pillow':
        camera.position.z = 300; // Adjust the distance as needed
        break;
    case 'triangular_pillow':
        camera.position.z = 0.85;
        break;
    case 'circle_pillow':
        camera.position.z = 2;
        break;
    case 'cylinder_pillow':
        camera.position.z = 100;
        break;
}

//Add lights to the scene, so we can see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 2); // Adjust intensity for the pillow model
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
controls = new OrbitControls(camera, renderer.domElement);

//Render the scene and update interaction
function animate() {
    requestAnimationFrame(animate);

    // Optionally add automatic rotation for the pillow
    if (object) {
        object.rotation.y += 0.003; // Slowly rotate the pillow on the Y-axis
    }

    renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// Optionally add mouse movement interaction for zooming or rotating the pillow
document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Optionally update the pillow's rotation or scale based on the mouse position
};

//Load the pillow file
updatePillow();
//Start the 3D rendering
animate();

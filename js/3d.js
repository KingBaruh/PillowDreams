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
let objToRender = 'pillow';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

let selectedColor = 0xffffff;

let animationFrameId; // Variable to store the animation frame ID

// Load the texture image
const textureLoader = new THREE.TextureLoader();
let pillowTexture = textureLoader.load('image/white.png'); // Replace with your image path

// Function to update the pillow color
const updatePillowColor = (color) => {
    if (object) {
        object.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(new THREE.Color(color)); // Set the new color from the color picker
            }
        });
    }
};

//Update the pillow file
const setUpPillow = () => {
    loader.load(
        `models/${objToRender}/scene.gltf`, // Change the path to your actual pillow model
        function (gltf) {
            // If the file is loaded, add it to the scene
            object = gltf.scene;

            loadTexture();

            // Traverse the object and change the material color
            updatePillowColor(selectedColor);


            if(objToRender !== 'cylinder_pillow')
                object.rotation.set(0, 0, -20); // Set to origin

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
const loadTexture = () =>{
    object.traverse((child) =>
    {
        if (child.isMesh) {
            child.material.map = pillowTexture; // Apply the texture to the material
            child.material.needsUpdate = true;  // Ensure material updates with the textur
        }
    });
}

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for a transparent background
//renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

function updateCamera(){
//Set how far the camera will be from the 3D model (adjust for the pillow)
switch (objToRender)
{
    case 'square_pillow':
        camera.position.z = 120;
        break;
    case 'pillow':
        camera.position.z = 225; // Adjust the distance as needed
        break;
    case 'triangular_pillow':
        camera.position.z = 0.6;
        break;
    case 'circle_pillow':
        camera.position.z = 1.4;
        break;
    case 'cylinder_pillow':
        camera.position.z = 77;
        break;
}
}

//Add lights to the scene, so we can see the 3D model
/*
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); //top-left-ish
topLight.castShadow = true;
scene.add(topLight);
 */
// Add a new point light for more even lighting
const pointLight = new THREE.PointLight(0xffffff, 1, 500); // (color, intensity, distance)
pointLight.position.set(0, 300, 200); // Position the light above and in front of the pillow
scene.add(pointLight);

// Add another directional light to balance the lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Lower intensity to balance with other lights
directionalLight.position.set(-500, -500, -500); // Position it opposite to the top light
scene.add(directionalLight);

// Adjust the ambient light for softer overall lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Increase intensity slightly
scene.add(ambientLight);

/*
const ambientLight = new THREE.AmbientLight(0x333333, 2); // Adjust intensity for the pillow model
scene.add(ambientLight);
 */

//This adds controls to the camera, so we can rotate / zoom it with the mouse
controls = new OrbitControls(camera, renderer.domElement);

//Render the scene and update interaction
function animate() {
    animationFrameId = requestAnimationFrame(animate);

    // Optionally add automatic rotation for the pillow
    if (object) {
        object.rotation.y += 0.006; // Slowly rotate the pillow on the Y-axis
    }

    renderer.render(scene, camera);
}

// Function to delete the pillow object from the scene
const deletePillow = () => {

    if (object) {
        cancelAnimationFrame(animationFrameId); // Stop the animation frame request
        // Remove the object from the scene
        scene.remove(object);
        // Set the object to null to clear the reference
        object = null;
    }
};


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
};

// Handle color picker change
document.getElementById("colorPicker").addEventListener("input", (e) => {
    selectedColor = e.target.value; // Get the hex color value
    updatePillowColor(selectedColor);     // Update the pillow color
});

document.getElementById("pillow-selection").addEventListener("change",(e) => {
    objToRender = e.target.value; // Get the pillow value
    console.log("here + " + objToRender);
    resetEverything();
})

document.getElementById('pictureUpload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            // Create a new texture from the uploaded image
            pillowTexture = textureLoader.load(event.target.result); // Use the loaded file data URL
            loadTexture();
        }
        reader.readAsDataURL(file); // Read the file as a data URL
    }
});

// Function to reset the entire scene and rebuild everything
const resetEverything = () => {

    deletePillow();

    // Reset camera to initial position
    camera.position.set(0, 0, 100);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Recreate controls for camera movement
    controls = new OrbitControls(camera, renderer.domElement);

    updateCamera();

    // Set up the pillow model again
    setUpPillow();

    // Start the animation loop again
    animate();
};

// Show the dialog at the start
const rotateDialog = document.getElementById('rotateDialog');
rotateDialog.style.display = 'block';

// Function to hide the dialog
const hideRotateDialog = () => {
    rotateDialog.style.display = 'none';
};

// Listen for user interaction to hide the dialog
document.getElementById('container3D').addEventListener('click', hideRotateDialog);  // For mouse click


updateCamera();
//Load the pillow file
setUpPillow();
//Start the 3D rendering
animate();


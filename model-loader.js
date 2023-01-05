import { GLTFLoader } from "GLTFLoader";
import * as THREE from "three";
import { OrbitControls } from "OrbitControls";

let GLOBAL = {
    camera: null,
};

function reset() {
    let camera;
    camera.position.set(0, 0, -20);
    camera.lookAt(0, 0, 0);
}

function updateModel() {
    console.log("TEST");
}

(function initModelLoader() {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
        canvas: (function () {
            let canvas = document.getElementById("model-loader");
            return canvas;
        })(),
        antialias: true,
        alpha: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding;

    GLOBAL.camera = new THREE.PerspectiveCamera(30, 1);
    let camera = GLOBAL.camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(document.body);

    camera.position.set(0, 0, -20);
    camera.lookAt(0, 0, 0);

    window.addEventListener("keydown", test, false);

    function test(event) {
        let pos = camera.position;
        let x = pos.x;
        let y = pos.y;
        let z = pos.z;
        if (event.key == "r") {
            camera.position.set(0, 0, -20);
            camera.lookAt(0, 0, 0);
        } else if (event.key == "d") {
            camera.position.set(x, y + 1, z);
        }
    }

    let light = new THREE.DirectionalLight(0xffffff, 10); //조명
    scene.add(light);

    let loader = new GLTFLoader();
    loader.load("drone/scene.gltf", function (gltf) {
        scene.add(gltf.scene);
        renderer.render(scene, camera);
    });

    function animate() {
        requestAnimationFrame(animate);
        //controls.update()
        renderer.render(scene, camera);
    }
    animate();
})();

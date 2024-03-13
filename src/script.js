import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import { LoadGLTFByPath } from './helpers/ModelHelper.js'
import PositionAlongPathState from './positionAlongPathTools/PositionAlongPathState.js';
import { handleScroll, updatePosition } from './positionAlongPathTools/PositionAlongPathMethods.js'
import { loadCurveFromJSON } from './curveTools/CurveMethods.js'
import { setupRenderer } from './helpers/RendererHelper.js'

const curvePathJSON = './static/cameraP.json'

let animating = false;
let ended = false;
/**
 * Base
 */
// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
scene.background = new THREE.Color('pink')
/**
 * Camera
 */
// Base camera
const words = document.querySelector(".end")
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 8, 30)
camera.lookAt(0,2,0)
scene.add(camera)
const animateCamera = (end)=>{
    // if(end){animating = true;
    //     words.style.display =  "none"
    //     gsap.to(camera.position, { duration: 3, delay: 4, z: 0 })
    //     gsap.to(camera.rotation, { duration: 3, delay: 4.5, z: Math.PI/2 })
    //     gsap.to(camera.rotation, { duration: 3, delay: 4.5, x: -Math.PI/2 })
    //     gsap.to(camera.position, { duration: 4, delay: 8, y: -5 })
    //     gsap.to(camera.position, { duration: 4, delay: 10, y: -10 })
    //     gsap.to(camera.position, { duration: 4, delay: 14, y: -25 })
    //     gsap.to(camera.position, { duration: 5, delay: 16, z: -35 })
    //     gsap.to(camera.position, { duration: 5, delay: 16, y: -35 })
    //     gsap.to(camera.rotation, { duration: 4, delay: 16, x: -Math.PI })
    //     gsap.to(camera.position, { duration: 5, delay: 24, y: -125 })
    //     gsap.to(camera.position, { duration: 5, delay: 24, z:0 })
    //     gsap.to(camera.position, { duration: 5, delay: 24, x:0 })
    //     // gsap.to(camera.rotation, { duration: 4, delay: 24, x: Math.PI })
    //     gsap.to(camera.rotation, { duration: 4, delay: 24, x: camera.rotation.x-Math.PI - Math.PI/2 })
    //     // gsap.to(camera.rotation, { duration: 4, delay: 18, y: -Math.PI/2 })
    //     setTimeout(()=>{
    //         words.innerHTML = "song: MOOO! </br> Artist: Doja Cat"
    //         words.style.display =  "block"
    //         animating = false
    //         ended = true
    //     }, 28000 )}

    animating = true;
    words.style.display =  "none"
    gsap.to(camera.position, { duration: 3, delay: 4, z: 0 })
    gsap.to(camera.rotation, { duration: 3, delay: 4.5, z: Math.PI/2 })
    gsap.to(camera.rotation, { duration: 3, delay: 4.5, x: -Math.PI/2 })
    gsap.to(camera.position, { duration: 4, delay: 8, y: -5 })
    gsap.to(camera.position, { duration: 4, delay: 10, y: -10 })
    gsap.to(camera.position, { duration: 4, delay: 14, y: -25 })
    gsap.to(camera.position, { duration: 5, delay: 16, z: -35 })
    gsap.to(camera.position, { duration: 5, delay: 16, y: -35 })
    gsap.to(camera.rotation, { duration: 4, delay: 16, x: -Math.PI })
    gsap.to(camera.position, { duration: 5, delay: 24, y: -125 })
    gsap.to(camera.position, { duration: 5, delay: 24, z:0 })
    gsap.to(camera.position, { duration: 5, delay: 24, x:0 })
    // gsap.to(camera.rotation, { duration: 4, delay: 24, x: Math.PI })
    gsap.to(camera.rotation, { duration: 4, delay: 24, x: camera.rotation.x-Math.PI - Math.PI/2 })
    // gsap.to(camera.rotation, { duration: 4, delay: 18, y: -Math.PI/2 })
    setTimeout(()=>{
        words.innerHTML = "<a href='https://open.spotify.com/track/00bWqt93aqLXqKtzZoq7Jw?si=496b1744289746e4'>song: MOOO! </br> Artist: Doja Cat</a>"
        words.style.display =  "block"
        // animating = false
        ended = true
    }, 28000 )
}
// gsap.to(camera.position, { duration: 3, delay: 2, z: 0 })
// gsap.to(camera.rotation, { duration: 3, delay: 2.5, z: Math.PI/2 })
// gsap.to(camera.rotation, { duration: 3, delay: 2.5, x: -Math.PI/2 })
// gsap.to(camera.position, { duration: 4, delay: 6, y: -5 })
// gsap.to(camera.position, { duration: 4, delay: 10, y: -10 })


// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const rendererParameters = {}
rendererParameters.clearColor = '#1d1f2a'

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor(rendererParameters.clearColor)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// gui
//     .addColor(rendererParameters, 'clearColor')
//     .onChange(() =>
//     {
//         renderer.setClearColor(rendererParameters.clearColor)
//     })

/**
 * Material
 */
const material = new THREE.ShaderMaterial({
    extensions: {
        deriatives: 'extension GL_OES_standard_derivatives: enable'
    },
    side: THREE.DoubleSide,
    uniforms:{
        uTime: {value: 44.0},

    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
})

//lights
let light = new THREE.DirectionalLight(0xffffff, 2)
	light.position.set(1, 1, 1)
    scene.add(light)

/**
 * Objects
 */
// Torus knot
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
)
torusKnot.position.x = 3
// scene.add(torusKnot)

// Sphere
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(50,50,50),
    material
)
plane.rotation.x = -Math.PI /2
// sphere.position.x = - 3
// scene.add(plane)

const plane2 = new THREE.Mesh(
    new THREE.PlaneGeometry(50,50,50),
    material
)
// plane2.rotation.x = -Math.PI /2
plane2.position.z = -25
plane2.position.y = 25
scene.add(plane2)



// Scene
let wholeScene = null
gltfLoader.load(
    './scene.glb',
    (gltf) =>
    {
        wholeScene = gltf.scene
        wholeScene.traverse((child) =>
        {
            if(child.isMesh)
                child.material = material
        })
        wholeScene.rotation.y = Math.PI /2
        scene.add(wholeScene)
    }
)
let goldMaterial = new THREE.MeshPhysicalMaterial( { color: 0xffd700, metalness: 0.7, flatShading: false , roughness: 0.5, reflectivity: 1} );

let bells = null
gltfLoader.load(
    './bells.glb',
    (gltf) =>
    {
        bells = gltf.scene
        bells.traverse((child) =>
        {
            if(child.isMesh)
                child.material = goldMaterial
        })
        bells.rotation.y = Math.PI /2
        scene.add(bells)
    }
)


//add the three.js audio listeners
const listener = new THREE.AudioListener()
camera.add(listener)

//prepare a song variable for audio using the listener
const song = new THREE.Audio(listener)

//initiate the three js audio loader
const audioLoader = new THREE.AudioLoader()

//initiate the analyzer and get sound data from it
const analyser = new THREE.AudioAnalyser( song, 256 );
let data = analyser.getAverageFrequency();

audioLoader.load( './music/song.mp3', (buffer)=> {
    song.setBuffer( buffer );
    song.setLoop(true);
    song.setVolume(0.5);
    // song.play();
  });

  window.addEventListener('click', ()=>{
    song.play();
    if(!animating){

        animateCamera(ended)
    }
  })


/**
 * Animate
 */
const clock = new THREE.Clock()
let counter = 0.0;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    data = analyser.getAverageFrequency();

    // Rotate objects
    // if(wholeScene)
    // {
    //     wholeScene.rotation.x = - elapsedTime * 0.1
    //     wholeScene.rotation.y = elapsedTime * 0.2
    // }

    // sphere.rotation.x = - elapsedTime * 0.1
    // sphere.rotation.y = elapsedTime * 0.2

    // torusKnot.rotation.x = - elapsedTime * 0.1
    // torusKnot.rotation.y = elapsedTime * 0.2

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)
    material.uniforms.uTime.value = data*.005

    // camera.lookAt(0,0,0)
    

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
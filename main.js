import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import skyBackground from './src/darkBackground.png'

const houseUrl  = new URL('./assets/Bambo_House.glb', import.meta.url)

const scene = new THREE.Scene();

const cameraInitDepth = 0

let incrementalCameraMoveId = 0
const incrementedCameraMoveId = () => {
  return incrementalCameraMoveId+=1
}
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );

const sections = document.getElementsByTagName('section');

let incr = 0

var deep_step = 200
var deep_factor = 5

for (let section of sections) {
	if (incr == 0){
		section.style.zIndex  = `1`;
	}
    section.style.transform = `perspective(500px) translateZ(-${deep_factor*deep_step*incr}px)`;
    incr++
}

let zoomZ = 0

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const ambientLight = new THREE.AmbientLight(0xFFFFFFFF);
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xFFFFFFFF, 0.8);
scene.add(directionalLight)
directionalLight.position.set(-30,50,0)

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight);
//scene.add(dLightHelper)

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper)

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
///scene.add( cube );

const planeGeometry = new THREE.PlaneGeometry(70,70);
const planeMaterial = new THREE.MeshBasicMaterial({color: 0x212120});
const plane = new THREE.Mesh(planeGeometry,planeMaterial)
scene.add( plane );
plane.rotation.x = -0.5 * Math.PI;

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
	skyBackground,
	skyBackground,
	skyBackground,
	skyBackground,
	skyBackground,
	skyBackground
])
console.log(scene.backgroundRotation)

const barScrolling = document.getElementById('bar-scrolling');
const buttonScrolling = document.getElementById('bar-scrolling-button');

function updateScrollBar() {
	buttonScrolling.style.top = `${((zoomZ/(-1200))*barScrolling.offsetHeight)-buttonScrolling.offsetHeight/2+barScrolling.offsetTop}px`;
}

function updateSections() {
	let incr=0
	for (let section of sections) {
		let deltaZ = deep_factor*deep_step*incr+deep_factor*zoomZ/2
		section.style.transform = `perspective(500px) translateZ(-${deep_factor*deep_step*incr+deep_factor*zoomZ/2}px)`;

		if(deltaZ<0){
			section.style.zIndex  = `0`;
			section.style.opacity  = `0`;
		}else{
			section.style.display="flex"
			if(deltaZ >= 0 && deltaZ <= 500){
				section.style.zIndex  = `1`;
				section.style.opacity  = `1`;
			}else{
				section.style.zIndex  = `0`;
				section.style.opacity  = `0.5`;
			}
		}
		incr++
	}
}

document.addEventListener("wheel", (e) => {
	console.log("scroll")
	let step = e.deltaY>= 0 ? -deep_step : deep_step
	if(zoomZ+step <=0 && zoomZ+step >= -1200){
		let newZoomZ = zoomZ+step
		zoomZ= newZoomZ + ((e.deltaY>= 0 ? -newZoomZ : +newZoomZ) % deep_step)
	}else{
		if(zoomZ+step >=0){
			zoomZ=0
		}else if(zoomZ+step <= -1200){
			zoomZ=-1200
		}
	}
	animateCamera(camera,zoomZ/50)
	updateSections()
	updateScrollBar() 
})

let scrollingButtonIsClicked

document.addEventListener("click", (e) => {
	if (e.target.tagName=="A"){
	  	switch (e.target.id) {
			case 'link-section-home' :
				zoomZ=0;
			  	break;
			case 'link-section-1' :
				zoomZ=-400;
			  	break;
			case 'link-section-2' :
				zoomZ=-800;
			  	break;
			case 'link-section-3' :
				zoomZ=-1200;
			  	break;
	  	}
	  	animateCamera(camera,zoomZ/50)
	  	updateScrollBar()
	  	updateSections()
	}	
})

buttonScrolling.addEventListener("mousedown", (e) => {
	scrollingButtonIsClicked=true;
})

document.addEventListener("mousemove", (e) => {
	if(scrollingButtonIsClicked){
		if(e.pageY >= barScrolling.offsetTop && e.pageY <= barScrolling.offsetTop + barScrolling.offsetHeight){
			buttonScrolling.style.top = `${e.pageY-buttonScrolling.offsetHeight/2}px`;
			let ratio = (e.pageY-barScrolling.offsetTop)/(barScrolling.offsetHeight)
			zoomZ= ratio*(-1200)
			console.log(zoomZ)
			animateCamera(camera,zoomZ/50)
			updateSections()
		}
	}
})

document.addEventListener("mouseup", (e) => {
	scrollingButtonIsClicked=false;
})

const assetLoader = new GLTFLoader();

assetLoader.load(houseUrl.href, function (gltf) {
	const model1_darkMetal = new THREE.MeshStandardMaterial( { color: 0x262523 } );
	const model1_lightWood = new THREE.MeshStandardMaterial( { color: 0xbda36f } );
	const model1_lightConcrete = new THREE.MeshStandardMaterial( { color: 0xc2bdb4 } );
	const model1_glass = new THREE.MeshStandardMaterial( { color: 0x2f9aad } );

	const model1_darkMetald_Names = ["roof","parapet","gutters"]
	const model1_lightWood_Names = ["ridge","door","stairs","lamp_exterior","garage","door","barrels","boards","wall_barrels","body_house_2"]
	const model1_lightConcrete_Names = ["chimneys","door","fundametnts","body_house_1"]
	const model1_glass_Names = ["windows"]

	const house1 = gltf.scene;
	const house2 = house1.clone();
	const house3 = house1.clone();
	const house4 = house1.clone();

	console.log(house1)

	const applyMesh = (model_part) => {
		if (model_part.material) {
			for (let name of model1_darkMetald_Names){
				if (model_part.name.includes(name)){
					model_part.material=model1_darkMetal
				}
			}
			for (let name of model1_lightWood_Names){
				if (model_part.name.includes(name)){
					model_part.material=model1_lightWood
				}
			}
			for (let name of model1_lightConcrete_Names){
				if (model_part.name.includes(name)){
					model_part.material=model1_lightConcrete
				}
			}
			for (let name of model1_glass_Names){
				if (model_part.name.includes(name)){
					model_part.material=model1_glass
				}
			}			
		}
		if ((model_part.children)){
			for (let child of model_part.children){
				applyMesh(child)
			}
		}
	}
	applyMesh(house1)
	applyMesh(house2)
	applyMesh(house3)
	applyMesh(house4)

	scene.add(house1);
	scene.add(house2);
	scene.add(house3);
	scene.add(house4);

	house1.position.set(5,0,-5);
	house2.position.set(-17,0,-5);
	house3.position.set(5,0,-20);
	house4.position.set(-17,0,-20);
}, undefined, function (error) {
	console.log(error)
})

const axesHelper = new THREE.AxesHelper(5);

//scene.add(axesHelper);

//const orbit = new OrbitControls(camera,renderer.domElement)

camera.position.set(0,2,cameraInitDepth);
//orbit.update()



function animateCamera(camera,targetZ) {
	let concurrencyId = incrementedCameraMoveId()
	const animationTime = 0.5
	const fps = 60
	const frames = fps*animationTime

	const timePerFrames = 1000 / fps
	
	const step = (camera.position.z - targetZ)/frames
	const absStep = Math.abs(step)

	function moveCamera(){
		let newZ = camera.position.z - (camera.position.z - targetZ)/frames

		setTimeout(function(){
			if((newZ >= targetZ + absStep || newZ <= targetZ - absStep) && concurrencyId == incrementalCameraMoveId){
				camera.position.set(0,2,newZ);
				moveCamera()
				renderer.render( scene, camera );
			}
		}, timePerFrames/100);
	} 
	moveCamera()
}

function animateBackground(sceneToAnimate) {
	setTimeout(function(){
		sceneToAnimate.backgroundRotation = new THREE.Euler(0,sceneToAnimate.backgroundRotation.y+0.0005,sceneToAnimate.backgroundRotation.z+0.0005);
		animateBackground(sceneToAnimate)
	}, 1000/60);
}
animateBackground(scene)

function render() {
	renderer.render( scene, camera );
}

renderer.setAnimationLoop(render)
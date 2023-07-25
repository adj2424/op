import './style.css';
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { gsap } from 'gsap';
import { ScrollTrigger, ScrollToPlugin } from 'gsap/all';
import SplitType from 'split-type';
import Titles from './components/titles.ts';
import Portrait from './components/portrait.ts';
import Projects from './components/projects.ts';
import Technologies from './components/technologies.ts';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// all child objects where it will be animated through tick method
const updatables: any[] = [];

let count = 0;
let loadPercent = 0;

/**
 * Loading screen
 */
function load() {
	// finished loading and play enter animation
	if (count >= 100) {
		gsap
			.timeline()
			.to('#load-name', {
				fontSize: '30px',
				top: '2.5%',
				left: '5%',
				duration: 1.5,
				ease: 'power2.out',
				delay: 1
			})
			.to('.loader-container', {
				opacity: 0,
				duration: 0.5,
				ease: 'power2.out'
			})
			.add(() => {
				document.querySelector('.loader-container')!.remove();
			});
		return;
	}
	// must wait for load manager to finish
	if (count / 100 >= loadPercent) {
		setTimeout(load, 60);
	} else {
		count++;
	}
	const loading = document.getElementById('loading')!;
	loading.innerHTML = count + '%';
	let scalePercent = (count * 82) / 100;
	document.getElementById('loading')!.style.right = 82 - scalePercent + '%';
	setTimeout(load, 60);
}

// artificial loading
load();
// actual loading stuff should be very fast
const loadManager = new THREE.LoadingManager();
loadManager.onProgress = (_, loaded, total) => {
	loadPercent = loaded / total;
	console.log(loadPercent, count);
};

/**
 * World
 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg')!,
	antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(10);

/**
 * Background
 */
//https://coolors.co/palette/f8f9fa-e9ecef-dee2e6-ced4da-adb5bd-6c757d-495057-343a40-212529
scene.background = new THREE.Color(0xe8e8e4).convertSRGBToLinear();

/**
 * Light Source
 */
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

/**
 * resize window
 */
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
});

/**
 * Initialize meshes
 */
Promise.all([
	Titles.init(loadManager),
	Portrait.init(loadManager),
	Projects.init(loadManager),
	Technologies.init(loadManager)
]).then(() => {
	scene.add(Titles.topTextGroup);
	scene.add(Titles.botTextGroup);
	updatables.push(Titles);

	scene.add(Portrait.pfpMesh);
	scene.add(Portrait.borderPfpMesh);

	scene.add(Projects.projectText);
	scene.add(Projects.projects);

	scene.add(Technologies.left1);
	scene.add(Technologies.left2);
	scene.add(Technologies.right);
	scene.add(Technologies.row1);
	scene.add(Technologies.row2);
});

/**
 * animates objects with animations
 * @param delta consistency of animation
 */
function tick(delta: number) {
	for (const obj of updatables) {
		obj.tick(delta);
	}
}

const cursor = document.querySelector('.cursor') as HTMLElement;
const cursorText = document.querySelector('.cursor-text') as HTMLElement;
const cursorDot = document.querySelector('.cursor-dot') as HTMLElement;
document.addEventListener('mousemove', e => {
	let mouseX = e.clientX - 10;
	let mouseY = e.clientY - 20;
	// if (hover) {
	// 	mouseX = e.clientX + 10;
	// 	mouseY = e.clientY;
	// }
	let percentX = (mouseX / window.innerWidth) * 100;
	let percentY = (mouseY / window.innerHeight) * 100;

	cursor.style.top = percentY + '%';
	cursor.style.left = percentX + '%';
});

document.addEventListener('mousedown', () => {
	cursor.style.transform = 'scale(0.6)';
});

document.addEventListener('mouseup', () => {
	cursor.style.transform = 'scale(1)';
});

let hover = false;
let dragHover = false;

const masks: HTMLElement[] = [document.getElementById('mask1')!, document.getElementById('mask2')!];
masks.map(e => {
	e.addEventListener('mouseover', () => {
		dragHover = false;
	});
});

const elements: HTMLElement[] = [
	document.getElementById('header-name')!,
	document.getElementById('header-abt')!,
	document.getElementById('header-proj')!,
	document.getElementById('header-tech')!,
	document.getElementById('header-contact')!,
	document.getElementById('frontend')!,
	document.getElementById('backend')!,
	document.getElementById('misc')!,
	document.getElementById('socials-email')!,
	document.getElementById('socials-instagram')!,
	document.getElementById('socials-threads')!,
	document.getElementById('socials-linkedin')!,
	document.getElementById('socials-github')!
];

elements.map(e => {
	e.addEventListener('mouseover', () => {
		hover = true;
	});
	e.addEventListener('mouseout', () => {
		hover = false;
	});
});

document.getElementById('header-name')!.addEventListener('click', () => {
	scrollToPosition(0);
});
document.getElementById('header-abt')!.addEventListener('click', () => {
	scrollToPosition(0.11);
});
document.getElementById('header-proj')!.addEventListener('click', () => {
	scrollToPosition(0.41);
});
document.getElementById('header-tech')!.addEventListener('click', () => {
	scrollToPosition(0.75);
});
document.getElementById('header-contact')!.addEventListener('click', () => {
	scrollToPosition(0.93);
});

const scrollToPosition = (percent: number) => {
	let scrollContentHeight = document.querySelector('.page')!.scrollHeight;
	gsap.to(window, { duration: 3.5, ease: 'power2.out', scrollTo: scrollContentHeight * percent });
};

document.getElementById('contact')!.addEventListener('mouseover', () => {
	gsap.to('#contact', {
		duration: 0.8,
		text: {
			value: 'LETS GET IN TOUCH'
		}
	});
});
document.getElementById('contact')!.addEventListener('mouseout', () => {
	gsap.to('#contact', {
		duration: 0.8,
		text: {
			value: 'INTERESTED IN WORKING?'
		}
	});
});

/**
 * Initial values of objects
 */
let cameraParam = { x: 0, y: 0, z: 10 };
let bgColorParam = { r: 232 / 255, g: 232 / 255, b: 228 / 255 };

let pfpParam = { x: -12, y: -6, z: -8 };
let pfpParamScale = { x: 8, y: 8, z: 8 };
let borderPfpParam = { x: 0, y: 0, z: 0 };
let borderPfpScaleParam = { x: 1, y: 1, z: 1 };
let topPfpMeshParam = { x: -12, y: 12, z: -8 };
let botPfpMeshParam = { x: -12, y: -17, z: -8 };
let leftPfpMeshParam = { x: -26, y: -4, z: -8 };
let rightPfpMeshParam = { x: 2, y: -4, z: -8 };

let topTextGroupParam = { x: 0, y: 0, z: 0 };
let botTextGroupParam = { x: 0, y: 0, z: 0 };
let botTextGroupScaleParam = { x: 1, y: 1, z: 1 };

let projectTextParam = { x: -36, y: -40, z: -8 };
let projectTextScaleParam = { x: 1, y: 1, z: 1 };

let techLeft1Param = { x: -35, y: -80, z: -5 };
let techLeft2Param = { x: -70, y: -85, z: -5 };
let techRightParam = { x: 10, y: -90, z: -5 };
let techL2ColorParam = { r: 10 / 255, g: 9 / 255, b: 8 / 255 };
let techL2ScaleParam = { x: 1, y: 1, z: 1 };

/**
 * Animate
 */
let t = 0;
function animate() {
	t += 1;
	// change cursor based on hover states
	if (t % 3 === 0) {
		if (hover) {
			cursor.style.width = '.5vw';
			cursor.style.height = '.5vw';
			cursorDot.style.width = '1vw';
			cursorDot.style.height = '1vw';
			cursor.style.opacity = '.8';
			cursorDot.style.opacity = '1';
			cursorText.style.opacity = '0';
		}
		// drag hover
		else if (dragHover) {
			cursor.style.width = '6vw';
			cursor.style.height = '6vw';
			cursorText.style.opacity = '1';
			cursorDot.style.opacity = '0';
		}
		// default cursor
		else {
			dragHover = false;
			cursor.style.width = '2vw';
			cursor.style.height = '2vw';
			cursorText.style.opacity = '0';
			cursor.style.opacity = '1';
			cursorDot.style.width = '0vw';
			cursorDot.style.height = '0vw';
		}
	}
	// delta for consistency
	const delta = 0.005;
	tick(delta);
	//controls.update();
	camera.position.set(cameraParam.x, cameraParam.y, cameraParam.z);
	scene.background = new THREE.Color(bgColorParam.r, bgColorParam.g, bgColorParam.b).convertSRGBToLinear();

	Portrait.pfpMesh.position.set(pfpParam.x, pfpParam.y, pfpParam.z);
	Portrait.pfpMesh.scale.set(pfpParamScale.x, pfpParamScale.y, pfpParamScale.z);
	Portrait.borderPfpMesh.position.set(borderPfpParam.x, borderPfpParam.y, borderPfpParam.z);
	Portrait.borderPfpMesh.scale.set(borderPfpScaleParam.x, borderPfpScaleParam.y, borderPfpScaleParam.z);
	Portrait.topPfpMesh.position.set(topPfpMeshParam.x, topPfpMeshParam.y, topPfpMeshParam.z);
	Portrait.botPfpMesh.position.set(botPfpMeshParam.x, botPfpMeshParam.y, botPfpMeshParam.z);
	Portrait.leftPfpMesh.position.set(leftPfpMeshParam.x, leftPfpMeshParam.y, leftPfpMeshParam.z);
	Portrait.rightPfpMesh.position.set(rightPfpMeshParam.x, rightPfpMeshParam.y, rightPfpMeshParam.z);

	Titles.topTextGroup.position.set(topTextGroupParam.x, topTextGroupParam.y, topTextGroupParam.z);
	Titles.botTextGroup.position.set(botTextGroupParam.x, botTextGroupParam.y, botTextGroupParam.z);
	Titles.botTextGroup.scale.set(botTextGroupScaleParam.x, botTextGroupScaleParam.y, botTextGroupScaleParam.z);

	Projects.projectText.position.set(projectTextParam.x, projectTextParam.y, projectTextParam.z);
	Projects.projectText.scale.set(projectTextScaleParam.x, projectTextScaleParam.y, projectTextScaleParam.z);

	Technologies.left1.position.set(techLeft1Param.x, techLeft1Param.y, techLeft1Param.z);
	Technologies.right.position.set(techRightParam.x, techRightParam.y, techRightParam.z);
	Technologies.left2.position.set(techLeft2Param.x, techLeft2Param.y, techLeft2Param.z);
	(Technologies.left2.material as THREE.MeshBasicMaterial).color = new THREE.Color(
		techL2ColorParam.r,
		techL2ColorParam.g,
		techL2ColorParam.b
	).convertSRGBToLinear();
	Technologies.left2.scale.set(techL2ScaleParam.x, techL2ScaleParam.y, techL2ScaleParam.z);

	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

const aboutHello = new SplitType('.about-hello');
const aboutText = new SplitType('.about-text', { types: 'lines' });
const aboutLines = document.querySelectorAll('.about-text .line');

let projectName = new SplitType('.project-name');
let projectDesc = new SplitType('.project-desc');
//const projectNameLines = document.querySelectorAll('.project-name .line');

createLineWrapper(aboutLines);
//createLineWrapper(projectNameLines);
// wrap lines with div fsr to make line stagger work idk
function createLineWrapper(lines: NodeListOf<Element>) {
	lines.forEach(line => {
		const wrapper = document.createElement('div');
		wrapper.classList.add('line-wrapper');
		line.parentNode!.insertBefore(wrapper, line);
		wrapper.appendChild(line);
	});
}

/**
 * scroll animation by toggle
 */
// about
gsap.fromTo(
	aboutHello.chars,
	{
		yPercent: 300
	},
	{
		scrollTrigger: {
			trigger: '.about-container',
			start: '210% center',
			end: '300% 0%',
			//markers: true,
			toggleActions: 'play reverse play reverse'
		},
		yPercent: 0,
		stagger: 0.1,
		duration: 0.4
	}
);
gsap.fromTo(
	aboutText.lines,
	{
		yPercent: 100
	},
	{
		scrollTrigger: {
			trigger: '.about-container',
			start: '210% center',
			end: '300% 0%',
			//markers: true,
			toggleActions: 'play reverse play reverse'
		},
		yPercent: 0,
		stagger: 0.1,
		duration: 0.2
	}
);

/**
 * Drag controls for projects
 */
const dragControls = new DragControls([Projects.projects], camera, renderer.domElement);
// this allows for multiple objects to be dragged
dragControls.transformGroup = true;

let previousItem = 0;
let projectInfo: any[] = new Projects().getProjectInfo();
const itemCount = projectInfo.length;
const offset = itemCount * 28;
dragControls.addEventListener('dragstart', () => {
	const startTime = new Date();
	// open project on click
	window.addEventListener('mouseup', () => {
		const endTime = new Date();
		const duration = endTime.getTime() - startTime.getTime();
		if (duration < 130) {
			window.open(projectInfo[previousItem].url);
		}
	});
});
dragControls.addEventListener('hoveron', () => {
	dragHover = true;
});
dragControls.addEventListener('hoveroff', () => {
	dragHover = false;
});
dragControls.addEventListener('drag', e => {
	const item = -Math.round(Number(e.object.position.x) / 28) % 4;
	// not equal means that the item has changed
	if (item != previousItem) {
		previousItem = item;
		gsap.fromTo(
			projectName.lines,
			{
				yPercent: 0
			},
			{
				yPercent: -100,
				duration: 0.3,
				// plays other animation after this one is done
				onComplete: () => {
					// split type is weird so we have to revert it and then change text
					projectName.revert();
					let element = document.querySelector('.project-name') as HTMLElement;
					element!.textContent = projectInfo[item].titles.toUpperCase();
					// recreate split type with updated text
					projectName = new SplitType('.project-name');
					// plays animation with updated text
					gsap.fromTo(
						projectName.lines,
						{
							yPercent: 100
						},
						{
							yPercent: 0,
							duration: 0.3
						}
					);
				}
			}
		);

		gsap.fromTo(
			projectDesc.lines,
			{
				yPercent: 0
			},
			{
				yPercent: -100,
				duration: 0.3,
				onComplete: () => {
					projectDesc.revert();
					const e = document.querySelector('.project-desc') as HTMLElement;
					e!.textContent = projectInfo[item].descriptions;
					projectDesc = new SplitType('.project-desc');
					gsap.fromTo(
						projectDesc.lines,
						{
							yPercent: 100
						},
						{
							yPercent: 0,
							duration: 0.3
						}
					);
				}
			}
		);
	}
	// same as group position except x
	e.object.position.y = 0;
	e.object.position.z = 1;
	// left bounds
	if (e.object.position.x < -offset) {
		e.object.position.set(e.object.position.x + offset, 0, 1);
	}
	// right bounds
	if (e.object.position.x > 0) {
		e.object.position.set(e.object.position.x - offset, 0, 1);
	}
});

/**
 * https://tympanus.net/codrops/2022/12/13/how-to-code-an-on-scroll-folding-3d-cardboard-box-animation-with-three-js-and-gsap/
 * Animation timeline by scrolling
 */
const timeline = gsap.timeline({
	scrollTrigger: {
		trigger: '.page',
		start: '0% 0%',
		end: '100% 100%',
		scrub: 1.5
		//markers: true
	}
});

timeline
	.to(
		pfpParam,
		{
			x: 15,
			y: -1,
			z: -8,
			duration: 15 // end time is start time + duration
		},
		0 // start time
	)
	.to(pfpParamScale, { x: 4, y: 4, z: 4, duration: 15 }, 0)
	.to(topPfpMeshParam, { x: 16, y: 18, z: -8, duration: 15 }, 0)
	.to(botPfpMeshParam, { x: 16, y: -28, z: -8, duration: 15 }, 0)
	.to(leftPfpMeshParam, { x: 4, y: -4, z: -8, duration: 15 }, 0)
	.to(rightPfpMeshParam, { x: 26, y: -4, z: -8, duration: 15 }, 0)

	.to(topTextGroupParam, { x: 0, y: 8, z: 0, duration: 15 }, 0)
	.to(botTextGroupParam, { x: 0, y: -11, z: 0, duration: 15 }, 0)
	// remove things for next transition by scaling to 0
	.to(botTextGroupScaleParam, { x: 0, y: 0, z: 0, duration: 0.2 }, 15)
	.to(borderPfpParam, { x: 0, y: 0, z: -10, duration: 0.5 }, 15)
	.to(borderPfpScaleParam, { x: 0, y: 0, z: 0, duration: 0.5 }, 16)

	// move camera to project text
	.to(cameraParam, { x: 0, y: -30, z: 10, duration: 20 }, 18)

	// move about text out of screen
	.to('.about-container', { xPercent: -150, duration: 5 }, 35)

	// shrink project text
	.to(cameraParam, { x: 0, y: -30, z: 10, duration: 8 }, 40)
	.to(projectTextParam, { x: -18, y: -34, z: -8, duration: 8 }, 40)
	.to(projectTextScaleParam, { x: 0.5, y: 0.5, z: 0.5, duration: 8 }, 40)

	// move camera to project showcase to expertise
	.to(cameraParam, { x: 0, y: -85, z: 10, duration: 40 }, 50)
	.fromTo('#mask1', { yPercent: 0 }, { yPercent: -205, duration: 40 }, 50)
	// move project desc with screen
	.fromTo('.project-container', { yPercent: 260 }, { yPercent: -1550, duration: 30 }, 59)
	.fromTo('#mask2', { yPercent: 25 }, { yPercent: -125, duration: 40 }, 58)
	.to('#mask2', { scaleY: 1.5, duration: 8 }, 82)

	// transition to technologies showcase
	.to(techLeft1Param, { x: -12, duration: 60 }, 60)
	.to(techLeft2Param, { x: -14, duration: 30 }, 60)
	.to(techRightParam, { x: -30, duration: 40 }, 70)
	.to(techL2ColorParam, { r: 232 / 255, g: 232 / 255, b: 228 / 255, duration: 5 }, 85)
	.to('.header-container p', { color: '#e8e8e4', duration: 5 }, 85)
	.to(bgColorParam, { r: 10 / 255, g: 9 / 255, b: 8 / 255, duration: 5 }, 85)

	.to(techL2ScaleParam, { x: 0.75, y: 0.75, z: 0.75, duration: 15 }, 93)
	.to(techLeft2Param, { x: -6, y: -94.25, z: -5, duration: 15 }, 93)
	// move project desc with screen
	.from('.list-container', { xPercent: -105, duration: 3 }, 85)
	.from('.item', { opacity: 0, xPercent: -105, stagger: 3, duration: 5 }, 92)
	.from('.box-container', { yPercent: -150, duration: 5 }, 90)
	.from('.box', { opacity: 0, yPercent: -50, stagger: 1.5, duration: 8 }, 88)

	// transition to contact page
	.to('.box', { xPercent: -700, duration: 23 }, 116)
	.to('.item', { xPercent: -700, duration: 23 }, 116)
	.to(techLeft2Param, { x: -59, y: -93.5, z: -5, duration: 23 }, 116)
	.to('.contact-container', { xPercent: -100, duration: 21 }, 116)
	.to('#header-contact', { color: '#0a0908', duration: 3 }, 116)
	.to('#header-tech', { color: '#0a0908', duration: 3 }, 116.67)
	.to('#header-proj', { color: '#0a0908', duration: 3 }, 117.33)
	.to('#header-abt', { color: '#0a0908', duration: 3 }, 118)
	.to('#header-name', { color: '#0a0908', duration: 4 }, 129.5)

	// to make start time a percentage out of 140 from total duration
	// start time + duration cannot be greater than 140 or it will change timeline
	.to({}, {}, 140);
// it was 100% at 1500vh

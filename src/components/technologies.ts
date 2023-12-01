import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/all';
import { lightColor, accentColor } from '../colors';

export default class Technologies {
	static left1 = new THREE.Mesh();
	static left2 = new THREE.Mesh();
	static right = new THREE.Mesh();

	static row1 = new THREE.Group();
	static row2 = new THREE.Group();

	constructor() {}
	static async init(loadManager: THREE.LoadingManager) {
		gsap.registerPlugin(ScrollTrigger, TextPlugin);
		const fontLoader = new FontLoader(loadManager);
		const loader = new TTFLoader(loadManager);
		const ttf = await loader.loadAsync('/fonts/HankenGrotesk-Light.ttf');
		const font = fontLoader.parse(ttf);

		const words = ['THE BEST', 'TECHNOLOGIES', 'I USE'];
		const coords = [
			[-30, -80, -5],
			[-30, -85, -5],
			[0, -95, -5]
		];

		for (let i = 0; i < words.length; i++) {
			const textGeometry = new TextGeometry(words[i], {
				font: font,
				size: 3.5,
				height: 0.0
			});

			const text = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ color: lightColor.hex }));
			const [x, y, z] = coords[i];
			text.position.set(x, y, z);
			text.material.color;
			if (i === 0) {
				this.left1 = text;
			}
			//
			else if (i === 1) {
				this.left2 = text;
			}
			//
			else if (i === 2) {
				this.right = text;
			}
		}

		const frontE = document.getElementById('frontend')! as HTMLElement;
		const backE = document.getElementById('backend')! as HTMLElement;
		const miscE = document.getElementById('misc')! as HTMLElement;

		let count = 0;
		const playAnimation = () => {
			const front = [
				'logos/javascript.svg',
				'TypeScript',
				'logos/react.svg',
				'Next.js',
				'logos/tailwind.svg',
				'JavaScript',
				'logos/typescript.svg',
				'React',
				'logos/nextjs.svg',
				'Tailwind CSS'
			];

			const back = [
				'logos/python.svg',
				'Java',
				'logos/nodejs.svg',
				'Solidity',
				'logos/mongodb.svg',
				'Python',
				'logos/java.svg',
				'Node.js',
				'logos/solidity.svg',
				'MongoDB'
			];

			const misc = [
				'logos/gcp.svg',
				'Hardhat',
				'logos/threejs.svg',
				'Git',
				'logos/vscode.svg',
				'Google Cloud Platform',
				'logos/hardhat.svg',
				'Three.js',
				'logos/git.svg',
				'VS Code'
			];
			if (count > 2) {
				count = 0;
			}
			if (count === 0) {
				frontE.style.color = accentColor.hexString;
				backE.style.color = lightColor.hexString;
				miscE.style.color = lightColor.hexString;
				this.playAnimationHelper(front);
			}
			if (count === 1) {
				frontE.style.color = lightColor.hexString;
				backE.style.color = accentColor.hexString;
				miscE.style.color = lightColor.hexString;
				this.playAnimationHelper(back);
			}
			if (count === 2) {
				frontE.style.color = lightColor.hexString;
				backE.style.color = lightColor.hexString;
				miscE.style.color = accentColor.hexString;
				this.playAnimationHelper(misc);
			}
			count++;
		};
		// auto timer to play animation every 4.5 seconds
		let timed = setInterval(playAnimation, 4500);
		const elements: HTMLElement[] = [frontE, backE, miscE];
		elements.map(e => {
			e.addEventListener('click', () => {
				// stop auto timer
				clearInterval(timed);
				if (e === frontE && count !== 1) {
					count = 0;
					playAnimation();
				} else if (e === backE && count !== 2) {
					count = 1;
					playAnimation();
				} else if (e === miscE && count !== 0) {
					count = 2;
					playAnimation();
				}
				// resume auto timer
				timed = setInterval(playAnimation, 4500);
			});
		});
	}

	static playAnimationHelper = (arr: string[]) => {
		for (let i = 0; i < 10; i++) {
			// change top row icons
			if (i === 0 || i === 2 || i === 4) {
				const e = document.getElementById(`box-${i}`)!;
				const imgElem = e.querySelector('img');
				gsap
					.timeline()
					.fromTo(
						imgElem,
						{
							yPercent: 0
						},
						{
							yPercent: 200,
							ease: 'back.in(2)',
							duration: 0.6
						}
					)
					.add(() => {
						imgElem!.src = arr[i];
					})
					.fromTo(
						imgElem,
						{
							yPercent: -150
						},
						{
							yPercent: 0,
							ease: 'back.out(2)',
							duration: 0.6
						}
					);
			}
			// bottom row icons
			else if (i === 6 || i === 8) {
				const e = document.getElementById(`box-${i}`)!;
				const imgElem = e.querySelector('img');
				gsap
					.timeline()
					.fromTo(
						imgElem,
						{
							yPercent: 0
						},
						{
							yPercent: -200,
							ease: 'back.in(2)',
							duration: 0.6
						}
					)
					.add(() => {
						imgElem!.src = arr[i];
					})
					.fromTo(
						imgElem,
						{
							yPercent: 150
						},
						{
							yPercent: 0,
							ease: 'back.out(2)',
							duration: 0.6
						}
					);
			}
			// change text
			else {
				gsap.to(`#box-${i}`, {
					duration: 1,
					text: {
						value: arr[i]
					},
					ease: 'power2.inOut'
				});
			}
		}
	};
}

import { fly } from 'svelte/transition';

function getTransition(stage, delay) {
	let delayActual = 50;
	if (delay !== undefined && typeof delay === 'number') {
		delayActual = delay;
	}
	return {
		in: { func: fly, options: { delay: stage * delayActual, duration: 200, y: '-4%' } }
	};
}

function getDownTransition(stage, delay) {
	let delayActual = 50;
	if (delay !== undefined && typeof delay === 'number') {
		delayActual = delay;
	}
	return {
		in: { func: fly, options: { delay: stage * delayActual, duration: 200, y: '4%' } }
	};
}

function getOutLeftTransition(stage, delay) {
	let delayActual = 50;
	if (delay !== undefined && typeof delay === 'number') {
		delayActual = delay;
	}
	return {
		out: { func: fly, options: { delay: stage * delayActual, duration: 200, x: '-8%' } }
	};
}

function getInRightTransition(stage, delay) {
	let delayActual = 50;
	if (delay !== undefined && typeof delay === 'number') {
		delayActual = delay;
	}
	return {
		out: { func: fly, options: { delay: stage * delayActual, duration: 200, x: '20%' } }
	};
}
function getInLeftTransition(stage, delay) {
	let delayActual = 50;
	if (delay !== undefined && typeof delay === 'number') {
		delayActual = delay;
	}
	return {
		out: { func: fly, options: { delay: stage * delayActual, duration: 200, x: '-20%' } }
	};
}

function getDesktopTransition(stage, delay) {
	let delayActual = 50;
	if (delay !== undefined && typeof delay === 'number') {
		delayActual = delay;
	}
	return {
		in: { func: fly, options: { delay: stage * delayActual, duration: 200, y: '-10%' } }
	};
}

export {
	getTransition,
	getDesktopTransition,
	getDownTransition,
	getOutLeftTransition,
	getInLeftTransition,
	getInRightTransition
};

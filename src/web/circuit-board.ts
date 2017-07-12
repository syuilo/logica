import * as SVG from 'svg.js';
require('svg.draggable.js');

import Circuit from '../core/circuit';

export default class {
	draw: any;
	circuit: Circuit;
	autoTick: boolean = true;

	constructor(svg, w, h) {
		this.draw = SVG(svg).size(window.innerWidth, window.innerHeight).size(w, h);

		this.circuit = new Circuit();

		setInterval(() => {
			if (this.autoTick) this.circuit.tick();
		}, 100);
	}
}

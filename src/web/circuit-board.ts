import * as SVG from 'svg.js';
require('svg.draggable.js');

export default class {
	draw: any;

	constructor(svg, w, h) {
		this.draw = SVG(svg).size(window.innerWidth, window.innerHeight).size(w, h);
	}
}

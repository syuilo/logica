import autobind from 'autobind-decorator';

import * as SVG from 'svg.js';
require('svg.draggable.js');

import Circuit from '../core/circuit';

import Package from '../core/nodes/package';

import NodeView from './node-view';

import AndView from './node-views/and';
import And3View from './node-views/and3';
import OrView from './node-views/or';
import NotView from './node-views/not';
import NorView from './node-views/nor';
import NandView from './node-views/nand';
import XorView from './node-views/xor';
import NopView from './node-views/nop';
import RandomView from './node-views/random';
import ButtonView from './node-views/button';
import LedView from './node-views/led';
import PinView from './node-views/pin';
import PackageView from './node-views/package';
import PackageInputView from './node-views/package-input';
import PackageOutputView from './node-views/package-output';

@autobind
class CircuitView {
	draw: any;
	circuit: Circuit;
	nodeViews: NodeView[] = [];
	autoTick: boolean = true;
	snapToGrid: boolean = true;

	constructor(svg, w, h) {
		this.draw = SVG(svg).size(w, h);

		this.circuit = new Circuit();

		setInterval(() => {
			if (this.autoTick) this.circuit.tick();
		}, 100);
	}

	addNode(nodeView: NodeView) {
		this.nodeViews.push(nodeView);
		this.circuit.addNode(nodeView.node);
		nodeView.move(32 + (Math.random() * 32), 32 + (Math.random() * 32));
	}

	loadPackage(data) {
		this.addNode(new PackageView(this, Package.import(data)));
	}

	addAnd() {
		this.addNode(new AndView(this));
	}

	addAnd3() {
		this.addNode(new And3View(this));
	}

	addOr() {
		this.addNode(new OrView(this));
	}

	addNot() {
		this.addNode(new NotView(this));
	}

	addNor() {
		this.addNode(new NorView(this));
	}

	addNand() {
		this.addNode(new NandView(this));
	}

	addXor() {
		this.addNode(new XorView(this));
	}

	addNop() {
		this.addNode(new NopView(this));
	}

	addRandom() {
		this.addNode(new RandomView(this));
	}

	addButton() {
		this.addNode(new ButtonView(this));
	}

	addLed() {
		this.addNode(new LedView(this));
	}

	addPin() {
		this.addNode(new PinView(this));
	}

	addPackageInput() {
		const name = window.prompt('Input name');
		const id = window.prompt('Input ID ([a-z0-9_]+)');
		const desc = window.prompt('Input description');
		const index = Array.from(this.circuit.nodes).filter(n => n.type === 'PackageInput').length;
		this.addNode(new PackageInputView(this, id, name, desc, index));
	}

	addPackageOutput() {
		const name = window.prompt('Output name');
		const id = window.prompt('Output ID ([a-z0-9_]+)');
		const desc = window.prompt('Output description');
		const index = Array.from(this.circuit.nodes).filter(n => n.type === 'PackageOutput').length;
		this.addNode(new PackageOutputView(this, id, name, desc, index));
	}
}

export default CircuitView;

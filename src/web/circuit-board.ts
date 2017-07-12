import autobind from 'autobind-decorator';

import * as SVG from 'svg.js';
require('svg.draggable.js');

import Circuit from '../core/circuit';

import Package from '../core/nodes/package';

import NodeTag from './node';

import AndTag from './node-tags/and';
import And3Tag from './node-tags/and3';
import OrTag from './node-tags/or';
import NotTag from './node-tags/not';
import NorTag from './node-tags/nor';
import NandTag from './node-tags/nand';
import XorTag from './node-tags/xor';
import NopTag from './node-tags/nop';
import RandomTag from './node-tags/random';
import ButtonTag from './node-tags/button';
import LedTag from './node-tags/led';
import PinTag from './node-tags/pin';
import PackageTag from './node-tags/package';
import PackageInputTag from './node-tags/package-input';
import PackageOutputTag from './node-tags/package-output';

@autobind
class X {
	draw: any;
	circuit: Circuit;
	nodeTags: NodeTag[] = [];
	autoTick: boolean = true;

	constructor(svg, w, h) {
		this.draw = SVG(svg).size(w, h);

		this.circuit = new Circuit();

		setInterval(() => {
			if (this.autoTick) this.circuit.tick();
		}, 100);
	}

	addTag(tag) {
		this.nodeTags.push(tag);
		this.circuit.addNode(tag.node);
		tag.move(32 + (Math.random() * 32), 32 + (Math.random() * 32));
	}

	loadPackage(data) {
		this.addTag(new PackageTag(this, Package.import(data)));
	}

	addAnd() {
		this.addTag(new AndTag(this));
	}

	addAnd3() {
		this.addTag(new And3Tag(this));
	}

	addOr() {
		this.addTag(new OrTag(this));
	}

	addNot() {
		this.addTag(new NotTag(this));
	}

	addNor() {
		this.addTag(new NorTag(this));
	}

	addNand() {
		this.addTag(new NandTag(this));
	}

	addXor() {
		this.addTag(new XorTag(this));
	}

	addNop() {
		this.addTag(new NopTag(this));
	}

	addRandom() {
		this.addTag(new RandomTag(this));
	}

	addButton() {
		this.addTag(new ButtonTag(this));
	}

	addLed() {
		this.addTag(new LedTag(this));
	}

	addPin() {
		this.addTag(new PinTag(this));
	}

	addPackageInput() {
		const name = window.prompt('Input name');
		const id = window.prompt('Input ID ([a-z0-9_]+)');
		const desc = window.prompt('Input description');
		this.addTag(new PackageInputTag(this, id, name, desc));
	}

	addPackageOutput() {
		const name = window.prompt('Output name');
		const id = window.prompt('Output ID ([a-z0-9_]+)');
		const desc = window.prompt('Output description');
		this.addTag(new PackageOutputTag(this, id, name, desc));
	}
}

export default X;

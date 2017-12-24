import * as SVG from 'svg.js';
import autobind from 'autobind-decorator';

import CircuitCore from '../core/circuit';
import のーど from '../core/node';
import Package from '../core/nodes/package';

import NodeView from './node-view';

import AndView from './node-views/and';
import And3View from './node-views/and3';
import OrView from './node-views/or';
import Or3View from './node-views/or3';
import NotView from './node-views/not';
import NorView from './node-views/nor';
import NandView from './node-views/nand';
import XorView from './node-views/xor';
import TrueView from './node-views/true';
import FalseView from './node-views/false';
import NopView from './node-views/nop';
import RandomView from './node-views/random';
import ButtonView from './node-views/button';
import LedView from './node-views/led';
import PinView from './node-views/pin';
import PackageView from './node-views/package';
import PackageInputView from './node-views/package-input';
import PackageOutputView from './node-views/package-output';
import ModuleView from './node-views/module';

import Config from './config';

/**
 * 回路ビュー(モジュール内部含む)
 */
@autobind
export default abstract class NodesView {
	/**
	 * SVGのインスタンス
	 */
	public draw: any;

	/**
	 * このビューに含まれるノードのビュー
	 */
	nodeViews: NodeView[] = [];

	/**
	 * このビューに含まれるノード
	 */
	abstract nodes: Set<のーど>;

	abstract removeNode(nodeView: NodeView);

	private config: Config;

	constructor(config: Config, svg, w, h) {
		this.config = config;
		this.draw = SVG(svg).size(w, h);
	}

	addNode(nodeView: NodeView) {
		this.nodeViews.push(nodeView);
		nodeView.move(32 + (Math.random() * 32), 32 + (Math.random() * 32));
	}

	addAnd() {
		this.addNode(new AndView(this.config, this));
	}

	addAnd3() {
		this.addNode(new And3View(this.config, this));
	}

	addOr() {
		this.addNode(new OrView(this.config, this));
	}

	addOr3() {
		this.addNode(new Or3View(this.config, this));
	}

	addNot() {
		this.addNode(new NotView(this.config, this));
	}

	addNor() {
		this.addNode(new NorView(this.config, this));
	}

	addNand() {
		this.addNode(new NandView(this.config, this));
	}

	addXor() {
		this.addNode(new XorView(this.config, this));
	}

	addTrue() {
		this.addNode(new TrueView(this.config, this));
	}

	addFalse() {
		this.addNode(new FalseView(this.config, this));
	}

	addNop() {
		this.addNode(new NopView(this.config, this));
	}

	addRandom() {
		this.addNode(new RandomView(this.config, this));
	}

	addButton() {
		this.addNode(new ButtonView(this.config, this));
	}

	addLed() {
		this.addNode(new LedView(this.config, this));
	}

	addPin() {
		this.addNode(new PinView(this.config, this));
	}

	addPackageInput() {
		const name = window.prompt('Input name');
		const id = window.prompt('Input ID ([a-z0-9_]+)');
		const desc = window.prompt('Input description');
		const index = Array.from(this.nodes).filter(n => n.type === 'PackageInput').length;
		this.addNode(new PackageInputView(this.config, this, id, name, desc, index));
	}

	addPackageOutput() {
		const name = window.prompt('Output name');
		const id = window.prompt('Output ID ([a-z0-9_]+)');
		const desc = window.prompt('Output description');
		const index = Array.from(this.nodes).filter(n => n.type === 'PackageOutput').length;
		this.addNode(new PackageOutputView(this.config, this, id, name, desc, index));
	}
}

@autobind
export class CircuitNodesView extends NodesView {
	circuit: CircuitCore;
	nodeViews: NodeView[] = [];
	nodes: Set<のーど>;

	constructor(config: Config, circuit: CircuitCore, svg, w, h) {
		super(config, svg, w, h);
		this.circuit = circuit;
		this.nodes = this.circuit.nodes;
	}

	addNode(nodeView: NodeView) {
		this.circuit.addNode(nodeView.node);
		super.addNode(nodeView);
	}

	removeNode(nodeView: NodeView) {
		this.circuit.removeNode(nodeView.node);
	}
}

@autobind
export class ModuleNodesView extends NodesView {
	module: ModuleView;
	nodeViews: NodeView[] = [];
	nodes: Set<のーど>;

	constructor(config: Config, module: ModuleView, svg, w, h) {
		super(config, svg, w, h);
		this.module = module;
		this.nodes = this.module.node.nodes;
	}

	addNode(nodeView: NodeView) {
		this.module.nodeViews.push(nodeView);
		super.addNode(nodeView);
	}

	removeNode(nodeView: NodeView) {
		this.module.removeNode(nodeView);
	}
}


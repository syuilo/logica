import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import autobind from 'autobind-decorator';

import のーど from '../core/node';
import { Connection } from '../core/node';
import Package from '../core/nodes/package';

import NodesView from './nodes-view';
import Config from './config';
import VirtualNode from '../core/virtual-node';

/*
import { AndView } from './node-views/and';
import { ButtonView } from './node-views/button';
import { LedView } from './node-views/led';
import { PackageInputView } from './node-views/package-input';
import { PackageOutputView } from './node-views/package-output';
import { ModuleView } from './node-views/module';
import PackageInput from '../core/nodes/package-input';
import PackageOutput from '../core/nodes/package-output';*/

@autobind
export abstract class NodeViewModel<T extends のーど = のーど> {
	id: string;

	node: T;

	private _x: number = 0;
	private _y: number = 0;

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	set x(x) {
		this._x = x;
	}

	set y(y) {
		this._y = y;
	}

	/**
	 * この値を操作しないでください
	 *
	 * 0 ... ↑ (default)
	 * 1 ... →
	 * 2 ... ↓
	 * 3 ... ←
	 */
	public rotate: number = 0;

	config: Config;

	constructor(config: Config, node: T) {
		//super();

		//this.setMaxListeners(Infinity);

		this.config = config;
		this.node = node;
	}
/*
	public createView(nodesView: NodesView) {
		if (this.node.type == 'And') return new AndView(this.config, nodesView, this);
		if (isPackageInput(this)) return new PackageInputView(this.config, nodesView, this);
		if (isPackageOutput(this)) return new PackageOutputView(this.config, nodesView, this);
		throw 'unknown type ' + this.node.type;
	}*/
}
/*
const isPackageInput = (vm: NodeViewModel): vm is NodeViewModel<PackageInput> => vm.node.type === 'PackageInput';
const isPackageOutput = (vm: NodeViewModel): vm is NodeViewModel<PackageOutput> => vm.node.type === 'PackageOutput';
*/
// ポートの直径
const diameter = 8;

@autobind
export abstract class NodeView<T extends のーど = のーど> extends EventEmitter {
	viewModel: NodeViewModel<T>;
	el: any;

	inputPorts: any[] = [];
	outputPorts: any[] = [];

	mouseoutTimer = null;

	rect: any;
	removeButton: any;

	/**
	 * このノードビューが所属する回路ビュー(モジュール内部含む)
	 */
	nodesView: NodesView;

	config: Config;

	width: number;
	height: number;

	get x() {
		return this.viewModel.x;
	}

	get y() {
		return this.viewModel.y;
	}

	set x(x) {
		this.viewModel.x = x;
	}

	set y(y) {
		this.viewModel.y = y;
	}

	get rotate() {
		return this.viewModel.rotate;
	}

	set rotate(r) {
		this.viewModel.rotate = r;
	}

	get node() {
		return this.viewModel.node;
	}

	public destroy() {
		this.el.remove();
		this.emit('destroyed');
		this.node.off('connected', this.onNodeConnected);
	}

	public drawWires() {
		// 導線描画
		this.node.outputs.forEach(out => {
			console.log(out);
			const targetView = this.nodesView.nodeViews
				.find(view => view.node == out.to.node);
			console.log(this.nodesView);

			const wire = new Wire(this, out, targetView);
			wire.update();
		});
	}

	constructor(config: Config, nodesView: NodesView, nodeViewModel: NodeViewModel<T>, w: number, h: number) {
		super();

		this.setMaxListeners(Infinity);

		this.config = config;
		this.nodesView = nodesView;
		this.viewModel = nodeViewModel;

		this.width = w;
		this.height = h;

		this.node.on('connected', this.onNodeConnected);

		this.node.once('removed', () => {
			this.destroy();
			this.nodesView.nodeViews = this.nodesView.nodeViews.filter(view => view != this);
		});

		this.el = this.nodesView.draw.nested();

		this.el.element('title').words(this.node.desc);

		this.rect = this.el.rect(this.width, this.height).fill('#355556').radius(6).style('cursor: move;');

		this.rect.dblclick(() => this.setRotate(this.rotate + 1));

		{
			let x;
			let y;
			let otherSelectedNodeViewsPositions = [];

			this.rect.draggable().on('dragstart', e => {
				x = this.x - e.detail.p.x;
				y = this.y - e.detail.p.y;
				otherSelectedNodeViewsPositions = this.nodesView.selectedNodeViews
					.filter(v => v != this)
					.map(v => ({
						v: v,
						x: v.x - e.detail.p.x,
						y: v.y - e.detail.p.y
					}));
			});

			this.rect.draggable().on('dragmove', e => {
				e.preventDefault();
				this.move(x + e.detail.p.x, y + e.detail.p.y);

				// 選択されているほかのノードも移動
				this.nodesView.selectedNodeViews.filter(v => v != this).forEach(v => {
					const base = otherSelectedNodeViewsPositions.find(x => x.v == v);
					v.move(base.x + e.detail.p.x, base.y + e.detail.p.y);
				});
			});
		}

		{
			const removeButtonSize = 12;
			this.removeButton = this.el.circle(removeButtonSize).move(this.width - (removeButtonSize / 2), -(removeButtonSize / 2)).fill('#f00').style('display: none;');
			this.removeButton.click(() => {
				this.nodesView.removeNodeView(this);
			});
		}

		{
			this.rect.on('mouseover', this.onMouseover);

			this.rect.mouseout(() => {
				this.mouseoutTimer = setTimeout(() => {
					this.removeButton.style('display: none;');
					this.rect.on('mouseover', this.onMouseover);
				}, 500);
			});
		}

		if (this.node.hasInputPorts) {
			this.inputPorts = this.node.inputInfo.map((input, i) => ({
				el: this.el.circle(diameter).fill('#0bf1c2').style('stroke-width: 10px; stroke: rgba(11, 241, 194, 0.3);'),
				id: input.id
			}));
		}

		if (this.node.hasOutputPorts) {
			this.outputPorts = this.node.outputInfo.map((output, i) => {
				const o = this.el.circle(diameter).attr({ fill: '#ffa000' }).style('stroke-width: 10px; stroke: rgba(255, 160, 0, 0.3); cursor: crosshair;');
				let line = null;

				o.draggable().on('beforedrag', (e) => {
					e.preventDefault();
					line = this.el.line().stroke({ color: '#627f84', width: 1 }).style('stroke-dasharray: 5; animation: dash 0.5s linear infinite;');
				});

				o.draggable().on('dragmove', function(e) {
					e.preventDefault();
					if (line) {
						line.attr({
							x1: o.x() + (o.width() / 2),
							y1: o.y() + (o.height() / 2),
							x2: e.detail.p.x,
							y2: e.detail.p.y
						});
					}
				});

				o.draggable().on('dragend', (e) => {
					line.remove();
					const x = this.x + e.detail.p.x;
					const y = this.y + e.detail.p.y;

					let target: {
						view: NodeView;
						portId: any;
					} = null;

					this.nodesView.nodeViews.some(view => {
						const asobi = 12;
						const nearPort = view.inputPorts.find(p =>
							(p.el.x() + view.x - asobi) < x &&
							(p.el.y() + view.y - asobi) < y &&
							(p.el.x() + view.x) + p.el.width() + asobi > x &&
							(p.el.y() + view.y) + p.el.height() + asobi > y);

						if (nearPort) {
							target = {
								view: view,
								portId: nearPort.id
							};
							return true;
						} else {
							return false;
						}
					});

					if (!target) {
						const nearView = this.nodesView.nodeViews.find(v =>
							v.x < x &&
							v.y < y &&
							v.x + v.width > x &&
							v.y + v.height > y);

						if (nearView) {
							target = {
								view: nearView,
								portId: null
							};
						}
					}

					if (target) {
						this.node.connectTo(target.view.node, target.portId, output.id);
					}
				});

				return {
					el: o,
					id: output.id
				};
			});
		}

		this.el.move(this.x, this.y);
		this.updatePortPosition();
	}

	public drawSelected() {
		this.rect.stroke({
			color: '#00ff72',
			width: 2
		});
	}

	public drawUnSelected() {
		this.rect.stroke({
			width: 0
		});
	}

	/**
	 * このノードがノードに繋がれた時
	 * @param connection 接続
	 */
	private onNodeConnected(connection: Connection) {
		/**********************************************************
		 * 導線要素を作成
		 **********************************************************/

		const targetView = this.nodesView.nodeViews
			.find(view => view.node == connection.to.node);

		const wire = new Wire(this, connection, targetView);
		wire.update();
	}

	/**
	 * 移動します
	 * @param x X位置
	 * @param y Y位置
	 */
	public move(x: number, y: number) {
		if (this.config.snapToGrid) {
			const gridSize = 16;
			x = Math.round(x / gridSize) * gridSize;
			y = Math.round(y / gridSize) * gridSize;
		}

		if (x !== this.x || y !== this.y) {
			this.el.move(x, y);
			this.x = x;
			this.y = y;
			this.emit('moved');
		}
	}

	/**
	 * 回転します
	 * @param r 0~4
	 */
	public setRotate(r: number) {
		if (r > 3) r = 0;
		if (this.rotate !== r) {
			this.rect.attr({
				width: this.height,
				height: this.width
			});
			const w = this.width;
			const h = this.height;
			this.width = h;
			this.height = w;
		}
		this.rotate = r;
		this.updatePortPosition();
		this.emit('moved');
	}

	private updatePortPosition() {
		this.inputPorts.forEach((p, i) => {
			let x: number;
			let y: number;
			switch (this.rotate) {
				case 0:
					x = -(diameter / 2);
					y = ((i + 1) / (this.node.inputInfo.length + 1) * this.height) - (diameter / 2);
					break;
				case 1:
					x = ((i + 1) / (this.node.inputInfo.length + 1) * this.width) - (diameter / 2);
					y = -(diameter / 2);
					break;
				case 2:
					x = this.width - (diameter / 2);
					y = ((i + 1) / (this.node.inputInfo.length + 1) * this.height) - (diameter / 2);
					break;
				case 3:
					x = ((i + 1) / (this.node.inputInfo.length + 1) * this.width) - (diameter / 2);
					y = this.height - (diameter / 2);
					break;
			}
			p.el.move(x, y);
		});

		this.outputPorts.forEach((p, i) => {
			let x: number;
			let y: number;
			switch (this.rotate) {
				case 0:
					x = this.width - (diameter / 2);
					y = ((i + 1) / (this.node.outputInfo.length + 1) * this.height) - (diameter / 2);
					break;
				case 1:
					x = ((i + 1) / (this.node.outputInfo.length + 1) * this.width) - (diameter / 2);
					y = this.height - (diameter / 2);
					break;
				case 2:
					x = -(diameter / 2);
					y = ((i + 1) / (this.node.outputInfo.length + 1) * this.height) - (diameter / 2);
					break;
				case 3:
					x = ((i + 1) / (this.node.outputInfo.length + 1) * this.width) - (diameter / 2);
					y = -(diameter / 2);
					break;
			}
			p.el.move(x, y);
		});
	}

	public onMouseover() {
		this.removeButton.style('display: block; cursor: pointer;');
		this.rect.off('mouseover', this.onMouseover);
		if (this.mouseoutTimer) clearTimeout(this.mouseoutTimer);
	}
}

/**
 * 導線
 */
@autobind
class Wire {
	private inactiveCoverColor = 'transparent';
	private inactiveLineColor = '#627f84';
	private activeCoverColor = 'rgba(34, 111, 50, 0.3)';
	private activeLineColor = '#7aff00';

	private parent: NodeView;
	private connection: Connection;
	private targetView: NodeView;
	private state: boolean;

	private coverElement: any;
	private lineElement: any;

	constructor(parent: NodeView, connection: Connection, targetView: NodeView) {
		this.parent = parent;
		this.connection = connection;
		this.targetView = targetView;

		this.coverElement = this.parent.nodesView.draw
			.path()
			.stroke({ width: 8 })
			.style('cursor: pointer;');

		this.lineElement = this.parent.nodesView.draw
			.path()
			.stroke({ width: 2 })
			.style('pointer-events: none;');

		//let text;

		this.coverElement.mouseover(() => {
			this.lineElement.stroke({ color: '#f00' });

			/*const from = this.node.type === 'Package' ? (this.node as Package).packageName : this.node.type;
			const to = c.node.type === 'Package' ? (c.node as Package).packageName : c.node.type;
			text = this.circuitView.draw
				.text(`${ from }:${ c.from } --> ${ to }:${ c.to }`)
				.fill('#fff')
				.move(((lineStartX + lineEndX) / 2), ((lineStartY + lineEndY) / 2))
				.style('pointer-events: none;');*/
		});

		this.coverElement.mouseout(() => {
			this.lineElement.stroke({ color: this.currentStateLineColor });
			//text.remove();
		});

		this.coverElement.click(() => {
			this.connection.destroy();
			//text.remove();
		});
/*
		if (this.parent instanceof VirtualNode) {
			this.parent.get
		}*/

		this.parent.on('moved', this.render);
		this.parent.node.on('state-updated', this.update);
		this.parent.node.on('disconnected', this.onParentNodeDisconnected);
		this.parent.node.on('removed', this.dispose);
		this.targetView.on('moved', this.render);
		this.targetView.on('destroyed', this.dispose);
	}

	private onParentNodeDisconnected(connection) {
		if (this.connection === connection) {
			this.dispose();
		}
	}

	public update() {
		this.state = this.parent.node.getState(this.connection.from.port);
		this.render();
	}

	public render() {
		const outputPortIndex = this.parent.node.outputInfo.findIndex(info => this.connection.from.port === info.id);
		const inputPortIndex = this.targetView.node.inputInfo.findIndex(info => this.connection.to.port === info.id);
		const lineStartX = this.parent.viewModel.x + this.parent.outputPorts[outputPortIndex].el.x() + (this.parent.outputPorts[outputPortIndex].el.width() / 2);
		const lineStartY = this.parent.viewModel.y + this.parent.outputPorts[outputPortIndex].el.y() + (this.parent.outputPorts[outputPortIndex].el.height() / 2);
		const lineEndX = this.targetView.viewModel.x + this.targetView.inputPorts[inputPortIndex].el.x() + (this.targetView.inputPorts[inputPortIndex].el.width() / 2);
		const lineEndY = this.targetView.viewModel.y + this.targetView.inputPorts[inputPortIndex].el.y() + (this.targetView.inputPorts[inputPortIndex].el.height() / 2);

		this.coverElement
			.attr('d', `M${lineStartX},${lineStartY} L${lineEndX},${lineEndY}`)
			.stroke({ color: this.currentStateCoverColor, width: 8 });

		this.lineElement
			.attr('d', `M${lineStartX},${lineStartY} L${lineEndX},${lineEndY}`)
			.stroke({ color: this.currentStateLineColor, width: 2 })
			.style(`stroke-dasharray: 5; animation: dash ${ this.state ? '0.5' : '1' }s linear infinite;`);
	}

	private get currentStateCoverColor() {
		return this.state ? this.activeCoverColor : this.inactiveCoverColor;
	}

	private get currentStateLineColor() {
		return this.state ? this.activeLineColor : this.inactiveLineColor;
	}

	public dispose() {
		this.coverElement.remove();
		this.lineElement.remove();

		this.parent.off('moved', this.render);
		this.parent.node.off('state-updated', this.update);
		this.parent.node.off('disconnected', this.onParentNodeDisconnected);
		this.parent.node.off('removed', this.dispose);
		this.targetView.off('moved', this.render);
		this.targetView.off('destoryed', this.dispose);
	}
}

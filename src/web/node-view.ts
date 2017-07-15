import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import autobind from 'autobind-decorator';

import のーど from '../core/node';
import { connection } from '../core/node';
import Package from '../core/nodes/package';

import CircuitView from './circuit-view';

// ポートの直径
const diameter = 8;

@autobind
abstract class NodeView extends EventEmitter {
	id: string;

	node: のーど;

	el: any;

	private width: number;
	private height: number;

	get x() {
		return this.el.x();
	}

	get y() {
		return this.el.y();
	}

	set x(x) {
		this.el.x(x);
	}

	set y(y) {
		this.el.y(y);
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

	inputPorts: any[] = [];
	outputPorts: any[] = [];

	mouseoutTimer = null;

	rect: any;
	removeButton: any;
	circuitView: CircuitView;

	constructor(circuitView: CircuitView, node: のーど, w: number, h: number) {
		super();

		this.setMaxListeners(Infinity);

		this.circuitView = circuitView;
		this.node = node;

		node.on('connected', this.onNodeConnected);

		node.on('removed', () => {
			this.el.remove();
			this.circuitView.nodeViews = this.circuitView.nodeViews.filter(view => view != this);
		});

		this.width = w;
		this.height = h;

		this.el = this.circuitView.draw.nested();

		this.el.element('title').words(this.node.desc);

		this.rect = this.el.rect(this.width, this.height).fill('#355556').radius(6).style('cursor: move;');

		this.rect.dblclick(() => this.setRotate(this.rotate + 1));

		{
			let x;
			let y;

			this.rect.draggable().on('dragstart', e => {
				x = this.x - e.detail.p.x;
				y = this.y - e.detail.p.y;
			});

			this.rect.draggable().on('dragmove', e => {
				e.preventDefault();
				this.move(x + e.detail.p.x, y + e.detail.p.y);
			});
		}

		{
			const removeButtonSize = 12;
			this.removeButton = this.el.circle(removeButtonSize).move(this.width - (removeButtonSize / 2), -(removeButtonSize / 2)).fill('#f00').style('display: none;');
			this.removeButton.click(() => {
				this.circuitView.circuit.removeNode(this.node);
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

		if (node.hasInputPorts) {
			this.inputPorts = node.inputInfo.map((input, i) => ({
				el: this.el.circle(diameter).fill('#0bf1c2').style('stroke-width: 10px; stroke: rgba(11, 241, 194, 0.3);'),
				id: input.id
			}));
		}

		if (node.hasOutputPorts) {
			this.outputPorts = node.outputInfo.map((output, i) => {
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

					let target: any = null;

					this.circuitView.nodeViews.some(view => {
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
						const nearView = this.circuitView.nodeViews.find(t =>
							t.x < x &&
							t.y < y &&
							t.x + t.width > x &&
							t.y + t.height > y);

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

		this.updatePortPosition();
	}

	/**
	 * このノードがノードに繋がれた時
	 * @param connection 接続
	 */
	private onNodeConnected(connection: connection) {
		/**********************************************************
		 * 導線要素を作成
		 **********************************************************/

		const targetView = this.circuitView.nodeViews
			.find(view => view.node == connection.node);

		const wire = new Wire(this, connection, targetView);
		wire.update();
	}

	/**
	 * 移動します
	 * @param x X位置
	 * @param y Y位置
	 */
	public move(x: number, y: number) {
		if (this.circuitView.snapToGrid) {
			const gridSize = 16;
			x = Math.round(x / gridSize) * gridSize;
			y = Math.round(y / gridSize) * gridSize;
		}
		this.el.move(x, y);
		this.emit('moved');
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

export default NodeView;

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
	private connection: connection;
	private targetView: NodeView;
	private state: boolean;

	private coverElement: any;
	private lineElement: any;

	constructor(panrent: NodeView, connection: connection, targetView: NodeView) {
		this.parent = panrent;
		this.connection = connection;
		this.targetView = targetView;

		this.coverElement = this.parent.circuitView.draw
			.path()
			.stroke({ width: 8 })
			.style('cursor: pointer;');

		this.lineElement = this.parent.circuitView.draw
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
			this.parent.node.disconnectTo(this.targetView.node, this.connection.to, this.connection.from);
			//text.remove();
		});

		this.parent.on('moved', this.render);
		this.parent.node.on('state-updated', this.update);
		this.parent.node.on('disconnected', this.onParentNodeDisconnected);
		this.parent.node.on('removed', this.dispose);
		this.targetView.on('moved', this.render);
		this.connection.node.on('removed', this.dispose);
	}

	private onParentNodeDisconnected(target, targetPortId, myPortId) {
		if (target === this.connection.node && targetPortId === this.connection.to && myPortId === this.connection.from) {
			this.dispose();
		}
	}

	public update() {
		this.state = this.parent.node.getState(this.connection.from);
		this.render();
	}

	public render() {
		const outputPortIndex = this.parent.node.outputInfo.findIndex(info => this.connection.from === info.id);
		const inputPortIndex = this.targetView.node.inputInfo.findIndex(info => this.connection.to === info.id);
		const lineStartX = this.parent.x + this.parent.outputPorts[outputPortIndex].el.x() + (this.parent.outputPorts[outputPortIndex].el.width() / 2);
		const lineStartY = this.parent.y + this.parent.outputPorts[outputPortIndex].el.y() + (this.parent.outputPorts[outputPortIndex].el.height() / 2);
		const lineEndX = this.targetView.x + this.targetView.inputPorts[inputPortIndex].el.x() + (this.targetView.inputPorts[inputPortIndex].el.width() / 2);
		const lineEndY = this.targetView.y + this.targetView.inputPorts[inputPortIndex].el.y() + (this.targetView.inputPorts[inputPortIndex].el.height() / 2);

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
		this.connection.node.off('removed', this.dispose);
	}
}

import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import autobind from 'autobind-decorator';

import のーど from '../core/node';
import Package from '../core/nodes/package';

import CircuitView from './circuit-view';

@autobind
abstract class NodeView extends EventEmitter {
	id: string;

	node: のーど;

	el: any;

	width: number;
	height: number;

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

	outputs: any[] = [];

	lines: any[] = [];

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

		node.on('state-updated', () => {
			this.drawLines();
		});

		node.on('connected', c => {
			const targetView = this.circuitView.nodeViews.find(view => view.node == c.node);
			this.outputs.push({
				view: targetView,
				connection: c
			});
			this.drawLines();
			targetView.on('move', this.drawLines);
			c.node.on('removed', () => {
				this.outputs = this.outputs.filter(o => o.connection.node != c.node);
				this.drawLines();
			});
		});

		node.on('disconnected', (target, targetPortId, myPortId) => {
			const targetView = this.circuitView.nodeViews.find(view => view.node == target);
			this.outputs = this.outputs.filter(o => !(o.connection.node == targetView.node && o.connection.from == myPortId && o.connection.to == targetPortId));
			this.drawLines();
			targetView.off('move', this.drawLines);
		});

		node.on('removed', () => {
			this.outputs.forEach(o => {
				o.view.off('move', this.drawLines);
			});
			this.outputs = [];
			this.lines.forEach(l => l.remove());
			this.lines = [];
			this.el.remove();
			this.circuitView.nodeViews = this.circuitView.nodeViews.filter(view => view != this);
		});

		this.width = w;
		this.height = h;

		this.el = this.circuitView.draw.nested();

		this.el.element('title').words(this.node.desc);

		this.rect = this.el.rect(this.width, this.height).fill('#355556').radius(6).style('cursor: move;');

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
				this.emit('move');
				this.drawLines();
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

		const diameter = 8;

		if (node.inputInfo) {
			node.inputInfo.forEach((input, i) => {
				const x = -(diameter / 2);
				const y = ((i + 1) / (node.inputInfo.length + 1) * this.height) - (diameter / 2);
				this.inputPorts.push({
					el: this.el.circle(diameter).move(x, y).fill('#0bf1c2').style('stroke-width: 10px; stroke: rgba(11, 241, 194, 0.3);'),
					id: input.id
				});
			});
		}

		if (node.outputInfo) {
			node.outputInfo.forEach((output, i) => {
				const x = this.width - (diameter / 2);
				const y = ((i + 1) / (node.outputInfo.length + 1) * this.height) - (diameter / 2);
				const o = this.el.circle(diameter).move(x, y).attr({ fill: '#ffa000' }).style('stroke-width: 10px; stroke: rgba(255, 160, 0, 0.3); cursor: crosshair;');
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

				this.outputPorts.push({
					el: o,
					id: output.id
				});
			});
		}
	}

	public move(x: number, y: number) {
		if (this.circuitView.snapToGrid) {
			const gridSize = 16;
			x = Math.round(x / gridSize) * gridSize;
			y = Math.round(y / gridSize) * gridSize;
		}
		this.el.move(x, y);
	}

	public onMouseover() {
		this.removeButton.style('display: block; cursor: pointer;');
		this.rect.off('mouseover', this.onMouseover);
		if (this.mouseoutTimer) clearTimeout(this.mouseoutTimer);
	}

	drawLines() {
		this.lines.forEach(l => l.remove());
		this.outputs.forEach(o => {
			const outputPortIndex = this.node.outputInfo.findIndex(info => o.connection.from === info.id);
			const inputPortIndex = o.view.node.inputInfo.findIndex(info => o.connection.to === info.id);
			const lineStartX = this.x + this.outputPorts[outputPortIndex].el.x() + (this.outputPorts[outputPortIndex].el.width() / 2);
			const lineStartY = this.y + this.outputPorts[outputPortIndex].el.y() + (this.outputPorts[outputPortIndex].el.height() / 2);
			const lineEndX = o.view.x + o.view.inputPorts[inputPortIndex].el.x() + (o.view.inputPorts[inputPortIndex].el.width() / 2);
			const lineEndY = o.view.y + o.view.inputPorts[inputPortIndex].el.y() + (o.view.inputPorts[inputPortIndex].el.height() / 2);

			const state = this.node.getState(o.connection.from);

			let line;
			let cover;
			const lineColor = state ? '#7aff00' : '#627f84';

			if (state) {
				this.lines.push(cover = this.circuitView.draw.path(`M${lineStartX},${lineStartY} L${lineEndX},${lineEndY}`)
					.stroke({ color: 'rgba(34, 111, 50, 0.3)', width: 8 }).style('cursor: pointer;'));

				this.lines.push(line = this.circuitView.draw.path(`M${lineStartX},${lineStartY} L${lineEndX},${lineEndY}`)
					.stroke({ color: lineColor, width: 2 })
					.style('stroke-dasharray: 5; animation: dash 0.5s linear infinite; pointer-events: none;'));
			} else {
				this.lines.push(cover = this.circuitView.draw.path(`M${lineStartX},${lineStartY} L${lineEndX},${lineEndY}`)
					.stroke({ color: 'transparent', width: 8 }).style('cursor: pointer;'));

				this.lines.push(line = this.circuitView.draw.path(`M${lineStartX},${lineStartY} L${lineEndX},${lineEndY}`)
					.stroke({ color: lineColor, width: 2 })
					.style('stroke-dasharray: 5; animation: dash 1s linear infinite; pointer-events: none;'));
			}

			let text;

			cover.mouseover(() => {
				line.stroke({ color: '#f00' });

				const from = this.node.type === 'Package' ? (this.node as Package).packageName : this.node.type;
				const to = o.connection.node.type === 'Package' ? (o.connection.node as Package).packageName : o.connection.node.type;
				text = this.circuitView.draw
					.text(`${ from }:${ o.connection.from } --> ${ to }:${ o.connection.to }`)
					.fill('#fff')
					.move(((lineStartX + lineEndX) / 2), ((lineStartY + lineEndY) / 2))
					.style('pointer-events: none;');
			});

			cover.mouseout(() => {
				line.stroke({ color: lineColor });
				text.remove();
			});

			cover.click(() => {
				this.node.disconnectTo(o.view.node, o.connection.to, o.connection.from);
				text.remove();
			});
		});
	}
}

export default NodeView;

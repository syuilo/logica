import * as riot from 'riot';

import のーど from '../core/node';

export default abstract class NodeTag {
	node: のーど;

	draw: any;

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

	constructor(draw, tags, node, w, h) {
		riot.observable(this);

		this.node = node;

		node.on('stateUpdated', () => {
			this.drawLines();
		});

		this.draw = draw;

		this.width = w;
		this.height = h;

		this.el = draw.nested();
		this.el.draggable().on('dragmove', () => {
			(this as any).trigger('move');
			this.drawLines();
		});

		this.el.element('title').words(this.node.desc);

		this.el.rect(this.width, this.height).fill('#355556').radius(6).style('cursor: move;');

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

					tags.some(tag => {
						const asobi = 12;
						const nearPort = tag.inputPorts.find(p =>
							(p.el.x() + tag.x - asobi) < x &&
							(p.el.y() + tag.y - asobi) < y &&
							(p.el.x() + tag.x) + p.el.width() + asobi > x &&
							(p.el.y() + tag.y) + p.el.height() + asobi > y);

						if (nearPort) {
							target = {
								tag: tag,
								portId: nearPort.id
							};
							return true;
						} else {
							return false;
						}
					});

					if (!target) {
						const nearTag = tags.find(t =>
							t.x < x &&
							t.y < y &&
							t.x + t.width > x &&
							t.y + t.height > y);

						if (nearTag) {
							target = {
								tag: nearTag,
								portId: null
							};
						}
					}

					if (target) {
						this.connectTo(target.tag, target.portId, output.id);
					}
				});

				this.outputPorts.push({
					el: o,
					id: output.id
				});
			});
		}
	}

	connectTo(targetTag, targetPortId, myPortId) {
		const c = this.node.connectTo(targetTag.node, targetPortId, myPortId);
		this.outputs.push({
			tag: targetTag,
			connection: c
		});
		this.drawLines();
		targetTag.on('move', this.drawLines());
	}

	disconnectTo(targetTag, targetPortId, myPortId) {
		this.node.disconnectTo(targetTag.node, targetPortId, myPortId);
		this.outputs = this.outputs.filter(o => !(o.connection.node == targetTag.node && o.connection.from == myPortId && o.connection.to == targetPortId));
		this.drawLines();
		targetTag.off('move', this.drawLines());
	}

	drawLines() {
		this.lines.forEach(l => l.remove());
		this.outputs.forEach(o => {
			const outputPortIndex = this.node.outputInfo.findIndex(info => o.connection.from === info.id);
			const inputPortIndex = o.tag.node.inputInfo.findIndex(info => o.connection.to === info.id);
			const lineStartX = this.x + this.outputPorts[outputPortIndex].el.x() + (this.outputPorts[outputPortIndex].el.width() / 2);
			const lineStartY = this.y + this.outputPorts[outputPortIndex].el.y() + (this.outputPorts[outputPortIndex].el.height() / 2);
			const lineEndX = o.tag.x + o.tag.inputPorts[inputPortIndex].el.x() + (o.tag.inputPorts[inputPortIndex].el.width() / 2);
			const lineEndY = o.tag.y + o.tag.inputPorts[inputPortIndex].el.y() + (o.tag.inputPorts[inputPortIndex].el.height() / 2);

			let line;
			let cover;
			const lineColor = this.node.getState(o.connection.from) ? '#7aff00' : '#627f84';

			if (this.node.getState(o.connection.from)) {
				this.lines.push(cover = this.draw.path(`M${lineStartX},${lineStartY} L${lineEndX},${lineEndY}`)
					.stroke({ color: 'rgba(34, 111, 50, 0.3)', width: 8 }).style('cursor: pointer;'));

				this.lines.push(line = this.draw.path(`M${lineStartX},${lineStartY} L${lineEndX},${lineEndY}`)
					.stroke({ color: lineColor, width: 2 })
					.style('stroke-dasharray: 5; animation: dash 0.5s linear infinite; pointer-events: none;'));
			} else {
				this.lines.push(cover = this.draw.path(`M${lineStartX},${lineStartY} L${lineEndX},${lineEndY}`)
					.stroke({ color: 'transparent', width: 8 }).style('cursor: pointer;'));

				this.lines.push(line = this.draw.path(`M${lineStartX},${lineStartY} L${lineEndX},${lineEndY}`)
					.stroke({ color: lineColor, width: 2 })
					.style('stroke-dasharray: 5; animation: dash 1s linear infinite; pointer-events: none;'));
			}

			cover.mouseover(() => {
				line.stroke({ color: '#f00' });
			});

			cover.mouseout(() => {
				line.stroke({ color: lineColor });
			});

			cover.click(() => {
				this.disconnectTo(o.tag, o.connection.to, o.connection.from);
			});
		});
	}
}

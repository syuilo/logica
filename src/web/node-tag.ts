import * as riot from 'riot';

import のーど from '../core/node';

export default class NodeTag {
	node: のーど;

	el: any;

	width = 64;
	height = 64;

	get x() {
		return this.el.x();
	}

	get y() {
		return this.el.y();
	}

	outputs: any[] = [];

	lines: any[] = [];

	inputPorts: any[] = [];

	constructor(draw, tags, node) {
		riot.observable(this);

		this.node = node;

		node.on('updated', () => {
			console.log('yo');
			this.drawLines();
		});

		this.el = draw.nested();
		this.el.draggable().on('dragmove', () => {
			(this as any).trigger('move');
			this.drawLines();
		});
		this.el.rect(this.width, this.height).fill('#3be295').radius(6);

		this.el.text(node.type);

		if (node.inputInfo) {
			node.inputInfo.forEach((input, i) => {
				this.inputPorts.push({
					el: this.el.rect(8, 8).move(0, i / node.inputInfo.length * this.height).fill('#f5de3c'),
					id: input.id
				});
			});
		}

		if (node.outputInfo) {
			node.outputInfo.forEach((output, i) => {
				const o = this.el.rect(8, 8).move(this.width - 8, i / node.outputInfo.length * this.height).attr({ fill: '#f5de3c' });
				let line = null;
				o.draggable().on('beforedrag', (e) => {
					e.preventDefault();
					line = this.el.line().stroke({ width: 1 });
				});
				o.draggable().on('dragmove', function(e) {
					e.preventDefault();
					if (line) {
					line.attr({
						x1: o.x(),
						y1: o.y(),
						x2: e.detail.p.x,
						y2: e.detail.p.y
					});}
				});
				o.draggable().on('dragend', (e) => {
					line.remove();
					const x = this.x + e.detail.p.x;
					const y = this.y + e.detail.p.y;

					draw.select('.input-port').find

					let target: any = null;

					tags.some(tag => {
						const asobi = 12;
						const nearPort = tag.inputPorts.find(p => (p.el.x() + tag.x - asobi) < x && (p.el.y() + tag.y - asobi) < y && (p.el.x() + tag.x) + p.el.width() + asobi > x && (p.el.y() + tag.y) + p.el.height() + asobi > y);
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
						const nearTag = tags.find(t => t.x < x && t.y < y && t.x + t.width > x && t.y + t.height > y);
						if (nearTag) {
							target = {
								tag: nearTag,
								portId: null
							};
						}
					}

					console.log(target);

					if (target) {
						const c = this.node.connectTo(target.tag.node, target.portId);
						this.outputs.push({
							tag: target.tag,
							connection: c
						});
						this.drawLines();
						target.tag.on('move', () => {
							this.drawLines();
						});
					}
				});
			});
		}
	}

	drawLines() {
		this.lines.forEach(l => l.remove());
		this.outputs.forEach(o => {
			console.log(this.node.getState(o.connection.from));
			const outputPortIndex = this.node.outputInfo.findIndex(info => o.connection.from === info.id);
			const inputPortIndex = o.tag.node.inputInfo.findIndex(info => o.connection.to === info.id);
			const lineStartX = this.width;
			const lineStartY = outputPortIndex / this.node.outputInfo.length * this.height;
			const lineEndX = o.tag.x - this.x;
			const lineEndY = o.tag.y + (inputPortIndex / o.tag.node.inputInfo.length * o.tag.height) - this.y;
			this.lines.push(this.el.path(`M${lineStartX},${lineStartY} L${lineEndX},${lineEndY}`)
				.stroke({ color: this.node.getState(o.connection.from) ? '#f00' : '#000', width: 2 })
				.style('stroke-dasharray: 5; animation: dash 1s linear infinite;'));
		});
	}
}

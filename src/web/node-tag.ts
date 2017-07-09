export default class NodeTag {
	node: any;

	el: any;

	width = 64;
	height = 64;

	get x() {
		return this.el.x();
	}

	get y() {
		return this.el.y();
	}

	constructor(draw, tags, node) {
		this.node = node;

		this.el = draw.nested();
		this.el.draggable();
		this.el.rect(this.width, this.height).attr({ fill: '#3be295' });

		this.el.text(node.type);

		node.inputInfo.forEach((input, i) => {
			this.el.rect(8, 8).move(0, i / node.inputInfo.length * this.height).attr({ fill: '#f5de3c' });
		});

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
				const x = this.x + e.detail.p.x;
				const y = this.y + e.detail.p.y;
				const target = tags.find(t => t.x < x && t.y < y && t.x + t.width > x && t.y + t.height > y);
				console.log(target);
			});
		});

	}
}

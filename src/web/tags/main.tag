<lo-main>
	<button onclick={ addAnd }>And</button>
	<div ref="drawing"></div>
	<script>
		import SVG from 'svg.js';
		require('svg.draggable.js');

		import Circuit from '../../core/circuit.ts';

		import And from '../../core/nodes/gates/and.ts';

		this.circuit = new Circuit();

		this.on('mount', () => {
			this.draw = SVG(this.refs.drawing).size(1000, 1000);
			//this.draw.rect(100, 100).attr({ fill: '#f06' });
		});

		this.createNodeTag = node => {
			let x = 0;
			let y = 0;
			let width = 64;
			let height = 64;

			const el = this.draw.nested();
			el.draggable();
			el.rect(width, height).attr({ fill: '#3be295' });

			el.text(node.type);

			node.inputInfo.forEach((input, i) => {
				el.rect(8, 8).move(0, i / node.inputInfo.length * height).attr({ fill: '#f5de3c' });
			});

			node.outputInfo.forEach((output, i) => {
				const o = el.rect(8, 8).move(width - 8, i / node.outputInfo.length * height).attr({ fill: '#f5de3c' });
				let line = null;
				o.draggable().on('beforedrag', (e) => {
					e.preventDefault();
					line = el.line().stroke({ width: 1 });
				})
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
			});


/*

			const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			text.setAttribute('x', 8);
			text.setAttribute('y', 16);
			text.innerHTML = node.type;
			g.appendChild(text);

			const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
			title.innerHTML = node.desc;
			g.appendChild(title);
*/
			return el;
		};

		this.addAnd = () => {
			const and = new And();

			this.createNodeTag(and);
		};

	</script>
</lo-main>

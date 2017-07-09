<lo-main>
	<button onclick={ addAnd }>And</button>
	<button onclick={ addButton }>Button</button>
	<div ref="drawing"></div>
	<script>
		import SVG from 'svg.js';
		require('svg.draggable.js');

		import Circuit from '../../core/circuit.ts';

		import And from '../../core/nodes/gates/and.ts';
		import Button from '../../core/nodes/button.ts';

		import NodeTag from '../node-tag.ts';
		import ButtonTag from '../button-tag.ts';

		this.nodeTags = [];

		this.circuit = new Circuit();

		this.on('mount', () => {
			this.draw = SVG(this.refs.drawing).size(1000, 1000);
			//this.draw.rect(100, 100).attr({ fill: '#f06' });

			setInterval(() => {
				this.circuit.tick();
			}, 100);
		});

		this.addAnd = () => {
			const and = new And();

			this.nodeTags.push(new NodeTag(this.draw, this.nodeTags, and));

			this.circuit.addNode(and);
		};

		this.addButton = () => {
			const button = new Button();

			this.nodeTags.push(new ButtonTag(this.draw, this.nodeTags, button));

			this.circuit.addNode(button);
		};
	</script>
</lo-main>

<lo-main>
	<button onclick={ addAnd }>And</button>
	<div ref="drawing"></div>
	<script>
		import SVG from 'svg.js';
		require('svg.draggable.js');

		import Circuit from '../../core/circuit.ts';

		import And from '../../core/nodes/gates/and.ts';

		import NodeTag from '../node-tag.ts';

		this.nodeTags = [];

		this.circuit = new Circuit();

		this.on('mount', () => {
			this.draw = SVG(this.refs.drawing).size(1000, 1000);
			//this.draw.rect(100, 100).attr({ fill: '#f06' });
		});

		this.addAnd = () => {
			const and = new And();

			this.nodeTags.push(new NodeTag(this.draw, this.nodeTags, and));
		};

	</script>
</lo-main>

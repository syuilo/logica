<lo-main>
	<button onclick={ addAnd }>And</button>
	<button onclick={ addOr }>Or</button>
	<button onclick={ addNot }>Not</button>
	<button onclick={ addButton }>Button</button>
	<div ref="drawing"></div>
	<script>
		import SVG from 'svg.js';
		require('svg.draggable.js');

		import Circuit from '../../core/circuit.ts';

		import And from '../../core/nodes/gates/and.ts';
		import Or from '../../core/nodes/gates/or.ts';
		import Not from '../../core/nodes/gates/not.ts';
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

		this.addOr = () => {
			const or = new Or();

			this.nodeTags.push(new NodeTag(this.draw, this.nodeTags, or));

			this.circuit.addNode(or);
		};

		this.addNot = () => {
			const not = new Not();

			this.nodeTags.push(new NodeTag(this.draw, this.nodeTags, not));

			this.circuit.addNode(not);
		};

		this.addButton = () => {
			const button = new Button();

			this.nodeTags.push(new ButtonTag(this.draw, this.nodeTags, button));

			this.circuit.addNode(button);
		};
	</script>
</lo-main>

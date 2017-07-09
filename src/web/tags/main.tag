<lo-main>
	<button onclick={ addAnd }>And</button>
	<button onclick={ addAnd3 }>And3</button>
	<button onclick={ addOr }>Or</button>
	<button onclick={ addNot }>Not</button>
	<button onclick={ addNop }>Nop</button>
	<button onclick={ addButton }>Button</button>
	<button onclick={ addLed }>LED</button>
	<div ref="drawing"></div>
	<script>
		import SVG from 'svg.js';
		require('svg.draggable.js');

		import Circuit from '../../core/circuit.ts';

		import And from '../../core/nodes/gates/and.ts';
		import And3 from '../../core/nodes/gates/and3.ts';
		import Or from '../../core/nodes/gates/or.ts';
		import Not from '../../core/nodes/gates/not.ts';
		import Nop from '../../core/nodes/gates/nop.ts';
		import Button from '../../core/nodes/button.ts';
		import Led from '../../core/nodes/led.ts';

		import AndTag from '../node-tags/and.ts';
		import And3Tag from '../node-tags/and3.ts';
		import OrTag from '../node-tags/or.ts';
		import NotTag from '../node-tags/not.ts';
		import NopTag from '../node-tags/nop.ts';
		import ButtonTag from '../node-tags/button.ts';
		import LedTag from '../node-tags/led.ts';

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

			this.nodeTags.push(new AndTag(this.draw, this.nodeTags, and));

			this.circuit.addNode(and);
		};

		this.addAnd3 = () => {
			const and3 = new And3();

			this.nodeTags.push(new And3Tag(this.draw, this.nodeTags, and3));

			this.circuit.addNode(and3);
		};

		this.addOr = () => {
			const or = new Or();

			this.nodeTags.push(new OrTag(this.draw, this.nodeTags, or));

			this.circuit.addNode(or);
		};

		this.addNot = () => {
			const not = new Not();

			this.nodeTags.push(new NotTag(this.draw, this.nodeTags, not));

			this.circuit.addNode(not);
		};

		this.addNop = () => {
			const nop = new Nop();

			this.nodeTags.push(new NotTag(this.draw, this.nodeTags, nop));

			this.circuit.addNode(nop);
		};

		this.addButton = () => {
			const button = new Button();

			this.nodeTags.push(new ButtonTag(this.draw, this.nodeTags, button));

			this.circuit.addNode(button);
		};

		this.addLed = () => {
			const led = new Led();

			this.nodeTags.push(new LedTag(this.draw, this.nodeTags, led));

			this.circuit.addNode(led);
		};
	</script>
</lo-main>

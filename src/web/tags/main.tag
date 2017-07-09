<lo-main>
	<button onclick={ addAnd }>And</button>
	<button onclick={ addAnd3 }>And3</button>
	<button onclick={ addOr }>Or</button>
	<button onclick={ addNot }>Not</button>
	<button onclick={ addNop }>Nop</button>
	<button onclick={ addButton }>Button</button>
	<button onclick={ addLed }>LED</button>
	<button onclick={ addPin }>Pin</button>
	<span>---</span>
	<button onclick={ import }>Import</button>
	<button onclick={ export }>Export</button>
	<div ref="drawing"></div>
	<script>
		import SVG from 'svg.js';
		require('svg.draggable.js');

		const msgpack = require('msgpack-lite');

		import Circuit from '../../core/circuit.ts';

		import And from '../../core/nodes/gates/and.ts';
		import And3 from '../../core/nodes/gates/and3.ts';
		import Or from '../../core/nodes/gates/or.ts';
		import Not from '../../core/nodes/gates/not.ts';
		import Nop from '../../core/nodes/gates/nop.ts';
		import Button from '../../core/nodes/button.ts';
		import Led from '../../core/nodes/led.ts';
		import Pin from '../../core/nodes/pin.ts';

		import AndTag from '../node-tags/and.ts';
		import And3Tag from '../node-tags/and3.ts';
		import OrTag from '../node-tags/or.ts';
		import NotTag from '../node-tags/not.ts';
		import NopTag from '../node-tags/nop.ts';
		import ButtonTag from '../node-tags/button.ts';
		import LedTag from '../node-tags/led.ts';
		import PinTag from '../node-tags/pin.ts';

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

			this.nodeTags.push(new NopTag(this.draw, this.nodeTags, nop));

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

		this.addPin = () => {
			const pin = new Pin();

			this.nodeTags.push(new PinTag(this.draw, this.nodeTags, pin));

			this.circuit.addNode(pin);
		};

		this.export = () => {
			this.nodeTags.forEach((tag, i) => tag.id = i);
			const data = this.nodeTags
				.map(tag => ({
					id: tag.id,
					x: tag.x,
					y: tag.y,
					type: tag.node.type,
					name: tag.node.name,
					outputs: tag.outputs.map(output => ({
						tagId: output.tag.id,
						from: output.connection.from,
						to: output.connection.to
					}))
				}));

			window.prompt('', Array.prototype.map.call(msgpack.encode(data), val => {
				let hex = (val).toString(16).toUpperCase();
				if (val < 16) hex = '0' + hex;
				return hex;
			}).join(''));
		};

		this.import = () => {
			let data = window.prompt('');

			data = msgpack.decode(data.split(/(..)/).filter(x => x != '').map(chr => parseInt(chr, 16)));

			data.forEach(tagData => {
				let tag = null;
				if (tagData.type === 'And') tag = new AndTag(this.draw, this.nodeTags, new And());
				if (tagData.type === 'And3') tag = new And3Tag(this.draw, this.nodeTags, new And3());
				if (tagData.type === 'Or') tag = new OrTag(this.draw, this.nodeTags, new Or());
				if (tagData.type === 'Not') tag = new NotTag(this.draw, this.nodeTags, new Not());
				if (tagData.type === 'Nop') tag = new NopTag(this.draw, this.nodeTags, new Nop());
				if (tagData.type === 'Button') tag = new ButtonTag(this.draw, this.nodeTags, new Button());
				if (tagData.type === 'Led') tag = new LedTag(this.draw, this.nodeTags, new Led());
				if (tagData.type === 'Pin') tag = new PinTag(this.draw, this.nodeTags, new Pin());
				tag.id = tagData.id;
				tag.x = tagData.x;
				tag.y = tagData.y;

				this.nodeTags.push(tag);

				this.circuit.addNode(tag.node);
			});

			data.forEach(tagData => {
				tagData.outputs.forEach(output => {
					this.nodeTags.find(tag => tag.id === tagData.id).connectTo({
						tag: this.nodeTags.find(tag => tag.id === output.tagId),
						portId: output.to
					});
				});
			});
		};
	</script>
</lo-main>

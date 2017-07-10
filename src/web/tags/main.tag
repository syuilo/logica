<lo-main>
	<button onclick={ addAnd }>And</button>
	<button onclick={ addAnd3 }>And3</button>
	<button onclick={ addOr }>Or</button>
	<button onclick={ addNot }>Not</button>
	<button onclick={ addNop }>Nop</button>
	<button onclick={ addButton }>Button</button>
	<button onclick={ addLed }>LED</button>
	<button onclick={ addPin }>Pin</button>
	<button onclick={ addPackageInput }>[PackageInput]</button>
	<button onclick={ addPackageOutput }>[PackageOutput]</button>
	<span>---</span>
	<button onclick={ appendPackage }>Append Package</button>
	<button onclick={ createPackage }>Create Package</button>
	<span>---</span>
	<button onclick={ import }>Import</button>
	<button onclick={ export }>Export</button>
	<div ref="drawing"></div>
	<script>
		import SVG from 'svg.js';
		require('svg.draggable.js');

		const msgpack = require('msgpack-lite');

		import Circuit from '../../core/circuit.ts';

		import And from '../../core/nodes/and.ts';
		import And3 from '../../core/nodes/and3.ts';
		import Or from '../../core/nodes/or.ts';
		import Not from '../../core/nodes/not.ts';
		import Nop from '../../core/nodes/nop.ts';
		import Button from '../../core/nodes/button.ts';
		import Led from '../../core/nodes/led.ts';
		import Pin from '../../core/nodes/pin.ts';
		import Package from '../../core/nodes/package.ts';
		import PackageInput from '../../core/nodes/package-input.ts';
		import PackageOutput from '../../core/nodes/package-output.ts';

		import AndTag from '../node-tags/and.ts';
		import And3Tag from '../node-tags/and3.ts';
		import OrTag from '../node-tags/or.ts';
		import NotTag from '../node-tags/not.ts';
		import NopTag from '../node-tags/nop.ts';
		import ButtonTag from '../node-tags/button.ts';
		import LedTag from '../node-tags/led.ts';
		import PinTag from '../node-tags/pin.ts';
		import PackageTag from '../node-tags/package.ts';
		import PackageInputTag from '../node-tags/package-input.ts';
		import PackageOutputTag from '../node-tags/package-output.ts';

		import imp from '../import.ts';
		import exp from '../export.ts';
		import expPkg from '../../core/export-package.ts';

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

		this.addPackageInput = () => {
			const name = window.prompt('Input name');
			const id = window.prompt('Input ID');
			const desc = window.prompt('Input description');
			const packageInput = new PackageInput();
			packageInput.inputId = id;
			packageInput.inputName = name;
			packageInput.inputDesc = desc;
			this.nodeTags.push(new PackageInputTag(this.draw, this.nodeTags, packageInput));
			this.circuit.addNode(packageInput);
		};

		this.addPackageOutput = () => {
			const name = window.prompt('Output name');
			const id = window.prompt('Output ID');
			const desc = window.prompt('Output description');
			const packageOutput = new PackageOutput();
			packageOutput.outputId = id;
			packageOutput.outputName = name;
			packageOutput.outputDesc = desc;
			this.nodeTags.push(new PackageOutputTag(this.draw, this.nodeTags, packageOutput));
			this.circuit.addNode(packageOutput);
		};

		this.createPackage = () => {
			if (Array.from(this.circuit.nodes).find(n => n.type === 'PackageInput') == null || Array.from(this.circuit.nodes).find(n => n.type === 'PackageOutput') == null) {
				alert('パッケージを作成するには、回路に一つ以上のPackageInputおよびPackageOutputが含まれている必要があります' + '\n' + 'To create a package, you must include PackageInput and PackageOutput.');
				return;
			}

			const author = window.prompt('Your name');
			const name = window.prompt('Package name');
			const desc = window.prompt('Package description');

			const data = expPkg(this.circuit.nodes, author, name, desc);

			console.log('あなたのパッケージはこちらです:');
			console.log(Array.prototype.map.call(msgpack.encode(data), val => {
				let hex = (val).toString(16).toUpperCase();
				if (val < 16) hex = '0' + hex;
				return hex;
			}).join(''));

			alert('ブラウザ コンソールにデータを出力しました。コピーしてください。');

			alert('パッケージには回路の(レイアウトなどの)設計図情報は含まれていないのでご注意ください(設計図を保存したい場合はExportしてください)。');
		};

		this.appendPackage = () => {
			let data = window.prompt('');

			data = msgpack.decode(data.split(/(..)/).filter(x => x != '').map(chr => parseInt(chr, 16)));

			const pkg = Package.import(data);
			this.nodeTags.push(new PackageTag(this.draw, this.nodeTags, pkg));
			this.circuit.addNode(pkg);
		};

		this.export = () => {
			const data = exp(this.nodeTags);
			console.log(Array.prototype.map.call(data, val => {
				let hex = (val).toString(16).toUpperCase();
				if (val < 16) hex = '0' + hex;
				return hex;
			}).join(''));
			alert('ブラウザ コンソールにデータを出力しました。コピーしてください。');
		};

		this.import = () => {
			let data = window.prompt('');
			data = data.split(/(..)/).filter(x => x != '').map(chr => parseInt(chr, 16));
			imp(this.draw, this.nodeTags, this.circuit, data);
		};
	</script>
</lo-main>

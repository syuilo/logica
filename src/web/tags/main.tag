<lo-main>
	<header>
		<span>[</span>
		<button onclick={ addAnd }>And</button>
		<button onclick={ addAnd3 }>And3</button>
		<button onclick={ addOr }>Or</button>
		<button onclick={ addNot }>Not</button>
		<button onclick={ addNor }>Nor</button>
		<button onclick={ addNand }>Nand</button>
		<button onclick={ addXor }>Xor</button>
		<button onclick={ addNop }>Nop</button>
		<span>-</span>
		<button onclick={ addButton }>Button</button>
		<button onclick={ addLed }>LED</button>
		<button onclick={ addPin }>Pin</button>
		<span>-</span>
		<button onclick={ addPackageInput }>[PackageInput]</button>
		<button onclick={ addPackageOutput }>[PackageOutput]</button>
		<span>] --- [</span>
		<button onclick={ appendPackage }>Append Package</button>
		<button onclick={ createPackage }>Create Package</button>
		<span>] --- [</span>
		<button onclick={ import }>Import</button>
		<button onclick={ export }>Export</button>
		<span>]</span>
	</header>
	<div ref="drawing"></div>
	<style>
		:scope
			> header
				position fixed
				top 0
				left 0
				z-index 1000
				width 100%
	</style>
	<script>
		import SVG from 'svg.js';
		require('svg.draggable.js');

		const msgpack = require('msgpack-lite');

		import Circuit from '../../core/circuit.ts';

		import And from '../../core/nodes/and.ts';
		import And3 from '../../core/nodes/and3.ts';
		import Or from '../../core/nodes/or.ts';
		import Not from '../../core/nodes/not.ts';
		import Nor from '../../core/nodes/nor.ts';
		import Nand from '../../core/nodes/nand.ts';
		import Xor from '../../core/nodes/xor.ts';
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
		import NorTag from '../node-tags/nor.ts';
		import NandTag from '../node-tags/nand.ts';
		import XorTag from '../node-tags/xor.ts';
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
			this.draw = SVG(this.refs.drawing).size(window.innerWidth, window.innerHeight);
			//this.draw.rect(100, 100).attr({ fill: '#f06' });

			setInterval(() => {
				this.circuit.tick();
			}, 100);
		});

		this.addTag = tag => {
			this.nodeTags.push(tag);
			this.circuit.addNode(tag.node);
			tag.el.move(32 + (Math.random() * 16), 32 + (Math.random() * 16));
		};

		this.addAnd = () => {
			this.addTag(new AndTag(this.draw, this.nodeTags, new And()));
		};

		this.addAnd3 = () => {
			this.addTag(new And3Tag(this.draw, this.nodeTags, new And3()));
		};

		this.addOr = () => {
			this.addTag(new OrTag(this.draw, this.nodeTags, new Or()));
		};

		this.addNot = () => {
			this.addTag(new NotTag(this.draw, this.nodeTags, new Not()));
		};

		this.addNor = () => {
			this.addTag(new NorTag(this.draw, this.nodeTags, new Nor()));
		};

		this.addNand = () => {
			this.addTag(new NandTag(this.draw, this.nodeTags, new Nand()));
		};

		this.addXor = () => {
			this.addTag(new XorTag(this.draw, this.nodeTags, new Xor()));
		};

		this.addNop = () => {
			this.addTag(new NopTag(this.draw, this.nodeTags, new Nop()));
		};

		this.addButton = () => {
			this.addTag(new ButtonTag(this.draw, this.nodeTags, new Button()));
		};

		this.addLed = () => {
			this.addTag(new LedTag(this.draw, this.nodeTags, new Led()));
		};

		this.addPin = () => {
			this.addTag(new PinTag(this.draw, this.nodeTags, new Pin()));
		};

		this.addPackageInput = () => {
			const name = window.prompt('Input name');
			const id = window.prompt('Input ID');
			const desc = window.prompt('Input description');
			const packageInput = new PackageInput();
			packageInput.inputId = id;
			packageInput.inputName = name;
			packageInput.inputDesc = desc;
			this.addTag(new PackageInputTag(this.draw, this.nodeTags, packageInput));
		};

		this.addPackageOutput = () => {
			const name = window.prompt('Output name');
			const id = window.prompt('Output ID');
			const desc = window.prompt('Output description');
			const packageOutput = new PackageOutput();
			packageOutput.outputId = id;
			packageOutput.outputName = name;
			packageOutput.outputDesc = desc;
			this.addTag(new PackageOutputTag(this.draw, this.nodeTags, packageOutput));
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

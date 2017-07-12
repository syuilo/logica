<lo-main>
	<header if={ circuitBoard }>
		<button class="play" title={ circuitBoard.autoTick ? 'Pause' : 'Play' } onclick={ toggleAutoTick }><i class="fa fa-{ circuitBoard.autoTick ? 'pause' : 'play' }"></i></button>
		<button class="tick" title="Next Tick" onclick={ tick } disabled={ circuitBoard.autoTick }><i class="fa fa-step-forward"></i></button>
		<span>[</span>
		<button onclick={ circuitBoard.addAnd }>And</button>
		<button onclick={ circuitBoard.addAnd3 }>And3</button>
		<button onclick={ circuitBoard.addOr }>Or</button>
		<button onclick={ circuitBoard.addNot }>Not</button>
		<button onclick={ circuitBoard.addNor }>Nor</button>
		<button onclick={ circuitBoard.addNand }>Nand</button>
		<button onclick={ circuitBoard.addXor }>Xor</button>
		<button onclick={ circuitBoard.addNop }>Nop</button>
		<span>-</span>
		<button onclick={ circuitBoard.addRandom }>Rnd</button>
		<span>-</span>
		<button onclick={ circuitBoard.addButton }>Button</button>
		<button onclick={ circuitBoard.addLed }>LED</button>
		<span>-</span>
		<button onclick={ circuitBoard.addPin }>Pin</button>
		<span>-</span>
		<button onclick={ circuitBoard.addPackageInput }>[PackageInput]</button>
		<button onclick={ circuitBoard.addPackageOutput }>[PackageOutput]</button>
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
				background #050f15

				.play
				.tick
					padding 0
					margin 0
					width 48px
					height 48px
					font-size 24px
					color #fff
					background none
					border none
					cursor pointer

					&:hover
						background rgba(255, 255, 255, 0.3)

					&:active:not(:disabled)
						background rgba(0, 0, 0, 0.1)

					&:focus
						outline none

					&:disabled
						opacity 0.5
						cursor default

				.tick
					background-clip padding-box
					border-right solid 2px rgba(0, 0, 0, 0.2)
					margin-right 16px

	</style>
	<script>
		import SVG from 'svg.js';
		require('svg.draggable.js');

		const msgpack = require('msgpack-lite');

		import CircuitBoard from '../circuit-board.ts';

		import imp from '../import.ts';
		import exp from '../export.ts';
		import expPkg from '../../core/export-package.ts';

		this.on('mount', () => {
			this.circuitBoard = new CircuitBoard(this.refs.drawing, window.innerWidth, window.innerHeight);
			this.update();
		});

		this.toggleAutoTick = () => {
			this.circuitBoard.autoTick = !this.circuitBoard.autoTick;
			this.update();
		};

		this.tick = () => {
			this.circuitBoard.circuit.tick();
		};

		this.createPackage = () => {
			if (Array.from(this.circuitBoard.circuit.nodes).find(n => n.type === 'PackageInput') == null || Array.from(this.circuitBoard.circuit.nodes).find(n => n.type === 'PackageOutput') == null) {
				alert('パッケージを作成するには、回路に一つ以上のPackageInputおよびPackageOutputが含まれている必要があります' + '\n' + 'To create a package, you must include PackageInput and PackageOutput.');
				return;
			}

			const author = window.prompt('Your name');
			const name = window.prompt('Package name');
			const desc = window.prompt('Package description');

			const data = expPkg(this.circuitBoard.circuit.nodes, author, name, desc);

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

			this.circuitBoard.loadPackage(data);
		};

		this.export = () => {
			const data = exp(this.circuitBoard.nodeTags);
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
			imp(this.circuitBoard, data);
		};
	</script>
</lo-main>

<lo-main>
	<header>
		<button class="reset" title="Reset" onclick={ refs.circuit.view.reset }><i class="fa fa-repeat"></i></button>
		<button class="autoTick" title={ config.autoTick ? 'Pause' : 'Resume' } onclick={ toggleAutoTick }><i class="fa fa-{ config.autoTick ? 'pause' : 'play' }"></i></button>
		<button class="tick" title="Next Tick" onclick={ tick } disabled={ config.autoTick }><i class="fa fa-step-forward"></i></button>
		<span>[</span>
		<button onclick={ import }>Import</button>
		<button onclick={ export }>Export</button>
		<span>]   </span>
		<label><input type="checkbox" checked={ config.snapToGrid } onchange={ onChangeSnapToGrid }>Snap to grid</label>
	</header>
	<lo-nodes ref="circuit" circuit={ circuit }></lo-nodes>
	<style>
		:scope
			> header
				background #050f15

				.reset
				.autoTick
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

		import Circuit from '../../core/circuit.ts';
		import imp from '../import.ts';
		import exp from '../export.ts';
		import expPkg from '../../core/export-package.ts';

		this.mixin('config');

		this.circuit = new Circuit();

		this.toggleAutoTick = () => {
			this.config.autoTick = !this.config.autoTick;
			this.update();
		};

		this.tick = () => {
			this.circuit.tick();
		};

		this.createPackage = () => {
			if (Array.from(this.circuit.nodes).find(n => n.type === 'PackageInput') == null || Array.from(this.circuit.nodes).find(n => n.type === 'PackageOutput') == null) {
				alert('パッケージを作成するには、回路に一つ以上のPackageInputおよびPackageOutputが含まれている必要があります' + '\n' + 'To create a package, you must include PackageInput and PackageOutput.');
				return;
			}

			const author = window.prompt('Your name');
			const name = window.prompt('Package name');
			const desc = window.prompt('Package description');

			const data = expPkg(this.circuitView.circuit.nodes, author, name, desc);

			console.log('あなたのパッケージはこちらです:');
			console.log(Array.prototype.map.call(msgpack.encode(data), val => {
				let hex = (val).toString(16).toUpperCase();
				if (val < 16) hex = '0' + hex;
				return hex;
			}).join(''));

			alert('ブラウザ コンソールにデータをダンプしました。コピーしてください。');

			alert('パッケージには回路の(レイアウトなどの)設計図情報は含まれていないのでご注意ください(設計図を保存したい場合はExportしてください)。');
		};

		this.appendPackage = () => {
			let data = window.prompt('');

			data = msgpack.decode(data.split(/(..)/).filter(x => x != '').map(chr => parseInt(chr, 16)));

			this.circuitView.loadPackage(data);
		};

		this.export = () => {
			const data = exp(this.circuitView.nodeViews);
			console.log(Array.prototype.map.call(data, val => {
				let hex = (val).toString(16).toUpperCase();
				if (val < 16) hex = '0' + hex;
				return hex;
			}).join(''));
			alert('ブラウザ コンソールにデータをダンプしました。コピーしてください。');
		};

		this.import = () => {
			let data = window.prompt('');
			data = data.split(/(..)/).filter(x => x != '').map(chr => parseInt(chr, 16));
			imp(this.circuitView, data);
		};

		this.onChangeSnapToGrid = e => {
			this.circuitView.snapToGrid = e.target.checked;
		};
	</script>
</lo-main>

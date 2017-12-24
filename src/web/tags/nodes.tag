<lo-nodes>
	<header if={ view }>
		<span>[</span>
		<button onclick={ view.addAnd }>And</button>
		<button onclick={ view.addAnd3 }>And3</button>
		<button onclick={ view.addOr }>Or</button>
		<button onclick={ view.addOr3 }>Or3</button>
		<button onclick={ view.addNot }>Not</button>
		<button onclick={ view.addNor }>Nor</button>
		<button onclick={ view.addNand }>Nand</button>
		<button onclick={ view.addXor }>Xor</button>
		<span>-</span>
		<button onclick={ view.addTrue }>True</button>
		<button onclick={ view.addFalse }>False</button>
		<button onclick={ view.addNop }>Nop</button>
		<button onclick={ view.addRandom }>Rnd</button>
		<button onclick={ view.addButton }>Button</button>
		<button onclick={ view.addLed }>LED</button>
		<span>-</span>
		<button onclick={ view.addPin }>Pin</button>
		<span>-</span>
		<button onclick={ view.addPackageInput }>[PackageIn]</button>
		<button onclick={ view.addPackageOutput }>[PackageOut]</button>
		<span>] --- [</span>
		<button onclick={ appendPackage }>Append Package</button>
		<button onclick={ createPackage }>Create Package</button>
		<span>]</span>
	</header>

	<div ref="drawing"></div>

	<style>
		:scope
			display block
			width 512px
			height 512px
			box-shadow 0 0 16px #000
	</style>

	<script>
		//import SVG from 'svg.js';
		//require('svg.draggable.js');

		import { CircuitNodesView, ModuleNodesView } from '../nodes-view.ts';

		this.mixin('config');

		this.on('mount', () => {
			if (this.opts.circuit) {
				this.view = new CircuitNodesView(this.config, this.opts.circuit, this.refs.drawing, 512, 512);
			} else {
				this.view = new ModuleNodesView(this.config, this.opts.module, this.refs.drawing, 512, 512);
			}
			console.log(this.config);
			this.update();
		});

	</script>
</lo-nodes>

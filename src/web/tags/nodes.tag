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

	<div ref="main" onmousedown={ onmousedown } oncontextmenu={ oncontextmenu }>
		<div ref="drawing"></div>
		<div class="selection" ref="selection"></div>
	</div>

	<style>
		:scope
			display block
			width 512px
			height 512px
			box-shadow 0 0 16px #000

			> div
				position relative

				> .selection
					$color = #00ff72

					display none
					position absolute
					z-index 1000
					top 0
					left 0
					border solid 1px $color
					background rgba($color, 0.5)
					pointer-events none
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

		this.onmousedown = e => {
			if (e.button !== 0) return;

			this.view.unSelectAllNodeViews();

			const rect = this.refs.main.getBoundingClientRect();
			const left = e.pageX + this.refs.main.scrollLeft - rect.left - window.pageXOffset;
			const top = e.pageY + this.refs.main.scrollTop - rect.top - window.pageYOffset;
			const move = e => {
				this.refs.selection.style.display = 'block';
				const cursorX = e.pageX + this.refs.main.scrollLeft - rect.left - window.pageXOffset;
				const cursorY = e.pageY + this.refs.main.scrollTop - rect.top - window.pageYOffset;
				const w = cursorX - left;
				const h = cursorY - top;
				if (w > 0) {
					this.refs.selection.style.width = w + 'px';
					this.refs.selection.style.left = left + 'px';
				} else {
					this.refs.selection.style.width = -w + 'px';
					this.refs.selection.style.left = cursorX + 'px';
				}
				if (h > 0) {
					this.refs.selection.style.height = h + 'px';
					this.refs.selection.style.top = top + 'px';
				} else {
					this.refs.selection.style.height = -h + 'px';
					this.refs.selection.style.top = cursorY + 'px';
				}

				const boxLeft = w > 0 ? left : cursorX;
				const boxTop = h > 0 ? top : cursorY;
				const boxWidth = Math.abs(w);
				const boxHeight = Math.abs(h);

				const selects = this.view.nodeViews.filter(v =>
					v.x + v.width > boxLeft &&
					v.x < boxLeft + boxWidth &&
					v.y + v.height > boxTop &&
					v.y < boxTop + boxHeight);

				this.view.selectNodeViews(selects);
			};
			const up = e => {
				document.documentElement.removeEventListener('mousemove', move);
				document.documentElement.removeEventListener('mouseup', up);
				this.refs.selection.style.display = 'none';
			};
			document.documentElement.addEventListener('mousemove', move);
			document.documentElement.addEventListener('mouseup', up);
		};

		this.oncontextmenu = e => {
			e.preventDefault();
			e.stopImmediatePropagation();
			const ctx = riot.mount(document.body.appendChild(document.createElement('lo-nodes-view-contextmenu')), {
				nodesView: this
			})[0];
			ctx.open({
				x: e.pageX - window.pageXOffset,
				y: e.pageY - window.pageYOffset
			});
			return false;
		};

	</script>
</lo-nodes>

<lo-nodes-view-contextmenu>
	<lo-contextmenu ref="ctx">
		<ul>
			<li onclick={ parent.packaging }>
				<p>パッケージング</p>
			</li>
		</ul>
	</lo-contextmenu>
	<script>
		this.browser = this.opts.browser;
		this.on('mount', () => {
			this.refs.ctx.on('closed', () => {
				this.trigger('closed');
				this.unmount();
			});
		});
		this.open = pos => {
			this.refs.ctx.open(pos);
		};
		this.packaging = () => {
			this.browser.createFolder();
			this.refs.ctx.close();
		};
	</script>
</lo-nodes-view-contextmenu>

<lo-and-node onmousedown={ onMousedown } title={ node.desc } style="width: { width }px; height: { height }px;">
	<span>{ node.type }</span>
	<div class="inputs" style="height: { height }px;">
		<div each={ input, i in node.inputInfo } style="top: { i / node.inputInfo.length * 100 }%"></div>
	</div>
	<div class="outputs" style="height: { height }px;">
		<div each={ output, i in node.outputInfo } style="top: { i / node.outputInfo.length * 100 }%" onmousedown={ onOutputMousedown }></div>
	</div>
	<style>
		:scope
			display block
			position absolute
			text-align center
			background #3be295
			border-radius 6px
			box-shadow 2px 4px 8px rgba(0, 0, 0, 0.1)

			> .line
				display block
				position absolute

			> .inputs
				position absolute
				top 0
				left 0
				width 8px

				> div
					position absolute
					left 0
					width 8px
					height 8px
					background #f5de3c

			> .outputs
				position absolute
				top 0
				right 0
				width 8px

				> div
					position absolute
					left 0
					width 8px
					height 8px
					background #f5de3c
	</style>
	<script>
		this.node = this.opts.node;

		this.x = 0;
		this.y = 0;
		this.width = 64;
		this.height = 64;

		this.onMousedown = e => {
			e.preventDefault();
			const position = this.root.getBoundingClientRect();
			const clickX = e.clientX;
			const clickY = e.clientY;
			const moveBaseX = clickX - position.left;
			const moveBaseY = clickY - position.top;
			const browserWidth = window.innerWidth;
			const browserHeight = window.innerHeight;
			const windowWidth = this.root.offsetWidth;
			const windowHeight = this.root.offsetHeight;
			// 動かした時
			dragListen(me => {
				let moveLeft = me.clientX - moveBaseX;
				let moveTop = me.clientY - moveBaseY;
				this.root.style.left = moveLeft + 'px';
				this.root.style.top = moveTop + 'px';
			});
		};


		this.onOutputMousedown = e => {
			e.preventDefault();
			e.stopImmediatePropagation();

			console.log(e.item);

			const svg = this.root.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
			const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			svg.setAttribute('class', 'line');
			svg.setAttribute('viewBox', '0 0 100 100');
			line.setAttribute('x1', 0);
			line.setAttribute('y1', 0);
			line.setAttribute('x2', 0);
			line.setAttribute('y2', 0);
			line.setAttribute('stroke', 'black');
			line.setAttribute('stroke-width', 4);
			svg.appendChild(line);

			const position = this.root.getBoundingClientRect();
			const clickX = e.clientX;
			const clickY = e.clientY;
			const moveBaseX = clickX - position.left;
			const moveBaseY = clickY - position.top;
			const browserWidth = window.innerWidth;
			const browserHeight = window.innerHeight;
			const windowWidth = this.root.offsetWidth;
			const windowHeight = this.root.offsetHeight;
			// 動かした時
			dragListen(me => {
				let moveLeft = me.clientX - moveBaseX;
				let moveTop = me.clientY - moveBaseY;

				svg.style.width = moveLeft + 'px';
				svg.style.height = moveTop + 'px';

				line.setAttribute('x2', moveTop);
				line.setAttribute('y2', moveLeft);
			});
		};


		function dragListen(fn) {
			window.addEventListener('mousemove',  fn);
			window.addEventListener('mouseleave', dragClear.bind(null, fn));
			window.addEventListener('mouseup',    dragClear.bind(null, fn));
		}

		function dragClear(fn) {
			window.removeEventListener('mousemove',  fn);
			window.removeEventListener('mouseleave', dragClear);
			window.removeEventListener('mouseup',    dragClear);
		}

	</script>
</lo-and-node>

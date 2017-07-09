<lo-main>
	<button onclick={ addAnd }>And</button>
	<svg viewBox="0 0 21 7" preserveAspectRatio="none" ref="svg"></svg>
	<script>
		import Circuit from '../../core/circuit.ts';

		import And from '../../core/nodes/gates/and.ts';

		this.circuit = new Circuit();

		this.addAnd = () => {
			const and = new And();
			console.log(and);

			riot.mount(this.root.appendChild(document.createElement('lo-and-node')), {
				node: and
			});
		};
	</script>
</lo-main>

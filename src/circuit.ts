import のーど from './node';
import Package from './nodes/package';
import PackageInput from './nodes/package-input';
import PackageOutput from './nodes/package-output';

export default class Circuit {
	public nodes: Set<のーど>;
	private shouldUpdates: Set<のーど>;

	constructor(nodes: のーど[]) {
		this.nodes = new Set(nodes);
		this.shouldUpdates = new Set(nodes.filter(n => n.isInputCommutative));
		//this.tick();
	}

	public tick() {
		new Set(this.shouldUpdates).forEach(node => {
			if (!node.update()) this.shouldUpdates.delete(node);
			node.outputs.forEach(connection => {
				const node = connection.node;
				switch (node.name) {
					case 'Package':
						const actualNodes = Array.from((node as Package).nodes)
							.filter(n => n.inputs
								.map(c => c.node)
								.find(n => n.name === 'PackageInput' && (n as PackageInput).inputId === connection.to))
						actualNodes.forEach(n => this.shouldUpdates.add(n));
						break;
					case 'PackageOutput':
						const actualNodes2 = Array.from((node as PackageOutput).outputs)
							.map(c => c.node);
						actualNodes2.forEach(n => this.shouldUpdates.add(n));
						break;
					default:
						this.shouldUpdates.add(node);
						break;
				}
			});
		});
	}

	public addNode(node: のーど) {
		this.nodes.add(node);
		this.shouldUpdates.add(node);
	}
}

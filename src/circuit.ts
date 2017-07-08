import のーど from './node';
//import Package from './nodes/package';

export default class Circuit {
	public nodes: Set<のーど>;
	private shouldUpdates: Set<のーど>;

	constructor(nodes: のーど[]) {
		this.nodes = new Set(nodes);
		this.shouldUpdates = new Set(nodes);
		//this.tick();
	}

	public tick() {
		this.shouldUpdates.forEach(node => {
			if (!node.update()) this.shouldUpdates.delete(node);
			node.outputs.forEach(connection => {
				const node = connection.node;
				/*if (node.name === 'Package') {
					this.shouldUpdates.add((node as Package).nodes.filter(n => (n as のーど).inputs.map(c => c.node).find(n => n.isPackageInput && n.inputId === connection.to)));
				} else {*/
					this.shouldUpdates.add(node);
				/*}*/
			});
		});
	}

	public addNode(node: のーど) {
		this.nodes.add(node);
		this.shouldUpdates.add(node);
	}
}

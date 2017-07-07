import のーど from './node';

export default class Circuit {
	public nodes: Set<のーど>;
	private shouldUpdates: Set<のーど>;

	constructor(nodes: Set<のーど>) {
		this.nodes = nodes;
		this.shouldUpdates = nodes;
		this.tick();
	}

	public tick() {
		this.shouldUpdates.forEach(node => {
			if (!node.update()) this.shouldUpdates.delete(node);
			node.outputs.forEach(node => this.shouldUpdates.add(node));
		});
	}

	public addNode(node: のーど) {
		this.nodes.add(node);
		this.shouldUpdates.add(node);
	}
}

import のーど from './node';
import Package from './nodes/package';
import PackageInput from './nodes/package-input';
import PackageOutput from './nodes/package-output';

export default class Circuit {
	public nodes: Set<のーど>;
	private shouldUpdates: Set<のーど>;

	constructor(nodes: のーど[]) {
		this.nodes = new Set(nodes);
		this.shouldUpdates = new Set(nodes.filter(n => n.isInitializeRequired));
		this.tick();
	}

	public tick() {
		new Set(this.shouldUpdates).forEach(node => {
			if (!node.update()) this.shouldUpdates.delete(node);
			node.outputs.forEach(connection => {
				const node = connection.node;
				switch (node.type) {
					case 'Package':
						const actualNodes = Array.from((node as Package).nodes)
							.filter(n => n.inputs
								.map(c => c.node)
								.find(n => n.type === 'PackageInput' && (n as PackageInput).inputId === connection.to))
						actualNodes.forEach(n => this.shouldUpdates.add(n));
						break;
					case 'PackageOutput':
						const actualNodes2 = (node as PackageOutput).parent.outputs
							.filter(c => c.from === (node as PackageOutput).outputId)
							.map(c => c.node)
						actualNodes2.forEach(n => this.shouldUpdates.add(n));
						break;
					default:
						this.shouldUpdates.add(node);
						break;
				}
			});
		});
/*
		console.log('======================');
		console.log(Array.from(this.nodes).map((n: any) => `${n.type} ${n.name || '-'} ${JSON.stringify(n.states)}`).join('\n'));
		console.log('---');
		console.log(Array.from((this.nodes.values().next().value as any).nodes).map((n: any) => `${n.type} ${n.name || '-'} ${JSON.stringify(n.states)}`).join('\n'));
		console.log('======================');
		*/
	}

	public addNode(node: のーど) {
		this.nodes.add(node);
		this.shouldUpdates.add(node);
	}
}

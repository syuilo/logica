import のーど from './node';
import Package from './nodes/package';
import PackageInput from './nodes/package-input';
import PackageOutput from './nodes/package-output';

/**
 * 回路
 */
export default class Circuit {
	/**
	 * この回路に含まれているノード
	 */
	public nodes: Set<のーど>;

	private shouldUpdates: Set<のーど>;

	constructor(nodes: のーど[]) {
		this.nodes = new Set(nodes);
		this.shouldUpdates = new Set(Array.from(this.nodes).filter(n => n.isForceUpdate));
	}

	private init() {
		this.nodes.forEach(n => n.init());
		this.shouldUpdates = new Set(Array.from(this.nodes).filter(n => n.isForceUpdate));
		this.tick();
	}

	/**
	 * 回路の状態を1ステップ進めます
	 */
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

		console.log('======================');
		console.log(Array.from(this.nodes).map((n: any) => `${n.type} ${n.name || '-'} ${JSON.stringify(n.states)}`).join('\n'));
		console.log('---');
		console.log(Array.from((this.nodes.values().next().value as any).nodes).map((n: any) => `${n.type} ${n.name || '-'} ${JSON.stringify(n.states)}`).join('\n'));
		console.log('======================');

	}

	/**
	 * 回路の状態を初期状態に戻します
	 */
	public reset() {
		this.init();
	}

	public addNode(node: のーど) {
		this.nodes.add(node);
		this.shouldUpdates.add(node);
	}
}

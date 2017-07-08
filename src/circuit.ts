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

			node.outputInfo.forEach(o => {
				const next = node.getActualNextNodes(o.id);
				next.forEach(n => this.shouldUpdates.add(n));
			});
		});

		console.log('======================');
		console.log(Array.from(this.nodes).map((n: any) => `${n.type} ${n.name || '-'} ${JSON.stringify(n.states)}`).join('\n'));
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

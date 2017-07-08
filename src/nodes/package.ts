import のーど from '../node';
import PackageInput from './package-input';
import PackageOutput from './package-output';

export default class Package extends のーど {
	type = 'Package';
	desc = '回路の集合。';

	public nodes: Set<のーど>;

	constructor(nodes: Set<のーど>) {
		super();

		this.nodes = nodes;

		this.nodes.forEach(n => {
			if (n.type === 'PackageOutput') {
				(n as PackageOutput).parent = this;
			}
			if (n.type === 'PackageInput') {
				(n as PackageInput).parent = this;
			}
		});

		this.inputInfo = Array.from(this.nodes)
			.filter(n => n.type === 'PackageInput')
			.map((pi: PackageInput) => ({
				id: pi.inputId,
				name: pi.inputName,
				desc: pi.inputDesc
			}));

		this.outputInfo = Array.from(this.nodes)
			.filter(n => n.type === 'PackageOutput')
			.map((po: PackageOutput) => ({
				id: po.outputId,
				name: po.outputName,
				desc: po.outputDesc
			}));
	}

	public getState(id: string) {
		const node = Array.from(this.nodes)
			.find(n => n.outputs.find(c => c.node.type === 'PackageOutput' && (c.node as PackageOutput).outputId === id) != null);

		const connection = node.outputs.find(c => (c.node as PackageOutput).outputId === id);

		return node.getState(connection.from);
	}

	update() {
		throw 'Do not call this method because this node is virtual (at Package)';
	}

	public getActualInputNodes(portId: string): のーど[] {
		const n = Array.from(this.nodes)
			.find(n => n.type === 'PackageInput' && (n as PackageInput).inputId === portId);

		return n.getActualNextNodes('x');
	}

	public getActualOutputNodeState(portId: string): boolean {
		const n = Array.from(this.nodes)
			.find(n => n.type === 'PackageOutput' && (n as PackageOutput).outputId === portId);

		return n.getActualPreviousNodeState('x');
	}
}

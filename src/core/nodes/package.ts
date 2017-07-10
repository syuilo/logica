import のーど from '../node';
import PackageInput from './package-input';
import PackageOutput from './package-output';
import importNodes from '../import';
import exportNodes from '../export';

export default class Package extends のーど {
	type = 'Package';
	desc = '回路の集合。';

	public packageName: string;

	public packageAuthor: string;

	public packageDesc: string;

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

		Array.from(this.nodes)
			.filter(n => n.outputs.find(c => c.node.type === 'PackageOutput'))
			.forEach(n => n.on('updated', () => {
				console.log('waaaaaaaaaaaa');
				this.emit('updated');
			}))
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

	export() {
		const data = super.export();
		data.packageName = this.packageName;
		data.packageDesc = this.packageDesc;
		data.packageAuthor = this.packageAuthor;
		data.nodes = exportNodes(this.nodes);
		
		return data;
	}

	public static import(data): Package {
		if (data.type !== 'Package') throw 'This data is not Package data';
		const pkg = new Package(new Set(importNodes(data.nodes)));
		pkg.name = data.name;
		pkg.packageName = data.packageName;
		pkg.packageDesc = data.packageDesc;
		pkg.packageAuthor = data.packageAuthor;
		return pkg;
	}
}

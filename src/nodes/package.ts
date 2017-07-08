import のーど from '../node';
import PackageInput from './package-input';
import PackageOutput from './package-output';

export default class Package extends のーど {
	name = 'Package';
	desc = 'package';

	public nodes: Set<のーど>;

	constructor(nodes: Set<のーど>) {
		super();

		this.nodes = nodes;

		this.inputInfo = Array.from(this.nodes)
			.filter(n => n.name === 'PackageInput')
			.map((pi: PackageInput) => ({
				id: pi.inputId,
				name: pi.inputName,
				desc: pi.inputDesc
			}));

		this.outputInfo = Array.from(this.nodes)
			.filter(n => n.name === 'PackageOutput')
			.map((po: PackageOutput) => ({
				id: po.outputId,
				name: po.outputName,
				desc: po.outputDesc
			}));
	}

	update() {
		throw 'Do not call this method because this node is virtual (at Package)';
	}
}

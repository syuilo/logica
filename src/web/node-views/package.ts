import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import のーど from '../../core/node';
import Package from '../../core/nodes/package';

export default class PackageView extends NodeView {
	node: Package;

	constructor(circuitView: CircuitView, node: Package);
	constructor(circuitView: CircuitView, packageNodes: Set<のーど>, packageName: string, packageDesc: string, packageAuthor: string);
	constructor(circuitView: CircuitView, x: Package | Set<のーど>, packageName?: string, packageDesc?: string, packageAuthor?: string) {
		const pkg = x instanceof Set ? new Package(x, packageName, packageDesc, packageAuthor): x;

		let height = 96;

		const inOutMax = Math.max((pkg.inputInfo || []).length, (pkg.outputInfo || []).length);

		if (inOutMax > 5) height += (32 * (inOutMax - 5));

		super(circuitView, pkg, 96, height);

		this.el.text(this.node.packageName).fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(circuitView: CircuitView, data) {
		return new PackageView(circuitView, Package.import(data.node));
	}
}

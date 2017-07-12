import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import のーど from '../../core/node';
import Package from '../../core/nodes/package';

export default class PackageTag extends NodeTag {
	node: Package;

	constructor(circuitBoard: CircuitBoard, node: Package);
	constructor(circuitBoard: CircuitBoard, packageNodes: Set<のーど>, packageName: string, packageDesc: string, packageAuthor: string);
	constructor(circuitBoard: CircuitBoard, x: Package | Set<のーど>, packageName?: string, packageDesc?: string, packageAuthor?: string) {
		const pkg = x instanceof Set ? new Package(x, packageName, packageDesc, packageAuthor): x;

		let height = 96;

		const inOutMax = Math.max((pkg.inputInfo || []).length, (pkg.outputInfo || []).length);

		if (inOutMax > 5) height += (32 * (inOutMax - 5));

		super(circuitBoard, pkg, 96, height);

		this.el.text(this.node.packageName).fill('#fff').move(10, 4);
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new PackageTag(circuitBoard, Package.import(data.node));
	}
}

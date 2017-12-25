import NodesView from '../nodes-view';
import { NodeView, NodeViewModel } from '../node-view';
import Config from '../config';
import のーど from '../../core/node';
import Package from '../../core/nodes/package';

export default class PackageView extends NodeView {
	node: Package;

	constructor(config: Config, nodesView: NodesView, node: Package);
	constructor(config: Config, nodesView: NodesView, packageNodes: Set<のーど>, packageName: string, packageDesc: string, packageAuthor: string);
	constructor(config: Config, nodesView: NodesView, x: Package | Set<のーど>, packageName?: string, packageDesc?: string, packageAuthor?: string) {
		const pkg = x instanceof Set ? new Package(x, packageName, packageDesc, packageAuthor): x;

		let height = 96;

		const inOutMax = Math.max((pkg.inputInfo || []).length, (pkg.outputInfo || []).length);

		if (inOutMax > 5) height += (32 * (inOutMax - 5));

		super(config, nodesView, pkg, 96, height);

		this.el.text(this.node.packageName).fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new PackageView(config, nodesView, Package.import(data.node));
	}
}

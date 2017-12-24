import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import のーど from '../../core/node';
import Package from '../../core/nodes/package';

export default class ModuleView extends NodeView {
	node: Package;

	nodeViews: NodeView[];

	constructor(config: Config, nodesView: NodesView, childNodeViews: NodeView[], packageName: string, packageDesc: string, packageAuthor: string) {
		const pkg = new Package(new Set(childNodeViews.map(v => v.node)), packageName, packageDesc, packageAuthor);

		let height = 96;

		const inOutMax = Math.max((pkg.inputInfo || []).length, (pkg.outputInfo || []).length);

		if (inOutMax > 5) height += (32 * (inOutMax - 5));

		super(config, nodesView, pkg, 96, height);

		this.el.text(this.node.packageName).fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public removeNode(nodeView: NodeView) {
		this.node.removeNode(nodeView.node);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new ModuleView(config, nodesView, data.childNodeViews, data.packageName, data.packageDesc, data.packageAuthor);
	}
}

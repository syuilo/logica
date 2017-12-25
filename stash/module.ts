import NodesView from '../nodes-view';
import { NodeView, NodeViewModel } from '../node-view';
import Config from '../config';
import のーど from '../../core/node';
import Package from '../../core/nodes/package';

export class ModuleView extends NodeView<Package> {
	constructor(config: Config, nodeViewModel: NodeViewModel<Package>) {
		const pkg = nodeViewModel.node;

		let height = 96;
		const inOutMax = Math.max((pkg.inputInfo || []).length, (pkg.outputInfo || []).length);
		if (inOutMax > 5) height += (32 * (inOutMax - 5));

		super(config, nodeViewModel, 96, height);

		this.el.text(pkg.packageName).fill('#fff').style('pointer-events: none;').move(10, 4);
	}
}

export class ModuleViewModel extends NodeViewModel<Package> {
	node: Package;

	nodeViewModels: NodeViewModel[];

	constructor(config: Config, nodeViewModel: NodeViewModel, childNodeViewModels: NodeViewModel[], packageName: string, packageDesc: string, packageAuthor: string) {
		super(config, new Package());
	}

	public removeNode(nodeView: NodeView) {
		this.node.removeNode(nodeView.node);
	}

	public static import(config: Config, data) {
		return new ModuleViewModel(config, nodesView, data.childNodeViews, data.packageName, data.packageDesc, data.packageAuthor);
	}
}

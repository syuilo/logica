import NodesView from '../nodes-view';
import { NodeView, NodeViewModel } from '../node-view';
import Config from '../config';
import のーど from '../../core/node';
import Package from '../../core/nodes/package';

export class ModuleView extends NodeView<Package> {
	constructor(config: Config, nodesView: NodesView, nodeViewModel: NodeViewModel<Package>) {
		const pkg = nodeViewModel.node;

		let height = 96;
		const inOutMax = Math.max((pkg.inputInfo || []).length, (pkg.outputInfo || []).length);
		if (inOutMax > 5) height += (32 * (inOutMax - 5));

		super(config, nodesView, nodeViewModel, 96, height);

		this.el.text(pkg.packageName).fill('#fff').style('pointer-events: none;').move(10, 4);
		this.el.mousedown(e => {
			if (e.button === 0) return;
			nodesView.open(this.viewModel);
		});
	}
}

export class ModuleViewModel extends NodeViewModel<Package> {
	nodeViewModels: NodeViewModel[];

	constructor(config: Config, childNodeViewModels: NodeViewModel[], packageName: string, packageDesc: string, packageAuthor: string) {
		super(config, new Package(new Set(childNodeViewModels.map(vm => vm.node)), packageName, packageDesc, packageAuthor));
		this.nodeViewModels = childNodeViewModels;
	}

	public removeNode(nodeView: NodeView) {
		this.node.removeNode(nodeView.node);
	}

	public static import(config: Config, data) {
		return new ModuleViewModel(config, data.childNodeViews, data.packageName, data.packageDesc, data.packageAuthor);
	}
}

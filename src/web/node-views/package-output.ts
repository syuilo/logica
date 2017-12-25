import NodesView from '../nodes-view';
import { NodeView, NodeViewModel } from '../node-view';
import Config from '../config';
import PackageOutput from '../../core/nodes/package-output';

export class PackageOutputView extends NodeView<PackageOutput> {
	constructor(config: Config, nodesView: NodesView, nodeViewModel: NodeViewModel<PackageOutput>) {
		super(config, nodesView, nodeViewModel, 96, 64);

		this.el.text('OUT: ' + this.node.outputName).fill('#fff').style('pointer-events: none;').move(10, 4);

		this.rect.dblclick(() => {
			const name = window.prompt('Input name', this.node.outputName);
			const id = window.prompt('Input ID ([a-z0-9_]+)', this.node.outputId);
			const desc = window.prompt('Input description', this.node.outputDesc);
			const index = window.prompt('Input index ([0-9]+)', (this.node.outputIndex || 0).toString()); // 古いバージョンのlogicaデータの互換性のため || 0 しています
			this.node.outputId = id;
			this.node.outputName = name;
			this.node.outputDesc = desc;
			this.node.outputIndex = parseInt(index);
		});
	}
}

export class PackageOutputViewModel extends NodeViewModel<PackageOutput> {
	constructor(config: Config, node: PackageOutput);
	constructor(config: Config, id: string, name: string, desc: string, index: number);
	constructor(config: Config, x: PackageOutput | string, name?: string, desc?: string, index?: number) {
		super(config, typeof x == 'string' ? new PackageOutput(x, name, desc, index) : x);
	}

	public static import(config: Config, data) {
		return new PackageOutputViewModel(config, PackageOutput.import(data.node));
	}
}

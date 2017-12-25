import NodesView from '../nodes-view';
import { NodeView, NodeViewModel } from '../node-view';
import Config from '../config';
import PackageInput from '../../core/nodes/package-input';

export class PackageInputView extends NodeView<PackageInput> {
	constructor(config: Config, nodesView: NodesView, nodeViewModel: NodeViewModel<PackageInput>) {
		super(config, nodesView, nodeViewModel, 96, 64);

		this.el.text('IN: ' + this.node.inputName).fill('#fff').style('pointer-events: none;').move(10, 4);

		this.rect.dblclick(() => {
			const name = window.prompt('Input name', this.node.inputName);
			const id = window.prompt('Input ID ([a-z0-9_]+)', this.node.inputId);
			const desc = window.prompt('Input description', this.node.inputDesc);
			const index = window.prompt('Input index ([0-9]+)', (this.node.inputIndex || 0).toString()); // 古いバージョンのlogicaデータの互換性のため || 0 しています
			this.node.inputId = id;
			this.node.inputName = name;
			this.node.inputDesc = desc;
			this.node.inputIndex = parseInt(index);
		});
	}
}

export class PackageInputViewModel extends NodeViewModel<PackageInput> {
	constructor(config: Config, node: PackageInput);
	constructor(config: Config, id: string, name: string, desc: string, index: number);
	constructor(config: Config, x: PackageInput | string, name?: string, desc?: string, index?: number) {
		super(config, typeof x == 'string' ? new PackageInput(x, name, desc, index) : x);
	}

	public static import(config: Config, data) {
		return new PackageInputViewModel(config, PackageInput.import(data.node));
	}
}

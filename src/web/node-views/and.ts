import NodesView from '../nodes-view';
import { NodeView, NodeViewModel } from '../node-view';
import Config from '../config';
import And from '../../core/nodes/and';

export class AndView extends NodeView<And> {
	constructor(config: Config, nodesView: NodesView, nodeViewModel: NodeViewModel<And>) {
		super(config, nodesView, nodeViewModel, 64, 64);

		this.el.text('And').fill('#fff').style('pointer-events: none;').move(10, 4);
	}
}

export class AndViewModel extends NodeViewModel<And> {
	constructor(config: Config, node?: And) {
		super(config, node || new And());
	}

	public static import(config: Config, data) {
		return new AndViewModel(config, And.import(data.node));
	}
}

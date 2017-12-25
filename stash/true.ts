import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import True from '../../core/nodes/true';

export default class TrueView extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: True) {
		super(config, nodesView, node || new True(), 64, 64);

		this.el.text('True').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new TrueView(config, nodesView, True.import(data.node));
	}
}

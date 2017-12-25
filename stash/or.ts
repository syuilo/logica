import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import Or from '../../core/nodes/or';

export default class OrView extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: Or) {
		super(config, nodesView, node || new Or(), 64, 64);

		this.el.text('Or').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new OrView(config, nodesView, Or.import(data.node));
	}
}

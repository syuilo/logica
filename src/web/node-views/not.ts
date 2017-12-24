import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import Not from '../../core/nodes/not';

export default class NotView extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: Not) {
		super(config, nodesView, node || new Not(), 64, 64);

		this.el.text('Not').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new NotView(config, nodesView, Not.import(data.node));
	}
}

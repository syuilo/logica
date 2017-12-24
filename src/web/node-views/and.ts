import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import And from '../../core/nodes/and';

export default class AndView extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: And) {
		super(config, nodesView, node || new And(), 64, 64);

		this.el.text('And').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new AndView(config, nodesView, And.import(data.node));
	}
}

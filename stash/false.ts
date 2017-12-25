import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import False from '../../core/nodes/false';

export default class FalseView extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: False) {
		super(config, nodesView, node || new False(), 64, 64);

		this.el.text('False').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new FalseView(config, nodesView, False.import(data.node));
	}
}

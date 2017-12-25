import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import And3 from '../../core/nodes/and3';

export default class And3View extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: And3) {
		super(config, nodesView, node || new And3(), 64, 128);

		this.el.text('And').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new And3View(config, nodesView, And3.import(data.node));
	}
}

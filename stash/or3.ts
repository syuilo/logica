import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import Or3 from '../../core/nodes/or3';

export default class Or3View extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: Or3) {
		super(config, nodesView, node || new Or3(), 64, 128);

		this.el.text('Or').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new Or3View(config, nodesView, Or3.import(data.node));
	}
}

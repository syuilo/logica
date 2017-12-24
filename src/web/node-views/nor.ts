import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import Nor from '../../core/nodes/nor';

export default class NorView extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: Nor) {
		super(config, nodesView, node || new Nor(), 64, 64);

		this.el.text('Nor').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new NorView(config, nodesView, Nor.import(data.node));
	}
}

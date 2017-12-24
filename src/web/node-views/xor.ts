import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import Xor from '../../core/nodes/xor';

export default class XorView extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: Xor) {
		super(config, nodesView, node || new Xor(), 64, 64);

		this.el.text('Xor').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new XorView(config, nodesView, Xor.import(data.node));
	}
}

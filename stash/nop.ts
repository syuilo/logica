import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import Nop from '../../core/nodes/nop';

export default class NopView extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: Nop) {
		super(config, nodesView, node || new Nop(), 64, 64);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new NopView(config, nodesView, Nop.import(data.node));
	}
}

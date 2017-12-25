import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import Nand from '../../core/nodes/nand';

export default class NandView extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: Nand) {
		super(config, nodesView, node || new Nand(), 64, 64);

		this.el.text('Nand').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new NandView(config, nodesView, Nand.import(data.node));
	}
}

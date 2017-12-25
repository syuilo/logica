import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import Random from '../../core/nodes/random';

export default class RandomView extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: Random) {
		super(config, nodesView, node || new Random(), 64, 64);

		this.el.text('Rnd').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new RandomView(config, nodesView, Random.import(data.node));
	}
}

import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import Pin from '../../core/nodes/pin';

export default class PinView extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: Pin) {
		super(config, nodesView, node || new Pin(), 32, 32);
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new PinView(config, nodesView, Pin.import(data.node));
	}
}

import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import True from '../../core/nodes/true';

export default class TrueView extends NodeView {
	constructor(circuitView: CircuitView, node?: True) {
		super(circuitView, node || new True(), 64, 64);

		this.el.text('True').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(circuitView: CircuitView, data) {
		return new TrueView(circuitView, True.import(data.node));
	}
}

import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import Or from '../../core/nodes/or';

export default class OrView extends NodeView {
	constructor(circuitView: CircuitView, node?: Or) {
		super(circuitView, node || new Or(), 64, 64);

		this.el.text('Or').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(circuitView: CircuitView, data) {
		return new OrView(circuitView, Or.import(data.node));
	}
}

import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import Not from '../../core/nodes/not';

export default class NotView extends NodeView {
	constructor(circuitView: CircuitView, node?: Not) {
		super(circuitView, node || new Not(), 64, 64);

		this.el.text('Not').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(circuitView: CircuitView, data) {
		return new NotView(circuitView, Not.import(data.node));
	}
}

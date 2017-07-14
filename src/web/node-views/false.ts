import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import False from '../../core/nodes/false';

export default class FalseView extends NodeView {
	constructor(circuitView: CircuitView, node?: False) {
		super(circuitView, node || new False(), 64, 64);

		this.el.text('False').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(circuitView: CircuitView, data) {
		return new FalseView(circuitView, False.import(data.node));
	}
}

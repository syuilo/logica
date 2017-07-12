import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import And from '../../core/nodes/and';

export default class AndView extends NodeView {
	constructor(circuitView: CircuitView, node?: And) {
		super(circuitView, node || new And(), 64, 64);

		this.el.text('And').fill('#fff').move(10, 4);
	}

	public static import(circuitView: CircuitView, data) {
		return new AndView(circuitView, And.import(data.node));
	}
}

import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import And3 from '../../core/nodes/and3';

export default class And3View extends NodeView {
	constructor(circuitView: CircuitView, node?: And3) {
		super(circuitView, node || new And3(), 64, 128);

		this.el.text('And3').fill('#fff').move(10, 4);
	}

	public static import(circuitView: CircuitView, data) {
		return new And3View(circuitView, And3.import(data.node));
	}
}

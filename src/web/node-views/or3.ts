import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import Or3 from '../../core/nodes/or3';

export default class Or3View extends NodeView {
	constructor(circuitView: CircuitView, node?: Or3) {
		super(circuitView, node || new Or3(), 64, 128);

		this.el.text('Or').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(circuitView: CircuitView, data) {
		return new Or3View(circuitView, Or3.import(data.node));
	}
}

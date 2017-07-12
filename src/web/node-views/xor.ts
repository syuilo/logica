import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import Xor from '../../core/nodes/xor';

export default class XorView extends NodeView {
	constructor(circuitView: CircuitView, node?: Xor) {
		super(circuitView, node || new Xor(), 64, 64);

		this.el.text('Xor').fill('#fff').move(10, 4);
	}

	public static import(circuitView: CircuitView, data) {
		return new XorView(circuitView, Xor.import(data.node));
	}
}

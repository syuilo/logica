import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import Nop from '../../core/nodes/nop';

export default class NopView extends NodeView {
	constructor(circuitView: CircuitView, node?: Nop) {
		super(circuitView, node || new Nop(), 64, 64);
	}

	public static import(circuitView: CircuitView, data) {
		return new NopView(circuitView, Nop.import(data.node));
	}
}

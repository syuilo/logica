import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import Pin from '../../core/nodes/pin';

export default class PinView extends NodeView {
	constructor(circuitView: CircuitView, node?: Pin) {
		super(circuitView, node || new Pin(), 32, 32);
	}

	public static import(circuitView: CircuitView, data) {
		return new PinView(circuitView, Pin.import(data.node));
	}
}

import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import RandomDelay from '../../core/nodes/random-delay';

export default class RandomDelayView extends NodeView {
	constructor(circuitView: CircuitView, node?: RandomDelay) {
		super(circuitView, node || new RandomDelay(), 64, 64);

		this.el.text('RndDly').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(circuitView: CircuitView, data) {
		return new RandomDelayView(circuitView, RandomDelay.import(data.node));
	}
}

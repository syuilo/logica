import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import Random from '../../core/nodes/random';

export default class RandomView extends NodeView {
	constructor(circuitView: CircuitView, node?: Random) {
		super(circuitView, node || new Random(), 64, 64);

		this.el.text('Rnd').fill('#fff').move(10, 4);
	}

	public static import(circuitView: CircuitView, data) {
		return new RandomView(circuitView, Random.import(data.node));
	}
}

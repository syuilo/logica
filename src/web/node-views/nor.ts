import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import Nor from '../../core/nodes/nor';

export default class NorView extends NodeView {
	constructor(circuitView: CircuitView, node?: Nor) {
		super(circuitView, node || new Nor(), 64, 64);

		this.el.text('Nor').fill('#fff').move(10, 4);
	}

	public static import(circuitView: CircuitView, data) {
		return new NorView(circuitView, Nor.import(data.node));
	}
}

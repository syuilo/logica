import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import Nand from '../../core/nodes/nand';

export default class NandView extends NodeView {
	constructor(circuitView: CircuitView, node?: Nand) {
		super(circuitView, node || new Nand(), 64, 64);

		this.el.text('Nand').fill('#fff').style('pointer-events: none;').move(10, 4);
	}

	public static import(circuitView: CircuitView, data) {
		return new NandView(circuitView, Nand.import(data.node));
	}
}

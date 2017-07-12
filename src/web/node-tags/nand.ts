import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import Nand from '../../core/nodes/nand';

export default class NandTag extends NodeTag {
	constructor(circuitBoard: CircuitBoard, node?: Nand) {
		super(circuitBoard, node || new Nand(), 64, 64);

		this.el.text('Nand').fill('#fff').move(10, 4);
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new NandTag(circuitBoard, Nand.import(data.node));
	}
}

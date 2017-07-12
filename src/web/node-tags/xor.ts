import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import Xor from '../../core/nodes/xor';

export default class XorTag extends NodeTag {
	constructor(circuitBoard: CircuitBoard, node?: Xor) {
		super(circuitBoard, node || new Xor(), 64, 64);

		this.el.text('Xor').fill('#fff').move(10, 4);
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new XorTag(circuitBoard, Xor.import(data.node));
	}
}

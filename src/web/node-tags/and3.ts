import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import And3 from '../../core/nodes/and3';

export default class And3Tag extends NodeTag {
	constructor(circuitBoard: CircuitBoard, node?: And3) {
		super(circuitBoard, node || new And3(), 64, 128);

		this.el.text('And3').fill('#fff').move(10, 4);
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new And3Tag(circuitBoard, And3.import(data.node));
	}
}

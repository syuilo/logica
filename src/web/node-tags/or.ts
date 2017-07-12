import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import Or from '../../core/nodes/or';

export default class OrTag extends NodeTag {
	constructor(circuitBoard: CircuitBoard, node?: Or) {
		super(circuitBoard, node || new Or(), 64, 64);

		this.el.text('Or').fill('#fff').move(10, 4);
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new OrTag(circuitBoard, Or.import(data.node));
	}
}

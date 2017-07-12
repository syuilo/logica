import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import Not from '../../core/nodes/not';

export default class NotTag extends NodeTag {
	constructor(circuitBoard: CircuitBoard, node?: Not) {
		super(circuitBoard, node || new Not(), 64, 64);

		this.el.text('Not').fill('#fff').move(10, 4);
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new NotTag(circuitBoard, Not.import(data.node));
	}
}

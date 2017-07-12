import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import And from '../../core/nodes/and';

export default class AndTag extends NodeTag {
	constructor(circuitBoard: CircuitBoard, node?: And) {
		super(circuitBoard, node || new And(), 64, 64);

		this.el.text('And').fill('#fff').move(10, 4);
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new AndTag(circuitBoard, And.import(data.node));
	}
}

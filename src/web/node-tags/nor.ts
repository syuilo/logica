import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import Nor from '../../core/nodes/nor';

export default class NorTag extends NodeTag {
	constructor(circuitBoard: CircuitBoard, node?: Nor) {
		super(circuitBoard, node || new Nor(), 64, 64);

		this.el.text('Nor').fill('#fff').move(10, 4);
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new NorTag(circuitBoard, Nor.import(data.node));
	}
}

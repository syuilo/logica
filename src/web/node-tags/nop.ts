import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import Nop from '../../core/nodes/nop';

export default class NopTag extends NodeTag {
	constructor(circuitBoard: CircuitBoard, node?: Nop) {
		super(circuitBoard, node || new Nop(), 64, 64);
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new NopTag(circuitBoard, Nop.import(data.node));
	}
}

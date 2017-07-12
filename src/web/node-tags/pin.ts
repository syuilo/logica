import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import Pin from '../../core/nodes/pin';

export default class PinTag extends NodeTag {
	constructor(circuitBoard: CircuitBoard, node?: Pin) {
		super(circuitBoard, node || new Pin(), 32, 32);
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new PinTag(circuitBoard, Pin.import(data.node));
	}
}

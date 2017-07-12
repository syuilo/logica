import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import Random from '../../core/nodes/random';

export default class RandomTag extends NodeTag {
	constructor(circuitBoard: CircuitBoard, node?: Random) {
		super(circuitBoard, node || new Random(), 64, 64);

		this.el.text('Rnd').fill('#fff').move(10, 4);
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new RandomTag(circuitBoard, Random.import(data.node));
	}
}

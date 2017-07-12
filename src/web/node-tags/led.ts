import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import Led from '../../core/nodes/led';

export default class LedTag extends NodeTag {
	constructor(circuitBoard: CircuitBoard, node?: Led) {
		const led = node || new Led();
		super(circuitBoard, led, 64, 64);

		const rect = this.el.rect(48, 48).move(8, 8).fill('#0c1319').radius(2).style('pointer-events: none;');

		led.on('input-updated', state => {
			rect.fill(state ? '#efcb34' : '#0c1319');
		});
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new LedTag(circuitBoard, Led.import(data.node));
	}
}

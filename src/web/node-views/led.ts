import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import Led from '../../core/nodes/led';

export default class LedView extends NodeView {
	constructor(circuitView: CircuitView, node?: Led) {
		const led = node || new Led();
		super(circuitView, led, 64, 64);

		const rect = this.el.rect(48, 48).move(8, 8).fill('#0c1319').radius(2).style('pointer-events: none;');

		led.on('input-updated', state => {
			rect.fill(state ? '#efcb34' : '#0c1319');
		});
	}

	public static import(circuitView: CircuitView, data) {
		return new LedView(circuitView, Led.import(data.node));
	}
}

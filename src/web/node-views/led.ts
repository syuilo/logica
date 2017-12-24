import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import Led from '../../core/nodes/led';

export default class LedView extends NodeView {
	constructor(config: Config, nodesView: NodesView, node?: Led) {
		const led = node || new Led();
		super(config, nodesView, led, 64, 64);

		const rect = this.el.rect(48, 48).move(8, 8).fill('#0c1319').radius(2).style('pointer-events: none;');

		led.on('input-updated', state => {
			rect.fill(state ? '#efcb34' : '#0c1319');
		});
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new LedView(config, nodesView, Led.import(data.node));
	}
}

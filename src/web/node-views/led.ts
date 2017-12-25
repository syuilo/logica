import NodesView from '../nodes-view';
import { NodeView, NodeViewModel } from '../node-view';
import Config from '../config';
import Led from '../../core/nodes/led';

export class LedView extends NodeView {
	constructor(config: Config, nodesView: NodesView, nodeViewModel: NodeViewModel<Led>) {
		super(config, nodesView, nodeViewModel, 64, 64);

		const rect = this.el.rect(48, 48).move(8, 8).fill('#0c1319').radius(2).style('pointer-events: none;');

		nodeViewModel.node.on('input-updated', state => {
			rect.fill(state ? '#efcb34' : '#0c1319');
		});
	}
}

export class LedViewModel extends NodeViewModel<Led> {
	constructor(config: Config, node?: Led) {
		super(config, node || new Led());
	}

	public static import(config: Config, data) {
		return new LedViewModel(config, Led.import(data.node));
	}
}

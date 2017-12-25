import NodesView from '../nodes-view';
import { NodeView, NodeViewModel } from '../node-view';
import Config from '../config';
import Button from '../../core/nodes/button';

export class ButtonView extends NodeView {
	constructor(config: Config, nodesView: NodesView, nodeViewModel: NodeViewModel<Button>) {
		super(config, nodesView, nodeViewModel, 64, 64);

		const button = this.el.rect(32, 32).move(16, 16).fill('#0f3a35').radius(2).style('cursor: pointer;');
		button.click(() => {
			nodeViewModel.node.click();
		});

		nodeViewModel.node.on('state-updated', () => {
			button.fill(nodeViewModel.node.getState() ? '#ef4625' : '#0f3a35');
		});
	}
}

export class ButtonViewModel extends NodeViewModel<Button> {
	constructor(config: Config, node?: Button) {
		super(config, node || new Button());
	}

	public static import(config: Config, data) {
		return new ButtonViewModel(config, Button.import(data.node));
	}
}

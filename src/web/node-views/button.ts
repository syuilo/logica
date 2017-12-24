import NodesView from '../nodes-view';
import NodeView from '../node-view';
import Config from '../config';
import Button from '../../core/nodes/button';

export default class ButtonView extends NodeView {
	node: Button;

	constructor(config: Config, nodesView: NodesView, node?: Button) {
		super(config, nodesView, node || new Button(), 64, 64);

		const button = this.el.rect(32, 32).move(16, 16).fill('#0f3a35').radius(2).style('cursor: pointer;');
		button.click(() => {
			this.node.click();
		});

		this.node.on('state-updated', () => {
			button.fill(this.node.getState() ? '#ef4625' : '#0f3a35');
		});
	}

	public static import(config: Config, nodesView: NodesView, data) {
		return new ButtonView(config, nodesView, Button.import(data.node));
	}
}

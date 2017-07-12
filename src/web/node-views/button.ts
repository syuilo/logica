import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import Button from '../../core/nodes/button';

export default class ButtonView extends NodeView {
	node: Button;

	constructor(circuitView: CircuitView, node?: Button) {
		super(circuitView, node || new Button(), 64, 64);

		const button = this.el.rect(32, 32).move(16, 16).fill('#0f3a35').radius(2).style('cursor: pointer;');
		button.click(() => {
			this.node.click();
			button.fill(this.node.getState() ? '#ef4625' : '#0f3a35');
		});
	}

	public static import(circuitView: CircuitView, data) {
		return new ButtonView(circuitView, Button.import(data.node));
	}
}

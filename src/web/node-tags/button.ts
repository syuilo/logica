import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import Button from '../../core/nodes/button';

export default class ButtonTag extends NodeTag {
	node: Button;

	constructor(circuitBoard: CircuitBoard, node?: Button) {
		super(circuitBoard, node || new Button(), 64, 64);

		const button = this.el.rect(32, 32).move(16, 16).fill('#0f3a35').radius(2).style('cursor: pointer;');
		button.click(() => {
			this.node.click();
			button.fill(this.node.getState() ? '#ef4625' : '#0f3a35');
		});
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new ButtonTag(circuitBoard, Button.import(data.node));
	}
}

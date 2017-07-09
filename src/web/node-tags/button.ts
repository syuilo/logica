import Button from '../../core/nodes/button';
import NodeTag from '../node';

export default class ButtonTag extends NodeTag {
	node: Button;

	constructor(draw, tags, node) {
		super(draw, tags, node, 64, 64);

		const button = this.el.rect(32, 32).move(16, 16).fill('#0f3a35').radius(2);
		button.click(() => {
			this.node.click();
			button.fill(this.node.getState() ? '#ef4625' : '#0f3a35');
		});
	}
}

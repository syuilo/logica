import Button from '../core/nodes/button';
import NodeTag from './node-tag';

export default class ButtonTag extends NodeTag {
	node: Button;

	constructor(draw, tags, node) {
		super(draw, tags, node)

		const button = this.el.rect(32, 32).move(16, 16).fill('#f00');
		button.click(() => {
			this.node.click();
		});
	}
}

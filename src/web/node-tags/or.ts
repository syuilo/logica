import NodeTag from '../node';

export default class OrTag extends NodeTag {
	constructor(draw, tags, node) {
		super(draw, tags, node, 64, 64);

		this.el.text('Or').fill('#fff').move(10, 4);
	}
}

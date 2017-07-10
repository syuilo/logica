import NodeTag from '../node';

export default class NorTag extends NodeTag {
	constructor(draw, tags, node) {
		super(draw, tags, node, 64, 64);

		this.el.text('Nor').fill('#fff').move(10, 4);
	}
}

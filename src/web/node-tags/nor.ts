import NodeTag from '../node';

export default class NorTag extends NodeTag {
	constructor(draw, circuit, tags, node) {
		super(draw, circuit, tags, node, 64, 64);

		this.el.text('Nor').fill('#fff').move(10, 4);
	}
}

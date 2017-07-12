import NodeTag from '../node';

export default class XorTag extends NodeTag {
	constructor(draw, circuit, tags, node) {
		super(draw, circuit, tags, node, 64, 64);

		this.el.text('Xor').fill('#fff').move(10, 4);
	}
}

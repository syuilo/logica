import NodeTag from '../node';

export default class NandTag extends NodeTag {
	constructor(draw, tags, node) {
		super(draw, tags, node, 64, 64);

		this.el.text('Nand').fill('#fff').move(10, 4);
	}
}

import NodeTag from '../node';

export default class And3Tag extends NodeTag {
	constructor(draw, circuit, tags, node) {
		super(draw, circuit, tags, node, 64, 128);

		this.el.text('And3').fill('#fff').move(10, 4);
	}
}

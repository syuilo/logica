import NodeTag from '../node';

export default class PinTag extends NodeTag {
	constructor(draw, circuit, tags, node) {
		super(draw, circuit, tags, node, 32, 32);
	}
}

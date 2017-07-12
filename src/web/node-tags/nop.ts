import NodeTag from '../node';

export default class NopTag extends NodeTag {
	constructor(draw, circuit, tags, node) {
		super(draw, circuit, tags, node, 64, 64);
	}
}

import NodeTag from '../node';

export default class NopTag extends NodeTag {
	constructor(draw, tags, node) {
		super(draw, tags, node, 64, 64);
	}
}

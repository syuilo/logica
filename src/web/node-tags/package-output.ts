import PackageOutput from '../../core/nodes/package-output';
import NodeTag from '../node';

export default class PackageOutputTag extends NodeTag {
	node: PackageOutput;

	constructor(draw, circuit, tags, node) {
		super(draw, circuit, tags, node, 96, 64);

		this.el.text('OUT: ' + this.node.outputName).fill('#fff').move(10, 4);
	}
}

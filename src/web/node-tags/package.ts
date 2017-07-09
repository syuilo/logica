import Package from '../../core/nodes/package';
import NodeTag from '../node';

export default class PackageTag extends NodeTag {
	node: Package;

	constructor(draw, tags, node) {
		super(draw, tags, node, 96, 96);

		this.el.text(this.node.packageName).fill('#fff').move(10, 4);
	}
}

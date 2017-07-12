import Package from '../../core/nodes/package';
import NodeTag from '../node';

export default class PackageTag extends NodeTag {
	node: Package;

	constructor(draw, circuit, tags, node: Package) {
		let height = 96;

		const inOutMax = Math.max((node.inputInfo || []).length, (node.outputInfo || []).length);

		if (inOutMax > 5) height += (32 * (inOutMax - 5));

		super(draw, circuit, tags, node, 96, height);

		this.el.text(this.node.packageName).fill('#fff').move(10, 4);
	}
}

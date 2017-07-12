import PackageInput from '../../core/nodes/package-input';
import NodeTag from '../node';

export default class PackageInputTag extends NodeTag {
	node: PackageInput;

	constructor(draw, circuit, tags, node) {
		super(draw, circuit, tags, node, 96, 64);

		this.el.text('IN: ' + this.node.inputName).fill('#fff').move(10, 4);
	}
}

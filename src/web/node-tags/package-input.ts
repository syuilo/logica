import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import PackageInput from '../../core/nodes/package-input';

export default class PackageInputTag extends NodeTag {
	node: PackageInput;

	constructor(circuitBoard: CircuitBoard, node: PackageInput);
	constructor(circuitBoard: CircuitBoard, id: string, name: string, desc: string);
	constructor(circuitBoard: CircuitBoard, x: PackageInput | string, name?: string, desc?: string) {
		super(circuitBoard, typeof x == 'string' ? new PackageInput(x, name, desc) : x, 96, 64);

		this.el.text('IN: ' + this.node.inputName).fill('#fff').move(10, 4);
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new PackageInputTag(circuitBoard, PackageInput.import(data.node));
	}
}

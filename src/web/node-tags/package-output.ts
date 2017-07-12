import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import PackageOutput from '../../core/nodes/package-output';

export default class PackageOutputTag extends NodeTag {
	node: PackageOutput;

	constructor(circuitBoard: CircuitBoard, node: PackageOutput);
	constructor(circuitBoard: CircuitBoard, id: string, name: string, desc: string);
	constructor(circuitBoard: CircuitBoard, x: PackageOutput | string, name?: string, desc?: string) {
		super(circuitBoard, typeof x == 'string' ? new PackageOutput(x, name, desc) : x, 96, 64);

		this.el.text('OUT: ' + this.node.outputName).fill('#fff').move(10, 4);
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new PackageOutputTag(circuitBoard, PackageOutput.import(data.node));
	}
}

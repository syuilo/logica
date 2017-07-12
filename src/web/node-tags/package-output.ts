import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import PackageOutput from '../../core/nodes/package-output';

export default class PackageOutputTag extends NodeTag {
	node: PackageOutput;

	constructor(circuitBoard: CircuitBoard, node: PackageOutput);
	constructor(circuitBoard: CircuitBoard, id: string, name: string, desc: string, index: number);
	constructor(circuitBoard: CircuitBoard, x: PackageOutput | string, name?: string, desc?: string, index?: number) {
		super(circuitBoard, typeof x == 'string' ? new PackageOutput(x, name, desc, index) : x, 96, 64);

		this.el.text('OUT: ' + this.node.outputName).fill('#fff').move(10, 4);

		this.rect.dblclick(() => {
			const name = window.prompt('Output name', this.node.outputName);
			const id = window.prompt('Output ID ([a-z0-9_]+)', this.node.outputId);
			const desc = window.prompt('Output description', this.node.outputDesc);
			const index = window.prompt('Output index ([0-9]+)', (this.node.outputIndex || 0).toString()); // 古いバージョンのlogicaデータの互換性のため || 0 しています
			this.node.outputId = id;
			this.node.outputName = name;
			this.node.outputDesc = desc;
			this.node.outputIndex = parseInt(index);
		});
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new PackageOutputTag(circuitBoard, PackageOutput.import(data.node));
	}
}

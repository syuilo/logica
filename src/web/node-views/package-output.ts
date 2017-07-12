import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import PackageOutput from '../../core/nodes/package-output';

export default class PackageOutputView extends NodeView {
	node: PackageOutput;

	constructor(circuitView: CircuitView, node: PackageOutput);
	constructor(circuitView: CircuitView, id: string, name: string, desc: string, index: number);
	constructor(circuitView: CircuitView, x: PackageOutput | string, name?: string, desc?: string, index?: number) {
		super(circuitView, typeof x == 'string' ? new PackageOutput(x, name, desc, index) : x, 96, 64);

		this.el.text('OUT: ' + this.node.outputName).fill('#fff').style('pointer-events: none;').move(10, 4);

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

	public static import(circuitView: CircuitView, data) {
		return new PackageOutputView(circuitView, PackageOutput.import(data.node));
	}
}

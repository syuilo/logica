import CircuitBoard from '../circuit-board';
import NodeTag from '../node';
import PackageInput from '../../core/nodes/package-input';

export default class PackageInputTag extends NodeTag {
	node: PackageInput;

	constructor(circuitBoard: CircuitBoard, node: PackageInput);
	constructor(circuitBoard: CircuitBoard, id: string, name: string, desc: string, index: number);
	constructor(circuitBoard: CircuitBoard, x: PackageInput | string, name?: string, desc?: string, index?: number) {
		super(circuitBoard, typeof x == 'string' ? new PackageInput(x, name, desc, index) : x, 96, 64);

		this.el.text('IN: ' + this.node.inputName).fill('#fff').move(10, 4);

		this.rect.dblclick(() => {
			const name = window.prompt('Input name', this.node.inputName);
			const id = window.prompt('Input ID ([a-z0-9_]+)', this.node.inputId);
			const desc = window.prompt('Input description', this.node.inputDesc);
			const index = window.prompt('Input index ([0-9]+)', (this.node.inputIndex || 0).toString()); // 古いバージョンのlogicaデータの互換性のため || 0 しています
			this.node.inputId = id;
			this.node.inputName = name;
			this.node.inputDesc = desc;
			this.node.inputIndex = parseInt(index);
		});
	}

	public static import(circuitBoard: CircuitBoard, data) {
		return new PackageInputTag(circuitBoard, PackageInput.import(data.node));
	}
}

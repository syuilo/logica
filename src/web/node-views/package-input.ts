import CircuitView from '../circuit-view';
import NodeView from '../node-view';
import PackageInput from '../../core/nodes/package-input';

export default class PackageInputView extends NodeView {
	node: PackageInput;

	constructor(circuitView: CircuitView, node: PackageInput);
	constructor(circuitView: CircuitView, id: string, name: string, desc: string, index: number);
	constructor(circuitView: CircuitView, x: PackageInput | string, name?: string, desc?: string, index?: number) {
		super(circuitView, typeof x == 'string' ? new PackageInput(x, name, desc, index) : x, 96, 64);

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

	public static import(circuitView: CircuitView, data) {
		return new PackageInputView(circuitView, PackageInput.import(data.node));
	}
}

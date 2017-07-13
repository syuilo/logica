import のーど from '../node';
import VirtualNode from '../virtual-node';
import Package from './package';

export default class PackageInput extends VirtualNode {
	type = 'PackageInput';
	desc = 'input of a package パッケージ外部からの入力を受け付けるインターフェースです';

	inputInfo = null;

	outputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'パッケージ外部からの入力'
	}];

	public inputId: string;
	public inputName: string;
	public inputDesc: string;
	public inputIndex: number;

	public parent: Package;

	constructor(id: string, name: string, desc: string, index: number) {
		super();
		this.inputId = id;
		this.inputName = name;
		this.inputDesc = desc;
		this.inputIndex = index;
	}

	public getState() {
		if (this.parent == null) {
			return false;
		} else {
			return this.parent.getInput(this.inputId);
		}
	}

	public getActualInputNodes(): のーど[] {
		throw '';
	}

	export() {
		const data = super.export();
		data.inputId = this.inputId;
		data.inputName = this.inputName;
		data.inputDesc = this.inputDesc;
		data.inputIndex = this.inputIndex;
		return data;
	}

	public static import(data): PackageInput {
		if (data.type !== 'PackageInput') throw 'This data is not PackageInput data';
		const pkgin = new PackageInput(data.inputId, data.inputName, data.inputDesc, data.inputIndex);
		pkgin.name = data.name;
		return pkgin;
	}
}

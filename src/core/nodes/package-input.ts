import のーど from '../node';
import Package from './package';

export default class PackageInput extends のーど {
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

	public parent: Package;

	isVirtual = true;

	constructor(id: string, name: string, desc: string) {
		super();
		this.inputId = id;
		this.inputName = name;
		this.inputDesc = desc;
	}

	update() {
		throw 'Do not call this method because this node is virtual (at PackageInput)';
	}

	export() {
		const data = super.export();
		data.inputId = this.inputId;
		data.inputName = this.inputName;
		data.inputDesc = this.inputDesc;
		return data;
	}

	public static import(data): PackageInput {
		if (data.type !== 'PackageInput') throw 'This data is not PackageInput data';
		const pkgin = new PackageInput(data.inputId, data.inputName, data.inputDesc);
		pkgin.name = data.name;
		return pkgin;
	}
}

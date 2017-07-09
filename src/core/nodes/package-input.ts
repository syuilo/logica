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

	constructor(id: string) {
		super();
		this.inputId = id;
	}

	update() {
		throw 'Do not call this method because this node is virtual (at PackageInput)';
	}
}

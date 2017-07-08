import のーど from '../node';

export default class PackageInput extends のーど {
	name = 'PackageInput';
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

	constructor(id: string) {
		super();
		this.inputId = id;
	}

	update() {
		throw 'Do not call this method because this node is virtual';
	}
}

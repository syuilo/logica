import のーど from '../node';
import Package from './package';


export default class PackageOutput extends のーど {
	type = 'PackageOutput';
	desc = 'output of a package パッケージ外部へ出力するためのインターフェースです';

	inputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'パッケージ外部への入力'
	}];

	outputInfo = null;

	public outputId: string;
	public outputName: string;
	public outputDesc: string;

	public parent: Package;

	constructor(id: string) {
		super();
		this.outputId = id;
	}

	update() {
		throw 'Do not call this method because this node is virtual (at PackageOutput)';
	}
}

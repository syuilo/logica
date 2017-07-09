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

	isVirtual = true;

	constructor(id: string, name: string, desc: string) {
		super();
		this.outputId = id;
		this.outputName = name;
		this.outputDesc = desc;
	}

	update() {
		throw 'Do not call this method because this node is virtual (at PackageOutput)';
	}
}

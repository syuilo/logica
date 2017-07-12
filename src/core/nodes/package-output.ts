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
	public outputIndex: number;

	public parent: Package;

	isVirtual = true;

	constructor(id: string, name: string, desc: string, index: number) {
		super();
		this.outputId = id;
		this.outputName = name;
		this.outputDesc = desc;
		this.outputIndex = index;
	}

	update() {
		throw 'Do not call this method because this node is virtual (at PackageOutput)';
	}

	public addInput(connection) {
		this.inputs.push(connection);
	}

	public removeInput(connection) {
		this.inputs = this.inputs.filter(c => !(c.node == connection.node && c.from == connection.from && c.to == connection.to));
	}

	export() {
		const data = super.export();
		data.outputId = this.outputId;
		data.outputName = this.outputName;
		data.outputDesc = this.outputDesc;
		data.outputIndex = this.outputIndex;
		return data;
	}

	public static import(data): PackageOutput {
		if (data.type !== 'PackageOutput') throw 'This data is not PackageOutput data';
		const pkgo = new PackageOutput(data.outputId, data.outputName, data.outputDesc, data.outputIndex);
		pkgo.name = data.name;
		return pkgo;
	}
}

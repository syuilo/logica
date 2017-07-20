import のーど from '../node';
import { Connection } from '../node';
import VirtualNode from '../virtual-node';
import PackageInput from './package-input';
import PackageOutput from './package-output';
import importNodes from '../import';
import exportNodes from '../export';

export default class Package extends VirtualNode {
	type = 'Package';
	desc = 'ある機能を実現するために構成された回路をひとつのノードとして扱えるように纏めた(抽象化した)もの。';

	public packageName: string;

	public packageAuthor: string;

	public packageDesc: string;

	public nodes: Set<のーど>;

	constructor(nodes: Set<のーど>, packageName: string, packageDesc: string, packageAuthor: string) {
		super();

		this.nodes = nodes;
		this.packageName = packageName;
		this.packageDesc = packageDesc;
		this.packageAuthor = packageAuthor;

		this.nodes.forEach(n => {
			if (n.type === 'PackageOutput') {
				(n as PackageOutput).parent = this;
			}
			if (n.type === 'PackageInput') {
				(n as PackageInput).parent = this;
			}
		});

		this.desc += `\n---\n${ this.packageDesc }\n---\nCreated by ${ this.packageAuthor }`;

		this.inputInfo = Array.from(this.nodes)
			.filter(n => n.type === 'PackageInput')
			.sort((a: PackageInput, b: PackageInput) => a.inputIndex - b.inputIndex)
			.map((pi: PackageInput) => ({
				id: pi.inputId,
				name: pi.inputName,
				desc: pi.inputDesc
			}));

		this.outputInfo = Array.from(this.nodes)
			.filter(n => n.type === 'PackageOutput')
			.sort((a: PackageOutput, b: PackageOutput) => a.outputIndex - b.outputIndex)
			.map((po: PackageOutput) => ({
				id: po.outputId,
				name: po.outputName,
				desc: po.outputDesc
			}));

		Array.from(this.nodes)
			.filter(n => Array.from(n.outputs).find(c => c.to.node.type === 'PackageOutput'))
			.forEach(n => n.on('state-updated', () => {
				this.emit('state-updated');
			}))
	}

	public getState(portId?: string) {
		if (portId == null) {
			if (this.outputInfo.length === 1) {
				portId = this.outputInfo[0].id;
			} else {
				throw 'このパッケージは複数の出力ポートを持っているので、出力ポートIDを省略することはできません';
			}
		}

		const internalOutputNode = Array.from(this.nodes)
			.find(n => n.type === 'PackageOutput' && (n as PackageOutput).outputId === portId);

		return internalOutputNode.getInput();
	}

	public getActualInputNodes(portId?: string): のーど[] {
		if (portId == null) {
			if (this.inputInfo.length === 1) {
				portId = this.inputInfo[0].id;
			} else {
				throw 'このパッケージは複数の入力ポートを持っているので、入力ポートIDを省略することはできません';
			}
		}

		const n = Array.from(this.nodes)
			.find(n => n.type === 'PackageInput' && (n as PackageInput).inputId === portId);

		return n.getActualNextNodes();
	}

	public addInput(connection: Connection) {
		this.inputs.add(connection);
		this.getActualInputNodes(connection.to.port)
			.forEach(n => n.requestUpdateAtNextTick());
	}

	public removeInput(connection: Connection) {
		this.inputs.delete(connection);
	}

	export() {
		const data = super.export();
		data.packageName = this.packageName;
		data.packageDesc = this.packageDesc;
		data.packageAuthor = this.packageAuthor;
		data.nodes = exportNodes(this.nodes);

		return data;
	}

	public static import(data): Package {
		if (data.type !== 'Package') throw 'This data is not Package data';
		const pkg = new Package(new Set(importNodes(data.nodes)), data.packageName, data.packageDesc, data.packageAuthor);
		pkg.name = data.name;
		return pkg;
	}
}

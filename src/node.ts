export type connection = {
	node: のーど;
	from: string;
	to: string;
};

export default abstract class のーど {
	/**
	 * Name of this node
	 */
	name: string;

	/**
	 * Description of this node
	 */
	desc: string;

	public inputs: connection[] = [];

	public outputs: connection[] = [];

	public inputInfo: {
		id: string;
		name: string;
		desc: string;
	}[];

	public outputInfo: {
		id: string;
		name: string;
		desc: string;
	}[];

	public states: { [id: string]: boolean } = {};

	/**
	 * true を返すと次回(next tick)も更新されます
	 */
	public abstract update(): void | boolean;

	protected getInput(id: string) {
		const connection = this.inputs.find(c => c.to === id);
		return connection.node.states[connection.from];
	}

	public connectTo(target: のーど, targetInputId?: string, myOutputId?: string) {
		if (target.inputInfo == null || target.inputInfo.length === 0) {
			throw 'ターゲット ノードは入力ポートを持たないので接続できません';
		}

		if (this.outputInfo == null || this.outputInfo.length === 0) {
			throw 'このノードは出力ポートを持たないので接続できません';
		}

		if (targetInputId == null) {
			if (target.inputInfo.length === 1) {
				targetInputId = target.inputInfo[0].id;
			} else {
				throw 'ターゲット ノードの入力ポートが複数あるので、入力ポートIDを省略することはできません';
			}
		}

		if (myOutputId == null) {
			if (this.outputInfo.length === 1) {
				myOutputId = this.outputInfo[0].id;
			} else {
				throw 'このノードの出力ポートが複数あるので、出力ポートIDを省略することはできません';
			}
		}

		this.outputs.push({
			node: target,
			from: myOutputId,
			to: targetInputId
		});

		target.inputs.push({
			node: this,
			from: myOutputId,
			to: targetInputId
		});
	}
}

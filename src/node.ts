export type connection = {
	node: のーど;
	from: string;
	to: string;
};

export default abstract class のーど {
	/**
	 * Type of this node
	 */
	public type: string;

	/**
	 * Name of this node (for debugging)
	 */
	public name: string;

	/**
	 * Description of this node
	 */
	public desc: string;

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

	/**
	 * 入力が交換法則を満たすか否かを表します
	 */
	public isInputCommutative: boolean = false;

	/**
	 * 回路初期時に信号発生の起点となるか否かを表します
	 */
	public isInitializeRequired: boolean = false;

	protected states: { [id: string]: boolean } = {};

	/**
	 * true を返すと次回(next tick)も更新されます
	 */
	public abstract update(): void | boolean;

	protected getInput(id: string) {
		const connection = this.inputs.find(c => c.to === id);
		return connection.node.getState(connection.from);
	}

	public getState(id: string) {
		return this.states[id];
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
			} else if (target.isInputCommutative) {
				const availablePort = target.inputInfo.find(i => target.inputs.filter(j => j.to === i.id).length === 0);
				if (availablePort != null) {
					targetInputId = availablePort.id;
				} else {
					throw 'ターゲット ノードの入力ポートはすべて既に接続されていて、空きがないため接続できません';
				}
			} else {
				throw 'ターゲット ノードの入力ポートが複数ある(かつ交換法則を満たさない)ので、入力ポートIDを省略することはできません';
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

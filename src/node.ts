import Package from './nodes/package';
import PackageInput from './nodes/package-input';
import PackageOutput from './nodes/package-output';

export type connection = {
	/**
	 * 相手のノード
	 */
	node: のーど;

	/**
	 * 出力ポートのID
	 */
	from: string;

	/**
	 * 入力ポートのID
	 */
	to: string;
};

export type port = {
	/**
	 * ポートID
	 */
	id: string;

	/**
	 * ポート名
	 */
	name: string;

	/**
	 * ポートの説明
	 */
	desc: string;
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

	/**
	 * このノードに入力されている接続
	 */
	public inputs: connection[] = [];

	/**
	 * このノードから出力されている接続
	 */
	public outputs: connection[] = [];

	public inputInfo: port[];

	public outputInfo: port[];

	/**
	 * 入力が交換法則を満たすか否かを表します
	 */
	public isInputCommutative: boolean = false;

	/**
	 * 回路初期時に update が呼ばれることを保証させます
	 */
	public isForceUpdate: boolean = false;

	protected states: { [id: string]: boolean } = {};

	/**
	 * ノードの状態を初期化します
	 */
	public init() {
		this.states = {};
	};

	/**
	 * true を返すと次回(next tick)も更新されます
	 */
	public abstract update(): void | boolean;

	protected getInput(id: string) {
		return this.getActualPreviousNodeState(id);
	}

	public getState(id: string) {
		return this.states.hasOwnProperty(id) ? this.states[id] : false;
	}

	/**
	 * このノードの出力を他のノードの入力に繋ぎます
	 * @param target ターゲット ノード
	 * @param targetInputId ターゲット ノードの入力ポートID
	 * @param myOutputId このノードの出力ポートID
	 */
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

	public getActualPreviousNodeState(portId: string): boolean {
		const c = this.inputs.find(c => c.to === portId);
		const n = c.node;
		if (n.type === 'PackageInput') {
			return (n as PackageInput).parent.getActualPreviousNodeState((n as PackageInput).inputId);
		} else if (n.type === 'Package') {
			return (n as Package).getActualOutputNodeState(c.from);
		} else {
			return n.getState(c.from);
		}
	}

	public getActualNextNodes(portId: string): のーど[] {
		if (this.outputs == null || this.outputs.length === 0) return [this];
		return this.outputs.filter(c => c.from === portId).map(c => {
			const n = c.node;
			if (n.type === 'PackageOutput') {
				return (n as PackageOutput).parent.getActualNextNodes((n as PackageOutput).outputId);
			} else if (n.type === 'Package') {
				return (n as Package).getActualInputNodes(c.to);
			} else {
				return [n];
			}
		}).reduce((a, b) => a.concat(b));
	}
}

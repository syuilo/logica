import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import autobind from 'autobind-decorator';

import VirtualNode from './virtual-node';

/**
 * 回路上に設置でき入力または出力をもつもの全ての基底クラス
 */
@autobind
export default abstract class のーど extends EventEmitter {
	/**
	 * Type of this node
	 */
	public readonly type: string;

	public id: any;

	/**
	 * Name of this node (for debugging)
	 */
	public name: string;

	/**
	 * Description of this node
	 */
	public readonly desc: string;

	/**
	 * このノードに入力されている接続
	 */
	public inputs: Connection[] = [];

	/**
	 * このノードから出力されている接続
	 */
	public outputs: Connection[] = [];

	/**
	 * 入力ポート情報
	 */
	public inputInfo: port[];

	/**
	 * 出力ポート情報
	 */
	public outputInfo: port[];

	/**
	 * 入力ポートがあるか否か
	 * Whether it has input port(s)
	 */
	public get hasInputPorts(): boolean {
		return this.inputInfo != null && this.inputInfo.length > 0;
	}

	/**
	 * 出力ポートがあるか否か
	 * Whether it has output port(s)
	 */
	public get hasOutputPorts(): boolean {
		return this.outputInfo != null && this.outputInfo.length > 0;
	}

	/**
	 * 入力ポートが交換法則を満たすか否かを表します
	 */
	public readonly isInputCommutative: boolean = false;

	/**
	 * 回路初期時に update が呼ばれることを保証させます
	 */
	public readonly isForceUpdate: boolean = false;

	/**
	 * VirtualNodeか否か
	 * Whether it is VirtualNode
	 */
	protected readonly isVirtual: boolean = false;

	public requestUpdateAtNextTick: () => void = () => {};

	/**
	 * ポート毎の出力状態
	 * Output state each ports
	 */
	protected states: { [id: string]: boolean } = {};

	constructor() {
		super();
		this.setMaxListeners(Infinity);
	}

	/**
	 * ノードの状態を初期化します
	 */
	public init() {
		this.states = {};
	};

	/**
	 * 入力が変化したときに呼ばれます
	 */
	public abstract update(inputs: {[id: string]: boolean}): void;

	/**
	 * このノードの指定された出力ポートの出力状態を取得します
	 * @param id 出力ポートID
	 * @return 状態
	 */
	public getState(id?: string): boolean {
		if (id == null) {
			if (this.outputInfo.length === 1) {
				id = this.outputInfo[0].id;
			} else {
				throw 'このノードは複数の出力ポートを持っているので、出力ポートIDを省略することはできません';
			}
		}

		return this.states.hasOwnProperty(id) ? this.states[id] : false;
	}

	protected setState(state: boolean, id?: string) {
		if (id == null) {
			if (this.outputInfo.length === 1) {
				id = this.outputInfo[0].id;
			} else {
				throw 'このノードは複数の出力ポートを持っているので、出力ポートIDを省略することはできません';
			}
		}

		this.states[id] = state;

		this.emit('state-updated');
	}

	/**
	 * このノードの出力を他のノードの入力に繋ぎます
	 * @param target ターゲット ノード
	 * @param targetInputId ターゲット ノードの入力ポートID
	 * @param myOutputId このノードの出力ポートID
	 */
	public connectTo(target: のーど, targetInputId?: string, myOutputId?: string) {
		if (!target.hasInputPorts) {
			throw 'ターゲット ノードは入力ポートを持たないので接続できません';
		}

		if (!this.hasOutputPorts) {
			throw 'このノードは出力ポートを持たないので接続できません';
		}

		if (targetInputId == null) {
			if (target.inputInfo.length === 1) {
				targetInputId = target.inputInfo[0].id;
			} else if (target.isInputCommutative) {
				const availablePort = target.inputInfo
					.find(i => target.inputs
						.filter(j => j.to === i.id).length === 0);

				if (availablePort != null) {
					targetInputId = availablePort.id;
				} else {
					throw 'ターゲット ノードの入力ポートはすべて既に接続されていて、空きがないため接続できません';
				}
			} else {
				throw 'ターゲット ノードが複数の入力ポートを持っている(かつ交換法則を満たさない)ので、入力ポートIDを省略することはできません';
			}
		}

		if (myOutputId == null) {
			if (this.outputInfo.length === 1) {
				myOutputId = this.outputInfo[0].id;
			} else {
				throw 'このノードは複数の出力ポートを持っているので、出力ポートIDを省略することはできません';
			}
		}

		const connection = {
			node: target,
			from: myOutputId,
			to: targetInputId
		};

		this.outputs.push(connection);

		target.addInput({
			node: this,
			from: myOutputId,
			to: targetInputId
		});

		this.emit('connected', connection);

		return connection;
	}

	/**
	 * このノードの指定された出力を指定されたノードの指定された入力から切断します
	 * @param target 対象のノード
	 * @param targetInputId 対象の入力ポートID
	 * @param myOutputId 自分の出力ポートID
	 */
	public disconnectTo(target: のーど, targetInputId: string, myOutputId: string) {
		this.outputs = this.outputs
			.filter(c => !(
				c.node == target &&
				c.from == myOutputId &&
				c.to == targetInputId));

		target.removeInput({
			node: this,
			from: myOutputId,
			to: targetInputId
		});

		this.emit('disconnected', target, targetInputId, myOutputId);
	}

	/**
	 * このノードの指定された入力ポートに接続されているノードの状態を取得します。
	 * @param portId 入力ポートID
	 * @return 状態
	 */
	public getInput(portId?: string): boolean {
		if (!this.hasInputPorts) {
			throw 'このノードには入力ポートがありません';
		}

		if (portId == null) {
			if (this.inputInfo.length === 1) {
				portId = this.inputInfo[0].id;
			} else {
				throw 'このノードは複数の入力ポートを持っているので、入力ポートIDを省略することはできません';
			}
		}

		const c = this.inputs.find(c => c.to === portId);
		if (c == null) {
			return false;
		} else {
			return c.node.getState(c.from);
		}
	}

	/**
	 * 自分の指定された出力ポートに接続されているすべての「実際の」ノードを取得します。
	 * @param portId 出力ポートID
	 * @return ノードの配列
	 */
	public getActualNextNodes(portId?: string): のーど[] {
		if (!this.hasOutputPorts) {
			throw 'このノードには出力ポートがありません';
		}

		if (portId == null) {
			if (this.outputInfo.length === 1) {
				portId = this.outputInfo[0].id;
			} else {
				throw 'このノードは複数の出力ポートを持っているので、出力ポートIDを省略することはできません';
			}
		}

		return this.outputs
			.filter(c => c.from === portId)
			.map(c => c.node.isVirtual ? (c.node as VirtualNode).getActualInputNodes(c.to) : [c.node])
			.reduce((a, b) => a.concat(b), []);
	}

	/**
	 * このノードに入力を追加します
	 * @param Connection 追加する接続
	 */
	public addInput(connection: Connection) {
		if (!this.hasInputPorts) {
			throw 'このノードは入力ポートを持たないので接続されることはできません';
		}

		if (this.inputs.find(c => c.to === connection.to) != null) {
			throw 'このノードの指定された入力ポートは接続済みです';
		}

		this.inputs.push(connection);
		this.requestUpdateAtNextTick();
	}

	/**
	 * このノードから入力を削除します
	 * @param Connection 削除する接続
	 */
	public removeInput(connection: Connection) {
		this.inputs = this.inputs
			.filter(c => !c.isEquivalentTo(connection));

		this.requestUpdateAtNextTick();
	}

	/**
	 * このメソッドは呼び出さないでください(代わりにCircuitのremoveNodeメソッドを利用してください)
	 */
	public remove() {
		this.inputs = [];
		this.outputs.forEach(c => {
			c.node.removeInput({
				node: this,
				from: c.from,
				to: c.to
			});
		});
		this.outputs = [];
		this.emit('removed');
	}

	/**
	 * このノード インスタンスを表すデータを取得します
	 */
	public export(): any {
		return {
			type: this.type,
			id: this.id,
			name: this.name,
			outputs: this.outputs.map(c => ({
				nid: c.node.id,
				from: c.from,
				to: c.to
			}))
		};
	}

	/**
	 * エクスポートされたデータからこのノードのインスタンスを生成します
	 */
	public static import: (data: any) => any;
}

/**
 * ノードのポート間の接続を表すクラス
 */
export class Connection {
	/**
	 * 相手のノード
	 */
	public node: のーど;

	/**
	 * 自分の出力ポートのID
	 */
	public from: string;

	/**
	 * 相手の入力ポートのID
	 */
	public to: string;

	/**
	 * このクラスのインスタンスを作成します。
	 * @param node 相手のノード
	 * @param from 自分の出力ポートID
	 * @param to 相手の入力ポートID
	 */
	constructor(node: のーど, from: string, to: string) {
		this.node = node;
		this.from = from;
		this.to = to;
	}

	/**
	 * 与えられた接続とこの接続が等しいか検証します
	 * @param connection 比較する接続
	 */
	public isEquivalentTo(connection: Connection) {
		return connection.node === this.node &&
			connection.from === this.from &&
			connection.to === this.to;
	}
}

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

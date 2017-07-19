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

		// To avoid memory leak warnings
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
						.filter(j => j.to.port === i.id).length === 0);

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

		const connection = new Connection(this, myOutputId, target, targetInputId);

		this.addOutput(connection);
		target.addInput(connection);

		return connection;
	}

	/**
	 * このノードの指定された出力を指定されたノードの指定された入力ポートから切断します
	 * @param target 対象のノード
	 * @param targetInputId 対象の入力ポートID
	 * @param myOutputId 自分の出力ポートID
	 */
	public disconnectFrom(target: のーど, targetInputId: string, myOutputId: string) {
		// 当該接続を検索
		const connection = this.outputs
			.find(c =>
				c.from.node === this &&
				c.from.port === myOutputId &&
				c.to.node === target &&
				c.to.port === targetInputId);

		if (connection == null) {
			throw '指定された接続は見つかりませんでした。';
		}

		this.outputs = this.outputs
			.filter(c => c !== connection);

		target.removeInput(connection);

		this.emit('disconnected', connection);
	}

	/**
	 * このノードの指定された入力ポートの入力状態を取得します。
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

		const c = this.inputs.find(c => c.to.port === portId);
		if (c == null) {
			return false;
		} else {
			return c.from.node.getState(c.from.port);
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
			.filter(c => c.from.port === portId)
			.map(c => c.to.node.isVirtual
				? (c.to.node as VirtualNode).getActualInputNodes(c.to.port)
				: [c.to.node])
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
			.filter(c => c !== connection);

		this.requestUpdateAtNextTick();
	}

	public addOutput(connection: Connection) {
		this.outputs.push(connection);

		this.emit('connected', connection);
	}

	public removeOutput(connection: Connection) {
		this.outputs = this.outputs
			.filter(c => c !== connection);

		this.emit('disconnected', connection);
	}

	/**
	 * このメソッドは呼び出さないでください(代わりにCircuitのremoveNodeメソッドを利用してください)
	 */
	public remove() {
		this.inputs = [];
		this.outputs.forEach(c => {
			c.to.node.removeInput(c);
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
				nid: c.to.node.id,
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
	 * 出力する側
	 */
	public from: {
		/**
		 * ノード
		 */
		node: のーど;

		/**
		 * ポートID
		 */
		port: string;
	};

	/**
	 * 入力される側
	 */
	public to: {
		/**
		 * ノード
		 */
		node: のーど;

		/**
		 * ポートID
		 */
		port: string;
	};

	/**
	 * このクラスのインスタンスを作成します。
	 * @param fromNode 入力する側のノード
	 * @param fromPort 入力する側のノードの出力ポートID
	 * @param toNode 入力される側のノード
	 * @param toPort 入力される側のノードの入力ポートID
	 */
	constructor(fromNode: のーど, fromPort: string, toNode: のーど, toPort: string) {
		this.from = {
			node: fromNode,
			port: fromPort
		};
		this.to = {
			node: toNode,
			port: toPort
		};
	}

	/**
	 * この接続を削除します
	 */
	public destroy() {
		this.from.node.removeOutput(this);
		this.to.node.removeInput(this);
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

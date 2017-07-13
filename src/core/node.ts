import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import autobind from 'autobind-decorator';

import Package from './nodes/package';
import PackageInput from './nodes/package-input';
import PackageOutput from './nodes/package-output';
import Pin from './nodes/pin';

@autobind
abstract class のーど extends EventEmitter {
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
	public readonly isInputCommutative: boolean = false;

	/**
	 * 回路初期時に update が呼ばれることを保証させます
	 */
	public readonly isForceUpdate: boolean = false;

	public requestUpdateAtNextTick: () => void = () => {};

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

	public getState(id?: string) {
		if (id == null) {
			if (this.outputInfo.length === 1) {
				id = this.outputInfo[0].id;
			} else {
				throw 'このノードは出力ポートを複数持っているので、出力ポートIDを省略することはできません';
			}
		}

		return this.states.hasOwnProperty(id) ? this.states[id] : false;
	}

	protected setState(state: boolean, id?: string) {
		if (id == null) {
			if (this.outputInfo.length === 1) {
				id = this.outputInfo[0].id;
			} else {
				throw 'このノードの出力ポートが複数あるので、出力ポートIDを省略することはできません';
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
				throw `このノード(${ this.type })の出力ポートが複数あるので、出力ポートIDを省略することはできません`;
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

	public disconnectTo(target: のーど, targetInputId: string, myOutputId: string) {
		this.outputs = this.outputs.filter(c => !(c.node == target && c.from == myOutputId && c.to == targetInputId));

		target.removeInput({
			node: this,
			from: myOutputId,
			to: targetInputId
		});

		this.emit('disconnected', target, targetInputId, myOutputId);
	}

	/**
	 * このノードの指定された入力ポートに接続されているノードの状態を取得します。
	 * @param portId 遡る起点となる自分の入力ポートID
	 * @return 状態
	 */
	public getInput(portId?: string): boolean {
		if (portId == null) {
			if (this.inputInfo.length === 1) {
				portId = this.inputInfo[0].id;
			} else if (this.inputInfo.length === 0) {
				throw 'このノードに入力ポートがありません';
			} else {
				throw 'このノードは入力ポートを複数持っているので、入力ポートIDを省略することはできません';
			}
		}

		const c = this.inputs.find(c => c.to === portId);
		if (c == null) {
			return false;
		} else {
			return c.node.getState(portId);
		}
	}

	/**
	 * 自分の指定された出力ポートに接続されているすべての「実際の」ノードを取得します。
	 * @param portId 自分の出力ポートID
	 */
	public getActualNextNodes(portId?: string): のーど[] {
		if (this.outputs == null || this.outputs.length === 0) {
			return [];
		}

		if (portId == null) {
			if (this.outputInfo.length === 1) {
				portId = this.outputInfo[0].id;
			} else {
				throw 'このノードは出力ポートを複数持っているので、出力ポートIDを省略することはできません';
			}
		}

		return this.outputs.filter(c => c.from === portId).map(c => {
			const node = c.node;
			return node.getRealNodes(c.to);
		}).reduce((a, b) => a.concat(b), []);
	}

	/**
	 * 入力が来たとき、それが実際に接続されることになるノードを取得します。
	 * @param portId このノードの入力ポートID
	 */
	public getRealNodes(portId?: string): のーど[] {
		return [this];
	}

	public addInput(connection: connection) {
		this.inputs.push(connection);
		this.requestUpdateAtNextTick();
	}

	public removeInput(connection: connection) {
		this.inputs = this.inputs.filter(c => !(c.node == connection.node && c.from == connection.from && c.to == connection.to));
		this.requestUpdateAtNextTick();
	}

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

	public static import: (data: any) => any;
}

export default のーど;

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

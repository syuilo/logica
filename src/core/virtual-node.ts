import のーど from './node';

/**
 * 更新の対象にならない(=遅延を発生させない)ノード
 */
abstract class VirtualNode extends のーど {
	isVirtual = true;

	constructor() {
		super();
	}

	/**
	 * 入力が来たとき、それが実際に接続されることになるノードを取得します。
	 * @param portId このノードの入力ポートID
	 */
	public abstract getActualInputNodes(portId?: string): のーど[];

	update() {
		throw `Do not update this node because it (${ this.type }) is virtual`;
	}
}

export default VirtualNode;

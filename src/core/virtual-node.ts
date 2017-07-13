import のーど from './node';

/**
 * 更新の対象にならないノード
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
		throw `Do not call this method because this node (${ this.type }) is virtual`;
	}
}

export default VirtualNode;

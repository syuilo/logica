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
	public inputInfo: any;
	public outputInfo: any;
	public states: { [id: string]: boolean } = {};

	/**
	 * true を返すと次回(next tick)も更新されます
	 */
	public abstract update(): void | boolean;

	protected getInput(id: string) {
		const connection = this.inputs.find(c => c.to === id);
		return connection.node.states[connection.from];
	}

	// TODO: 入力が一つしかないノードに接続する場合はIDを省略できるようにする
	public connectTo(myOutputId: string, target: のーど, targetInputId: string) {
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

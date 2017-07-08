export type connection = {
	node: のーど;
	from: string;
	to: string;
};

export default abstract class のーど {
	public inputs: connection[];
	public outputs: connection[];
	public inputInfo: any;
	public outputInfo: any;
	public states: { [id: string]: boolean };
	public isPackage: boolean = false;

	/**
	 * true を返すと次回(next tick)も更新されます
	 */
	public update: () => void | boolean;

	protected getInput(id: string) {
		const connection = this.inputs.find(c => c.to === id);
		return connection.node.states[connection.from];
	}
}

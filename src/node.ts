export default abstract class のーど {
	public numberOfInputs: number;
	public inputs: のーど[];
	public outputs: のーど[];
	public state: boolean;

	public get isOn() {
		return this.state;
	}

	public get isOff() {
		return !this.state;
	}

	/**
	 * true を返すと次回(next tick)も更新されます
	 */
	public update: () => void | boolean;
}

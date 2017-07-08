import のーど from '../../node';

/**
 * Alertデバイス
 */
export default class Alert extends のーど {
	numberOfInputs = 0;

	public msg: string;

	update() {
		if (this.inputs[0].isOn) alert(this.msg);
	}
}

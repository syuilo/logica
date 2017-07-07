import のーど from '../../node';

/**
 * Alertデバイス
 */
class Alert extends のーど {
	numberOfInputs = 0;

	public msg: string;

	update() {
		if (this.inputs[0].isOn) alert(this.msg);
	}
}

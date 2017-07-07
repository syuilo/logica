import のーど from '../../node';

/**
 * ORゲート
 */
class Or extends のーど {
	numberOfInputs = 2;

	update() {
		this.state = this.inputs[0].isOn || this.inputs[1].isOn;
	}
}

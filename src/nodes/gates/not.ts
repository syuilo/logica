import のーど from '../../node';

/**
 * NOTゲート
 */
class Not extends のーど {
	numberOfInputs = 1;

	update() {
		this.state = !this.inputs[0].state;
	}
}

import のーど from '../../node';

/**
 * NOTゲート
 */
export default class Not extends のーど {
	numberOfInputs = 1;

	update() {
		this.state = !this.inputs[0].state;
	}
}

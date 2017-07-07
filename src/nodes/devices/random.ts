import のーど from '../../node';

export default class Rnd extends のーど {
	numberOfInputs = 0;

	update() {
		this.state = Math.random() > 0.5;
		return true;
	}
}

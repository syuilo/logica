import のーど from '../../node';

/**
 * NOTゲート
 */
export default class Not extends のーど {
	type = 'Not';
	desc = 'Not gate';

	inputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'Input'
	}];

	outputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'Inverted X'
	}];

	update() {
		this.setState(!this.getInput('x'));
	}
}

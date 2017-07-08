import のーど from '../../node';

/**
 * NOTゲート
 */
export default class Not extends のーど {
	name = 'Not';
	desc = 'Not gate';

	inputInfo = {
		x: {
			name: 'X',
			desc: 'Input'
		}
	};

	outputInfo = {
		x: {
			name: 'X',
			desc: 'Inverted X'
		}
	};

	update() {
		this.states['x'] = !this.getInput('x');
	}
}

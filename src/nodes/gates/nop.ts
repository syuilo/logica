import のーど from '../../node';

export default class Nop extends のーど {
	name = 'Nop';
	desc = 'No operation. This gate will nothing to do.';

	inputInfo = {
		x: {
			name: 'X',
			desc: 'Input X'
		}
	};

	outputInfo = {
		x: {
			name: 'X',
			desc: 'Input X'
		}
	};

	update() {
		this.states['x'] = this.getInput('x');
	}
}

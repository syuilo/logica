import のーど from '../../node';

/**
 * ORゲート
 */
export default class Or extends のーど {
	name = 'Or';
	desc = 'Or gate';

	inputInfo = {
		a: {
			name: 'A',
			desc: 'Input A'
		},
		b: {
			name: 'B',
			desc: 'Input B'
		}
	};

	outputInfo = {
		a_or_b: {
			name: 'A or B',
			desc: 'Whether one or both the inputs to the gate are HIGH'
		}
	};

	update() {
		this.states['a_or_b'] = this.getInput('a') || this.getInput('b');
	}
}

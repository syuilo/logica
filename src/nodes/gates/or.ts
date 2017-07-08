import のーど from '../../node';

/**
 * ORゲート
 */
export default class Or extends のーど {
	inputInfo = {
		a: {
			desc: 'Input A'
		},
		b: {
			desc: 'Input B'
		}
	};

	outputInfo = {
		a_or_b: {
			desc: 'Whether one or both the inputs to the gate are HIGH'
		}
	};

	update() {
		this.states['a_or_b'] = this.getInput('a') || this.getInput('b');
	}
}

import のーど from '../../node';

/**
 * ANDゲート
 */
export default class And extends のーど {
	name = 'And';
	desc = 'And gate';

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
		a_and_b: {
			name: 'A and B',
			desc: 'Whether both the inputs to the gate are HIGH'
		}
	};

	update() {
		this.states['a_and_b'] = this.getInput('a') && this.getInput('b');
	}
}

import のーど from '../../node';

/**
 * TRUE
 */
export default class True extends のーど {
	name = 'True';
	desc = 'Always HIGH';

	inputInfo = null;

	outputInfo = {
		x: {
			name: 'High',
			desc: 'Always HIGH'
		}
	};

	update() {
		this.states['x'] = true;
	}
}

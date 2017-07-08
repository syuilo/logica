import のーど from '../../node';

/**
 * FALSE
 */
export default class False extends のーど {
	name = 'False';
	desc = 'Always LOW';

	inputInfo = null;

	outputInfo = {
		x: {
			name: 'Low',
			desc: 'Always LOW'
		}
	};

	constructor() {
		super();
		this.states['x'] = false;
	}

	update() {}
}

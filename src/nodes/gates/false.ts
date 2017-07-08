import のーど from '../../node';

/**
 * FALSE
 */
export default class False extends のーど {
	type = 'False';
	desc = 'Always LOW';

	inputInfo = null;

	outputInfo = [{
		id: 'x',
		name: 'Low',
		desc: 'Always LOW'
	}];

	constructor() {
		super();
		this.states['x'] = false;
	}

	update() {}
}

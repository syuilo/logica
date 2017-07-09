import のーど from '../../node';

/**
 * TRUE
 */
export default class True extends のーど {
	type = 'True';
	desc = 'Always HIGH';

	inputInfo = null;

	outputInfo = [{
		id: 'x',
		name: 'High',
		desc: 'Always HIGH'
	}];

	isForceUpdate = true;

	update() {
		this.states['x'] = true;
	}
}

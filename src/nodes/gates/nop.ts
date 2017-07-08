import のーど from '../../node';

export default class Nop extends のーど {
	name = 'Nop';
	desc = 'No operation. This gate will nothing to do.';

	inputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'Input'
	}];

	outputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'Input'
	}];

	update() {
		this.states['x'] = this.getInput('x');
	}
}

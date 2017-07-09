import のーど from '../node';

export default class Led extends のーど {
	type = 'Led';
	desc = 'Input only';

	inputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'Input'
	}];

	update() {
		this.emit('input-updated', this.getInput());
	}
}

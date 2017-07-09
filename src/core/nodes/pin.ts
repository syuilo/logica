import のーど from '../node';

export default class Pin extends のーど {
	type = 'Pin';
	desc = 'Nothing to do';

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

	isVirtual = true;

	update() {
		throw 'Do not call this method because this node is virtual (at Pin)';
	}
}

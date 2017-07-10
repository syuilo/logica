import のーど from '../node';

export default class Nop extends のーど {
	type = 'Nop';
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
		this.setState(this.getInput('x'));
	}

	public static import(data): Nop {
		if (data.type !== 'Nop') throw 'This data is not Nop data';
		const nop = new Nop();
		nop.name = data.name;
		return nop;
	}
}

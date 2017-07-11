import のーど from '../node';

/**
 * XORゲート
 */
export default class Xor extends のーど {
	type = 'Xor';
	desc = 'Xor gate';

	isInputCommutative = true;

	inputInfo = [{
		id: 'a',
		name: 'A',
		desc: 'Input A'
	}, {
		id: 'b',
		name: 'B',
		desc: 'Input B'
	}];

	outputInfo = [{
		id: 'a_xor_b',
		name: 'A xor B',
		desc: '片方のみがHIGHかどうか'
	}];

	update(inputs) {
		this.setState((inputs['a'] || inputs['b']) && !(inputs['a'] && inputs['b']));
	}

	public static import(data): Xor {
		if (data.type !== 'Xor') throw 'This data is not Xor data';
		const xor = new Xor();
		xor.name = data.name;
		return xor;
	}
}

import のーど from '../node';

/**
 * ORゲート(3)
 */
export default class Or3 extends のーど {
	type = 'Or3';
	desc = 'Or gate (3 inputs)';

	isInputCommutative = true;

	inputInfo = [{
		id: 'a',
		name: 'A',
		desc: 'Input A'
	}, {
		id: 'b',
		name: 'B',
		desc: 'Input B'
	}, {
		id: 'c',
		name: 'C',
		desc: 'Input C'
	}];

	outputInfo = [{
		id: 'a_or_b_or_c',
		name: 'A, B or C',
		desc: '3つの入力のうちどれか1つでもHIGHか否か'
	}];

	update(inputs) {
		this.setState(inputs['a'] || inputs['b'] || inputs['c']);
	}

	public static import(data): Or3 {
		if (data.type !== 'Or3') throw 'This data is not Or3 data';
		const or3 = new Or3();
		or3.name = data.name;
		return or3;
	}
}

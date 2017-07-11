import のーど from '../node';

/**
 * ANDゲート(3)
 */
export default class And3 extends のーど {
	type = 'And3';
	desc = 'And gate (3 inputs)';

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
		id: 'a_and_b_and_c',
		name: 'A, B and C',
		desc: 'Whether all the inputs to the gate are HIGH'
	}];

	update(inputs) {
		this.setState(inputs['a'] && inputs['b'] && inputs['c']);
	}

	public static import(data): And3 {
		if (data.type !== 'And3') throw 'This data is not And3 data';
		const and3 = new And3();
		and3.name = data.name;
		return and3;
	}
}

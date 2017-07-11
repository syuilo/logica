import のーど from '../node';

/**
 * ORゲート
 */
export default class Or extends のーど {
	type = 'Or';
	desc = 'Or gate';

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
		id: 'a_or_b',
		name: 'A or B',
		desc: 'Whether one or both the inputs to the gate are HIGH'
	}];

	update(inputs) {
		this.setState(inputs['a'] || inputs['b']);
	}

	public static import(data): Or {
		if (data.type !== 'Or') throw 'This data is not Or data';
		const or = new Or();
		or.name = data.name;
		return or;
	}
}

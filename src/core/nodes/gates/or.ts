import のーど from '../../node';

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

	update() {
		this.setState(this.getInput('a') || this.getInput('b'));
	}
}

import のーど from '../../node';

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

	update() {
		this.setState(this.getInput('a') && this.getInput('b') && this.getInput('c'));
	}
}

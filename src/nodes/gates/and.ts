import のーど from '../../node';

/**
 * ANDゲート
 */
export default class And extends のーど {
	name = 'And';
	desc = 'And gate';

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
		id: 'a_and_b',
		name: 'A and B',
		desc: 'Whether both the inputs to the gate are HIGH'
	}];

	update() {
		this.states['a_and_b'] = this.getInput('a') && this.getInput('b');
	}
}

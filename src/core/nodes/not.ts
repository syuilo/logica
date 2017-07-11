import のーど from '../node';

/**
 * NOTゲート
 */
export default class Not extends のーど {
	type = 'Not';
	desc = 'Not gate';

	inputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'Input'
	}];

	outputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'Inverted X'
	}];

	isForceUpdate = true;

	update(inputs) {
		this.setState(!inputs['x']);
	}

	public static import(data): Not {
		if (data.type !== 'Not') throw 'This data is not Not data';
		const not = new Not();
		not.name = data.name;
		return not;
	}
}

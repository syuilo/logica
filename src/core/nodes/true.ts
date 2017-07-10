import のーど from '../node';

/**
 * TRUE
 */
export default class True extends のーど {
	type = 'True';
	desc = 'Always HIGH';

	inputInfo = null;

	outputInfo = [{
		id: 'x',
		name: 'High',
		desc: 'Always HIGH'
	}];

	isForceUpdate = true;

	update() {
		this.setState(true);
	}

	public static import(data): True {
		if (data.type !== 'True') throw 'This data is not True data';
		const t = new True();
		t.name = data.name;
		return t;
	}
}

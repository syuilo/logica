import のーど from '../node';

/**
 * FALSE
 */
export default class False extends のーど {
	type = 'False';
	desc = 'Always LOW';

	inputInfo = null;

	outputInfo = [{
		id: 'x',
		name: 'Low',
		desc: 'Always LOW'
	}];

	update() {
		this.setState(false);
	}

	public static import(data): False {
		if (data.type !== 'False') throw 'This data is not False data';
		const f = new False();
		f.name = data.name;
		return f;
	}
}

import のーど from '../node';

/**
 * Random
 */
export default class Random extends のーど {
	type = 'Random';
	desc = 'ランダムにHIGHとLOWが切り替わるデバイス';

	outputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'Random'
	}];

	isForceUpdate = true;

	update() {
		this.setState(Math.random() > 0.5);
		this.requestUpdateAtNextTick();
	}

	public static import(data): Random {
		if (data.type !== 'Random') throw 'This data is not Random data';
		const rnd = new Random();
		rnd.name = data.name;
		return rnd;
	}
}

import のーど from '../node';

export default class RandomDelay extends のーど {
	type = 'RandomDelay';
	desc = '信号を1～2tick遅延させます。タイミングの揺らぎを表現できます。';

	inputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'Input'
	}];

	outputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'Input'
	}];

	delay = -1;
	count = 0;
	nextState = false;

	update(inputs) {
		if (this.nextState != inputs['x'] || this.delay == -1) {
			this.nextState = inputs['x'];
			this.delay = Math.round(Math.random()); // 0 or 1
			this.count = 0;
			this.requestUpdateAtNextTick();
		}
		else if (this.count < this.delay) {
			this.count++;
			this.requestUpdateAtNextTick();
		}
		else {
			this.setState(this.nextState);
			this.delay = -1;
		}
	}

	public static import(data): RandomDelay {
		if (data.type !== 'RandomDelay') throw 'This data is not RandomDelay data';
		const randomDelay = new RandomDelay();
		randomDelay.name = data.name;
		return randomDelay;
	}
}

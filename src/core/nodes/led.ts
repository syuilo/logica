import のーど from '../node';

export default class Led extends のーど {
	type = 'Led';
	desc = 'Input only';

	inputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'Input'
	}];

	update(inputs) {
		this.emit('input-updated', inputs['x']);
	}

	public static import(data): Led {
		if (data.type !== 'Led') throw 'This data is not Led data';
		const led = new Led();
		led.name = data.name;
		return led;
	}
}

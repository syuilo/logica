import のーど from '../node';

export default class Nop extends のーど {
	type = 'Nop';
	desc = 'No operation. This gate will nothing to do.\n何もしません。ただ入力された信号をそのまま出力するだけです。信号は他のゲート同様に1tick遅れるため、意図的に信号を遅延させたい場合に有用です。';

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

	update(inputs) {
		this.setState(inputs['x']);
	}

	public static import(data): Nop {
		if (data.type !== 'Nop') throw 'This data is not Nop data';
		const nop = new Nop();
		nop.name = data.name;
		return nop;
	}
}

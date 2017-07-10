import のーど from '../node';

/**
 * NORゲート
 */
export default class Nor extends のーど {
	type = 'Nor';
	desc = 'Nor gate. 全ての入力がLowの場合のみ出力がHighになり、Highの入力がひとつでもある場合はLowを出力します';

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
		id: 'a_nor_b',
		name: 'A nor B',
		desc: 'すべての入力がLOWかどうか'
	}];

	update() {
		this.setState(!(this.getInput('a') || this.getInput('b')));
	}

	public static import(data): Nor {
		if (data.type !== 'Nor') throw 'This data is not Nor data';
		const nor = new Nor();
		nor.name = data.name;
		return nor;
	}
}

import のーど from '../node';

/**
 * NANDゲート
 */
export default class Nand extends のーど {
	type = 'Nand';
	desc = 'Nand gate. 全ての入力がHighならLow、Lowの入力がひとつでもある場合はHighを出力します';

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
		id: 'a_nand_b',
		name: 'A nand B',
		desc: 'Lowの入力がひとつでもあるかどうか'
	}];

	update(inputs) {
		this.setState(!(inputs['a'] && inputs['b']));
	}

	public static import(data): Nand {
		if (data.type !== 'Nand') throw 'This data is not Nand data';
		const nand = new Nand();
		nand.name = data.name;
		return nand;
	}
}

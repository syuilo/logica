import のーど from '../node';

/**
 * button
 */
export default class Button extends のーど {
	type = 'Button';
	desc = '押すたびにHIGHとLOWが切り替わる仮想的なボタン(スイッチ)です';

	inputInfo = null;

	outputInfo = [{
		id: 'x',
		name: 'X',
		desc: 'ボタンの状態(ON -> HIGH, OFF -> LOW)'
	}];

	isForceUpdate = true;

	update() {}

	public click() {
		this.setState(!this.getState());
		this.requestUpdateAtNextTick();
	}

	public __on() {
		this.setState(true);
		this.requestUpdateAtNextTick();
	}

	public __off() {
		this.setState(false);
		this.requestUpdateAtNextTick();
	}

	public static import(data): Button {
		if (data.type !== 'Button') throw 'This data is not Button data';
		const btn = new Button();
		btn.name = data.name;
		return btn;
	}
}

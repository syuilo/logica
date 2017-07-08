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
		this.states['x'] = !this.states['x'];
		this.requestUpdateAtNextTick();
	}

	public on() {
		this.states['x'] = true;
		this.requestUpdateAtNextTick();
	}

	public off() {
		this.states['x'] = false;
		this.requestUpdateAtNextTick();
	}
}

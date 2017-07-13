import autobind from 'autobind-decorator';
import のーど from '../node';
import VirtualNode from '../virtual-node';

export default class Pin extends VirtualNode {
	type = 'Pin';
	desc = 'Nothing to do';

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

	public getState() {
		return this.getInput();
	}

	public getActualInputNodes(): のーど[] {
		return this.getActualNextNodes();
	}

	@autobind
	private emitStateUpdated() {
		this.emit('state-updated');
	}

	public addInput(connection) {
		this.inputs.push(connection);
		this.emit('state-updated');
		connection.node.on('state-updated', this.emitStateUpdated);
		this.getActualNextNodes().forEach(n => n.requestUpdateAtNextTick());
	}

	public removeInput(connection) {
		this.inputs = this.inputs.filter(c => !(c.node == connection.node && c.from == connection.from && c.to == connection.to));
		this.emit('state-updated');
		connection.node.off('state-updated', this.emitStateUpdated);
		this.getActualNextNodes().forEach(n => n.requestUpdateAtNextTick());
	}

	public static import(data): Pin {
		if (data.type !== 'Pin') throw 'This data is not Pin data';
		const pin = new Pin();
		pin.name = data.name;
		return pin;
	}
}

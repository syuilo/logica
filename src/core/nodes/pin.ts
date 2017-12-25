import autobind from 'autobind-decorator';
import のーど from '../node';
import { Connection } from '../node';
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
	private onInputStateUpdated(node: のーど, port, state) {
		this.emit('state-updated');
	}

	public addInput(connection: Connection) {
		this.inputs.add(connection);
		this.emit('state-updated');
		connection.from.node.on('state-updated', this.onInputStateUpdated);
		this.getActualNextNodes().forEach(n => n.requestUpdateAtNextTick());
	}

	public removeInput(connection: Connection) {
		this.inputs.delete(connection);
		this.emit('state-updated');
		connection.from.node.off('state-updated', this.onInputStateUpdated);
		this.getActualNextNodes().forEach(n => n.requestUpdateAtNextTick());
	}

	public static import(data): Pin {
		if (data.type !== 'Pin') throw 'This data is not Pin data';
		const pin = new Pin();
		pin.name = data.name;
		return pin;
	}
}

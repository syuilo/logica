import のーど from '../node';

export default class Pin extends のーど {
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

	isVirtual = true;

	constructor() {
		super();

		// BIND -------------------------------------------------
		this.emitStateUpdated = this.emitStateUpdated.bind(this);
		// ------------------------------------------------------
	}

	update() {
		throw 'Do not call this method because this node is virtual (at Pin)';
	}

	private emitStateUpdated() {
		this.emit('stateUpdated');
	}

	public addInput(connection) {
		this.inputs.push(connection);
		this.emit('stateUpdated');
		connection.node.on('stateUpdated', this.emitStateUpdated);
		this.getActualNextNodes('x').forEach(n => n.requestUpdateAtNextTick());
	}

	public removeInput(connection) {
		this.inputs = this.inputs.filter(c => !(c.node == connection.node && c.from == connection.from && c.to == connection.to));
		this.emit('stateUpdated');
		connection.node.off('stateUpdated', this.emitStateUpdated);
		this.getActualNextNodes('x').forEach(n => n.requestUpdateAtNextTick());
	}

	public static import(data): Pin {
		if (data.type !== 'Pin') throw 'This data is not Pin data';
		const pin = new Pin();
		pin.name = data.name;
		return pin;
	}
}

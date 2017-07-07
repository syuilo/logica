class Circuit {
	public devices: Set<Device>;
	private shouldUpdates: Set<Device>;

	constructor(devices: Set<Device>) {
		this.devices = devices;
		this.shouldUpdates = devices;
		this.tick();
	}

	public tick() {
		this.shouldUpdates.forEach(d => {
			if (!d.update()) this.shouldUpdates.delete(d);
			d.outputs.forEach(d => this.shouldUpdates.add(d));
		});
	}

	public addDevice(device: Device) {
		this.devices.add(device);
		this.shouldUpdates.add(device);
	}
}

abstract class Device {
	numberOfInputs: number;
	inputs: Device[];
	outputs: Device[];
	state: boolean;
	get isOn() {
		return this.state;
	}
	get isOff() {
		return !this.state;
	}

	/**
	 * true を返すと次回(next tick)も更新されます
	 */
	public update: () => void | boolean;
}

class And extends Device {
	numberOfInputs = 2;

	update() {
		this.state = this.inputs[0].isOn && this.inputs[1].isOn;
	}
}

class Nop extends Device {
	numberOfInputs = 1;

	update() {
		this.state = this.inputs[0].state;
	}
}

class Rnd extends Device {
	numberOfInputs = 0;

	update() {
		this.state = Math.random() > 0.5;
		return true;
	}
}

class Button extends Device {
	numberOfInputs = 0;

}



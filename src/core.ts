class Circuit {
	public nodes: Set<Node>;
	private shouldUpdates: Set<Node>;

	constructor(nodes: Set<Node>) {
		this.nodes = nodes;
		this.shouldUpdates = nodes;
		this.tick();
	}

	public tick() {
		this.shouldUpdates.forEach(node => {
			if (!node.update()) this.shouldUpdates.delete(node);
			node.outputs.forEach(node => this.shouldUpdates.add(node));
		});
	}

	public addNode(node: Node) {
		this.nodes.add(node);
		this.shouldUpdates.add(node);
	}
}

abstract class Node {
	public numberOfInputs: number;
	public inputs: Node[];
	public outputs: Node[];
	public state: boolean;

	public get isOn() {
		return this.state;
	}

	public get isOff() {
		return !this.state;
	}

	/**
	 * true を返すと次回(next tick)も更新されます
	 */
	public update: () => void | boolean;
}

/**
 * ANDゲート
 */
class And extends Node {
	numberOfInputs = 2;

	update() {
		this.state = this.inputs[0].isOn && this.inputs[1].isOn;
	}
}

/**
 * ORゲート
 */
class Or extends Node {
	numberOfInputs = 2;

	update() {
		this.state = this.inputs[0].isOn || this.inputs[1].isOn;
	}
}

/**
 * NOTゲート
 */
class Not extends Node {
	numberOfInputs = 1;

	update() {
		this.state = !this.inputs[0].state;
	}
}

class Nop extends Node {
	numberOfInputs = 1;

	update() {
		this.state = this.inputs[0].state;
	}
}

class Rnd extends Node {
	numberOfInputs = 0;

	update() {
		this.state = Math.random() > 0.5;
		return true;
	}
}

/**
 * Alertデバイス
 */
class Alert extends Node {
	numberOfInputs = 0;

	public msg: string;

	update() {
		if (this.inputs[0].isOn) alert(this.msg);
	}
}

class Button extends Node {
	numberOfInputs = 0;

}



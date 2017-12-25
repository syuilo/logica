import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import autobind from 'autobind-decorator';

import のーど from '../core/node';
import { Connection } from '../core/node';
import Package from '../core/nodes/package';

import NodesView from './nodes-view';
import Config from './config';

@autobind
abstract class NodeViewModel extends EventEmitter {
	id: string;

	node: のーど;

	private _width: number;
	private _height: number;
	private _x: number;
	private _y: number;

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	set x(x) {
		this._x = x;
	}

	set y(y) {
		this._y = y;
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	/**
	 * この値を操作しないでください
	 *
	 * 0 ... ↑ (default)
	 * 1 ... →
	 * 2 ... ↓
	 * 3 ... ←
	 */
	public rotate: number = 0;

	inputPorts: any[] = [];
	outputPorts: any[] = [];

	nodesView: NodesView;

	config: Config;

	constructor(config: Config, nodesView: NodesView, node: のーど, w: number, h: number) {
		super();

		this.setMaxListeners(Infinity);

		this.config = config;
		this.nodesView = nodesView;
		this.node = node;

		this._width = w;
		this._height = h;
	}


	/**
	 * 移動します
	 * @param x X位置
	 * @param y Y位置
	 */
	public move(x: number, y: number) {
		if (this.config.snapToGrid) {
			const gridSize = 16;
			x = Math.round(x / gridSize) * gridSize;
			y = Math.round(y / gridSize) * gridSize;
		}

		if (x !== this.x || y !== this.y) {
			this.emit('moved');
		}
	}

	/**
	 * 回転します
	 * @param r 0~4
	 */
	public setRotate(r: number) {
		if (r > 3) r = 0;
		this.rotate = r;
		this.emit('moved');
	}

}

export default NodeViewModel;

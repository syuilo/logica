const msgpack = require('msgpack-lite');

import Circuit from '../core/circuit';

import importNodes from '../core/import';

import CircuitView from './circuit-view';

import AndView from './node-views/and';
import And3View from './node-views/and3';
import OrView from './node-views/or';
import Or3View from './node-views/or3';
import NotView from './node-views/not';
import NorView from './node-views/nor';
import NandView from './node-views/nand';
import XorView from './node-views/xor';
import TrueView from './node-views/true';
import FalseView from './node-views/false';
import NopView from './node-views/nop';
import RandomView from './node-views/random';
import ButtonView from './node-views/button';
import LedView from './node-views/led';
import PinView from './node-views/pin';
import PackageView from './node-views/package';
import PackageInputView from './node-views/package-input';
import PackageOutputView from './node-views/package-output';

export default function (circuitView: CircuitView, data) {
	data = msgpack.decode(data);

	data.forEach(viewData => {
		let view = null;
		switch (viewData.node.type) {
			case 'And': view = AndView.import(circuitView, viewData); break;
			case 'And3': view = And3View.import(circuitView, viewData); break;
			case 'Or': view = OrView.import(circuitView, viewData); break;
			case 'Or3': view = Or3View.import(circuitView, viewData); break;
			case 'Not': view = NotView.import(circuitView, viewData); break;
			case 'Nor': view = NorView.import(circuitView, viewData); break;
			case 'Nand': view = NandView.import(circuitView, viewData); break;
			case 'Xor': view = XorView.import(circuitView, viewData); break;
			case 'True': view = TrueView.import(circuitView, viewData); break;
			case 'False': view = FalseView.import(circuitView, viewData); break;
			case 'Nop': view = NopView.import(circuitView, viewData); break;
			case 'Random': view = RandomView.import(circuitView, viewData); break;
			case 'Button': view = ButtonView.import(circuitView, viewData); break;
			case 'Led': view = LedView.import(circuitView, viewData); break;
			case 'Pin': view = PinView.import(circuitView, viewData); break;
			case 'Package': view = PackageView.import(circuitView, viewData); break;
			case 'PackageInput': view = PackageInputView.import(circuitView, viewData); break;
			case 'PackageOutput': view = PackageOutputView.import(circuitView, viewData); break;
		}
		view.id = viewData.node.id;
		view.x = viewData.x;
		view.y = viewData.y;
		// 互換性のためのチェック
		if (viewData.hasOwnProperty('r')) view.setRotate(viewData.r);

		circuitView.nodeViews.push(view);

		circuitView.circuit.addNode(view.node);
	});

	data.forEach(viewData => {
		viewData.node.outputs.forEach(output => {
			circuitView.nodeViews.find(view => view.id === viewData.node.id).node.connectTo(
				circuitView.nodeViews.find(view => view.id === output.nid).node,
				output.to,
				output.from
			);
		});
	});
}

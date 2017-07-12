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
		if (viewData.node.type === 'And') view = AndView.import(circuitView, viewData);
		if (viewData.node.type === 'And3') view = And3View.import(circuitView, viewData);
		if (viewData.node.type === 'Or') view = OrView.import(circuitView, viewData);
		if (viewData.node.type === 'Or3') view = Or3View.import(circuitView, viewData);
		if (viewData.node.type === 'Not') view = NotView.import(circuitView, viewData);
		if (viewData.node.type === 'Nor') view = NorView.import(circuitView, viewData);
		if (viewData.node.type === 'Nand') view = NandView.import(circuitView, viewData);
		if (viewData.node.type === 'Xor') view = XorView.import(circuitView, viewData);
		if (viewData.node.type === 'Nop') view = NopView.import(circuitView, viewData);
		if (viewData.node.type === 'Random') view = RandomView.import(circuitView, viewData);
		if (viewData.node.type === 'Button') view = ButtonView.import(circuitView, viewData);
		if (viewData.node.type === 'Led') view = LedView.import(circuitView, viewData);
		if (viewData.node.type === 'Pin') view = PinView.import(circuitView, viewData);
		if (viewData.node.type === 'Package') view = PackageView.import(circuitView, viewData);
		if (viewData.node.type === 'PackageInput') view = PackageInputView.import(circuitView, viewData);
		if (viewData.node.type === 'PackageOutput') view = PackageOutputView.import(circuitView, viewData);
		view.id = viewData.node.id;
		view.x = viewData.x;
		view.y = viewData.y;

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

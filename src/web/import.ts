const msgpack = require('msgpack-lite');

import Circuit from '../core/circuit';

import importNodes from '../core/import';

import CircuitBoard from './circuit-board';

import AndTag from './node-tags/and';
import And3Tag from './node-tags/and3';
import OrTag from './node-tags/or';
import NotTag from './node-tags/not';
import NorTag from './node-tags/nor';
import NandTag from './node-tags/nand';
import XorTag from './node-tags/xor';
import NopTag from './node-tags/nop';
import RandomTag from './node-tags/random';
import ButtonTag from './node-tags/button';
import LedTag from './node-tags/led';
import PinTag from './node-tags/pin';
import PackageTag from './node-tags/package';
import PackageInputTag from './node-tags/package-input';
import PackageOutputTag from './node-tags/package-output';

export default function (circuitBoard: CircuitBoard, data) {
	data = msgpack.decode(data);

	data.forEach(tagData => {
		let tag = null;
		if (tagData.node.type === 'And') tag = AndTag.import(circuitBoard, tagData);
		if (tagData.node.type === 'And3') tag = And3Tag.import(circuitBoard, tagData);
		if (tagData.node.type === 'Or') tag = OrTag.import(circuitBoard, tagData);
		if (tagData.node.type === 'Not') tag = NotTag.import(circuitBoard, tagData);
		if (tagData.node.type === 'Nor') tag = NorTag.import(circuitBoard, tagData);
		if (tagData.node.type === 'Nand') tag = NandTag.import(circuitBoard, tagData);
		if (tagData.node.type === 'Xor') tag = XorTag.import(circuitBoard, tagData);
		if (tagData.node.type === 'Nop') tag = NopTag.import(circuitBoard, tagData);
		if (tagData.node.type === 'Random') tag = RandomTag.import(circuitBoard, tagData);
		if (tagData.node.type === 'Button') tag = ButtonTag.import(circuitBoard, tagData);
		if (tagData.node.type === 'Led') tag = LedTag.import(circuitBoard, tagData);
		if (tagData.node.type === 'Pin') tag = PinTag.import(circuitBoard, tagData);
		if (tagData.node.type === 'Package') tag = PackageTag.import(circuitBoard, tagData);
		if (tagData.node.type === 'PackageInput') tag = PackageInputTag.import(circuitBoard, tagData);
		if (tagData.node.type === 'PackageOutput') tag = PackageOutputTag.import(circuitBoard, tagData);
		tag.id = tagData.node.id;
		tag.x = tagData.x;
		tag.y = tagData.y;

		circuitBoard.nodeTags.push(tag);

		circuitBoard.circuit.addNode(tag.node);
	});

	data.forEach(tagData => {
		tagData.node.outputs.forEach(output => {
			circuitBoard.nodeTags.find(tag => tag.id === tagData.node.id).node.connectTo(
				circuitBoard.nodeTags.find(tag => tag.id === output.nid).node,
				output.to,
				output.from
			);
		});
	});
}

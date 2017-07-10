const msgpack = require('msgpack-lite');

import Circuit from '../core/circuit.ts';

import And from '../core/nodes/gates/and.ts';
import And3 from '../core/nodes/gates/and3.ts';
import Or from '../core/nodes/gates/or.ts';
import Not from '../core/nodes/gates/not.ts';
import Nop from '../core/nodes/gates/nop.ts';
import Button from '../core/nodes/button.ts';
import Led from '../core/nodes/led.ts';
import Pin from '../core/nodes/pin.ts';
import Package from '../core/nodes/package.ts';
import PackageInput from '../core/nodes/package-input.ts';
import PackageOutput from '../core/nodes/package-output.ts';

import AndTag from './node-tags/and.ts';
import And3Tag from './node-tags/and3.ts';
import OrTag from './node-tags/or.ts';
import NotTag from './node-tags/not.ts';
import NopTag from './node-tags/nop.ts';
import ButtonTag from './node-tags/button.ts';
import LedTag from './node-tags/led.ts';
import PinTag from './node-tags/pin.ts';
import PackageTag from './node-tags/package.ts';
import PackageInputTag from './node-tags/package-input.ts';
import PackageOutputTag from './node-tags/package-output.ts';

export default function (draw, tags, circuit, data) {
	data = msgpack.decode(data);

	data.forEach(tagData => {
		let tag = null;
		if (tagData.type === 'And') tag = new AndTag(draw, tags, new And());
		if (tagData.type === 'And3') tag = new And3Tag(draw, tags, new And3());
		if (tagData.type === 'Or') tag = new OrTag(draw, tags, new Or());
		if (tagData.type === 'Not') tag = new NotTag(draw, tags, new Not());
		if (tagData.type === 'Nop') tag = new NopTag(draw, tags, new Nop());
		if (tagData.type === 'Button') tag = new ButtonTag(draw, tags, new Button());
		if (tagData.type === 'Led') tag = new LedTag(draw, tags, new Led());
		if (tagData.type === 'Pin') tag = new PinTag(draw, tags, new Pin());
		if (tagData.type === 'Package') tag = new PackageTag(draw, tags, new Package());
		if (tagData.type === 'PackageInput') tag = new PackageInputTag(draw, tags, new PackageInput());
		if (tagData.type === 'PackageOutput') tag = new PackageOutputTag(draw, tags, new PackageOutput());
		tag.id = tagData.id;
		tag.x = tagData.x;
		tag.y = tagData.y;

		tags.push(tag);

		circuit.addNode(tag.node);
	});

	data.forEach(tagData => {
		tagData.outputs.forEach(output => {
			tags.find(tag => tag.id === tagData.id).connectTo({
				tag: tags.find(tag => tag.id === output.tagId),
				portId: output.to
			});
		});
	});
}

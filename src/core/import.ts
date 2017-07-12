import のーど from './node';
import And from './nodes/and';
import And3 from './nodes/and3';
import Or from './nodes/or';
import Or3 from './nodes/or3';
import Not from './nodes/not';
import Nor from './nodes/nor';
import Nand from './nodes/nand';
import Xor from './nodes/xor';
import Nop from './nodes/nop';
import Random from './nodes/random';
import Button from './nodes/button';
import Led from './nodes/led';
import Pin from './nodes/pin';
import Package from './nodes/package';
import PackageInput from './nodes/package-input';
import PackageOutput from './nodes/package-output';

export default function(nodesData): のーど[] {
	const nodes = nodesData.map(n => {
		let node = null;
		if (n.type === 'And') node = And.import(n);
		if (n.type === 'And3') node = And3.import(n);
		if (n.type === 'Or') node = Or.import(n);
		if (n.type === 'Or3') node = Or3.import(n);
		if (n.type === 'Not') node = Not.import(n);
		if (n.type === 'Nor') node = Nor.import(n);
		if (n.type === 'Nand') node = Nand.import(n);
		if (n.type === 'Xor') node = Xor.import(n);
		if (n.type === 'Nop') node = Nop.import(n);
		if (n.type === 'Random') node = Random.import(n);
		if (n.type === 'Button') node = Button.import(n);
		if (n.type === 'Led') node = Led.import(n);
		if (n.type === 'Pin') node = Pin.import(n);
		if (n.type === 'Package') node = Package.import(n);
		if (n.type === 'PackageInput') node = PackageInput.import(n);
		if (n.type === 'PackageOutput') node = PackageOutput.import(n);
		node.id = n.id;
		return node;
	});

	nodesData.forEach(nodeData => {
		nodeData.outputs.forEach(connectionData => {
			nodes.find(node => node.id === nodeData.id).connectTo(
				nodes.find(node => node.id === connectionData.nid),
				connectionData.to,
				connectionData.from
			);
		});
	});

	return nodes;
}

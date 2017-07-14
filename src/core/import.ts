import のーど from './node';
import And from './nodes/and';
import And3 from './nodes/and3';
import Or from './nodes/or';
import Or3 from './nodes/or3';
import Not from './nodes/not';
import Nor from './nodes/nor';
import Nand from './nodes/nand';
import Xor from './nodes/xor';
import True from './nodes/true';
import False from './nodes/false';
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
		switch (n.type) {
			case 'And':           node = And.import(n);           break;
			case 'And3':          node = And3.import(n);          break;
			case 'Or':            node = Or.import(n);            break;
			case 'Or3':           node = Or3.import(n);           break;
			case 'Not':           node = Not.import(n);           break;
			case 'Nor':           node = Nor.import(n);           break;
			case 'Nand':          node = Nand.import(n);          break;
			case 'Xor':           node = Xor.import(n);           break;
			case 'True':          node = True.import(n);          break;
			case 'False':         node = False.import(n);         break;
			case 'Nop':           node = Nop.import(n);           break;
			case 'Random':        node = Random.import(n);        break;
			case 'Button':        node = Button.import(n);        break;
			case 'Led':           node = Led.import(n);           break;
			case 'Pin':           node = Pin.import(n);           break;
			case 'Package':       node = Package.import(n);       break;
			case 'PackageInput':  node = PackageInput.import(n);  break;
			case 'PackageOutput': node = PackageOutput.import(n); break;
		}
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

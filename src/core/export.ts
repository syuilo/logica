import のーど from './node';

export default function(nodes: Set<のーど>): any {
	Array.from(nodes).forEach((node, i) => node.id = i);
	return Array.from(nodes).map(node => node.export());
}

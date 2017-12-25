const msgpack = require('msgpack-lite');

import { NodeViewModel } from './node-view';

export default function (views: NodeViewModel[]) {
	views.forEach((view, i) => view.node.id = i);
	const data = views
		.map(view => ({
			x: view.x,
			y: view.y,
			r: view.rotate,
			node: view.node.export()
		}));

	return msgpack.encode(data);
}

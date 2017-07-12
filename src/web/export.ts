const msgpack = require('msgpack-lite');

import NodeView from './node-view';

export default function (views: NodeView[]) {
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

const msgpack = require('msgpack-lite');

export default function (tags) {
	tags.forEach((tag, i) => tag.node.id = i);
	const data = tags
		.map(tag => ({
			x: tag.x,
			y: tag.y,
			node: tag.node.export()
		}));

	return msgpack.encode(data);
}

const msgpack = require('msgpack-lite');

export default function (tags) {
	tags.forEach((tag, i) => tag.id = i);
	const data = tags
		.map(tag => ({
			id: tag.id,
			x: tag.x,
			y: tag.y,
			type: tag.node.type,
			name: tag.node.name,
			outputs: tag.outputs.map(output => ({
				tagId: output.tag.id,
				from: output.connection.from,
				to: output.connection.to
			}))
		}));

	return msgpack.encode(data);
}

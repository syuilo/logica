import * as riot from 'riot';

require('./tags');

riot.mixin('config', { config: {
	snapToGrid: true
}});

riot.mount(document.body.appendChild(document.createElement('lo-main')));

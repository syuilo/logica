import * as riot from 'riot';

require('./tags');

riot.mixin('config', { config: {
	snapToGrid: false
}});

riot.mount(document.body.appendChild(document.createElement('lo-main')));

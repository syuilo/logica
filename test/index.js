import Circuit from '../built/circuit';

import And from '../built/nodes/gates/and';
import Or from '../built/nodes/gates/or';
import Not from '../built/nodes/gates/not';

import True from '../built/nodes/gates/true';
import False from '../built/nodes/gates/false';

const or = new Or();
const and1 = new And();
const and2 = new And();
const not = new Not();

or.connectTo('a_or_b', and2, 'a');
and1.connectTo('a_and_b', not, 'x');
not.connectTo('x', and2, 'b');

const a = new True();
const b = new False();

a.connectTo('x', or, 'a');
a.connectTo('x', and1, 'a');
b.connectTo('x', or, 'b');
b.connectTo('x', and1, 'b');

const circuit = new Circuit([or, and1, and2, not, a, b]);

/*
import Circuit from '../built/circuit';

import And from '../built/nodes/gates/and';
import Or from '../built/nodes/gates/or';
import Not from '../built/nodes/gates/not';

import True from '../built/nodes/gates/true';
import False from '../built/nodes/gates/false';

import Nop from '../built/nodes/gates/nop';
*/

const Circuit = require('../built/circuit').default;

const And = require('../built/nodes/gates/and').default;
const Or = require('../built/nodes/gates/or').default;
const Not = require('../built/nodes/gates/not').default;

const True = require('../built/nodes/gates/true').default;
const False = require('../built/nodes/gates/false').default;

const Nop = require('../built/nodes/gates/nop').default;

const or = new Or();
const and1 = new And();
const and2 = new And();
const not = new Not();

or.connectTo(and2);
and1.connectTo(not);
not.connectTo(and2);

const a = new False();
const b = new True();

a.connectTo(or);
a.connectTo(and1);
b.connectTo(or);
b.connectTo(and1);

const s = new Nop();
const c = new Nop();

and1.connectTo(c);
and2.connectTo(s);

const circuit = new Circuit([or, and1, and2, not, a, b, s, c]);

console.log('S: ' + s.states.x);
console.log('C: ' + c.states.x);

circuit.tick();

console.log('S: ' + s.states.x);
console.log('C: ' + c.states.x);

circuit.tick();

console.log('S: ' + s.states.x);
console.log('C: ' + c.states.x);

circuit.tick();

console.log('S: ' + s.states.x);
console.log('C: ' + c.states.x);


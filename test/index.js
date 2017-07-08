const assert = require('assert');

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

const Package = require('../built/nodes/package').default;
const PackageInput = require('../built/nodes/package-input').default;
const PackageOutput = require('../built/nodes/package-output').default;

const And = require('../built/nodes/gates/and').default;
const Or = require('../built/nodes/gates/or').default;
const Not = require('../built/nodes/gates/not').default;

//const True = require('../built/nodes/gates/true').default;
//const False = require('../built/nodes/gates/false').default;

const Button = require('../built/nodes/button').default;

const Nop = require('../built/nodes/gates/nop').default;

function createHalfAdder() {
	//////////////////////////////////////////////////////////////
	// 半加算器本体構築

	const or = new Or(); or.name = '半加算器の中のor';
	const and1 = new And(); and1.name = '半加算器の中のand1';
	const and2 = new And(); and2.name = '半加算器の中のand2';
	const not = new Not(); not.name = '半加算器の中のnot';

	or.connectTo(and2);
	and1.connectTo(not);
	not.connectTo(and2);

	//////////////////////////////////////////////////////////////
	// パッケージのインターフェース接続

	const a = new PackageInput('a');
	const b = new PackageInput('b');

	a.connectTo(or);
	a.connectTo(and1);
	b.connectTo(or);
	b.connectTo(and1);

	const s = new PackageOutput('s');
	const c = new PackageOutput('c');

	and1.connectTo(c);
	and2.connectTo(s);

	//////////////////////////////////////////////////////////////
	// パッケージ作成

	const package = new Package(new Set([or, and1, and2, not, a, b, s, c]));

	return package;
}

function createFullAdder() {
	//////////////////////////////////////////////////////////////
	// 全加算器本体構築

	const or = new Or(); or.name = '全加算器の中のor';
	const halfAdder1 = createHalfAdder(); halfAdder1.name = '全加算器の中の半加算器1';
	const halfAdder2 = createHalfAdder(); halfAdder2.name = '全加算器の中の半加算器2';

	halfAdder1.connectTo(halfAdder2, 'a', 's');
	halfAdder1.connectTo(or, 'a', 'c');
	halfAdder2.connectTo(or, 'b', 'c');

	//////////////////////////////////////////////////////////////
	// パッケージのインターフェース接続

	const a = new PackageInput('a');
	const b = new PackageInput('b');
	const x = new PackageInput('x');

	a.connectTo(halfAdder1, 'a');
	b.connectTo(halfAdder1, 'b');
	x.connectTo(halfAdder2, 'b');

	const s = new PackageOutput('s');
	const c = new PackageOutput('c');

	halfAdder2.connectTo(s, 'x', 's');
	or.connectTo(c);

	//////////////////////////////////////////////////////////////
	// パッケージ作成

	const package = new Package(new Set([or, halfAdder1, halfAdder2, x, a, b, s, c]));

	return package;
}

it('Half adder', () => {
	const halfAdder = createHalfAdder();

	const a = new Button();
	const b = new Button();

	a.connectTo(halfAdder, 'a');
	b.connectTo(halfAdder, 'b');

	const s = new Nop(); s.name = 'S';
	const c = new Nop(); c.name = 'C';

	halfAdder.connectTo(s, 'x', 's');
	halfAdder.connectTo(c, 'x', 'c');

	const circuit = new Circuit([halfAdder, a, b, s, c]);

	{
		a.off();
		b.off();

		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();

		//console.log('S: ' + s.states.x);
		//console.log('C: ' + c.states.x);

		assert.equal(s.states.x, false);
		assert.equal(c.states.x, false);
	}

	{
		a.on();
		b.off();

		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();

		assert.equal(s.states.x, true);
		assert.equal(c.states.x, false);
	}

	{
		a.off();
		b.on();

		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();

		assert.equal(s.states.x, true);
		assert.equal(c.states.x, false);
	}

	{
		a.on();
		b.on();

		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();

		assert.equal(s.states.x, false);
		assert.equal(c.states.x, true);
	}
});

it('Full adder', () => {
	const fullAdder = createFullAdder();

	const a = new Button();
	const b = new Button();
	const x = new Button();

	a.connectTo(fullAdder, 'a');
	b.connectTo(fullAdder, 'b');
	x.connectTo(fullAdder, 'x');

	const s = new Nop(); s.name = 'S';
	const c = new Nop(); c.name = 'C';

	fullAdder.connectTo(s, 'x', 's');
	fullAdder.connectTo(c, 'x', 'c');

	const circuit = new Circuit([fullAdder, a, b, x, s, c]);

	{
		a.off();
		b.off();
		x.off();

		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();

		assert.equal(s.states.x, false);
		assert.equal(c.states.x, false);
	}

	{
		a.off();
		b.off();
		x.on();

		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();

		assert.equal(s.states.x, true);
		assert.equal(c.states.x, false);
	}

	{
		a.on();
		b.on();
		x.on();

		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();
		circuit.tick();

		assert.equal(s.states.x, true);
		assert.equal(c.states.x, true);
	}
});

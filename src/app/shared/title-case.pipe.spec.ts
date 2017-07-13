const { describe, it } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { TitleCasePipe } from './title-case.pipe';

describe('TitleCasePipe', () => {
	// This pipe is a pure, stateless function so no need for BeforeEach
	let pipe = new TitleCasePipe();

	it('transforms "abc" to "Abc"', () => {
		expect(pipe.transform('abc')).to.equal('Abc');
	});

	it('transforms "abc def" to "Abc Def"', () => {
		expect(pipe.transform('abc def')).to.equal('Abc Def');
	});

	// ... more tests ...
	it('leaves "Abc Def" unchanged', () => {
		expect(pipe.transform('Abc Def')).to.equal('Abc Def');
	});

	it('transforms "abc-def" to "Abc-def"', () => {
		expect(pipe.transform('abc-def')).to.equal('Abc-def');
	});

	it('transforms "   abc   def" to "   Abc   Def" (preserves spaces) ', () => {
		expect(pipe.transform('   abc   def')).to.equal('   Abc   Def');
	});
});

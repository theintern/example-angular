const { describe, it } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { Hero } from './hero';

describe('Hero', () => {
	it('has name', () => {
		const hero = new Hero(1, 'Super Cat');
		expect(hero.name).to.equal('Super Cat');
	});

	it('has id', () => {
		const hero = new Hero(1, 'Super Cat');
		expect(hero.id).to.equal(1);
	});

	it('can clone itself', () => {
		const hero = new Hero(1, 'Super Cat');
		const clone = hero.clone();
		expect(hero).to.deep.equal(clone);
	});
});

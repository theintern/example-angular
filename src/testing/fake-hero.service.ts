import { HeroService, Hero } from '../app/services/hero.service';

// re-export for tester convenience
export { HeroService, Hero } from '../app/services/hero.service';

export const HEROES: Hero[] = [
	new Hero(41, 'Bob'),
	new Hero(42, 'Carol'),
	new Hero(43, 'Ted'),
	new Hero(44, 'Alice'),
	new Hero(45, 'Speedy'),
	new Hero(46, 'Stealthy')
];

export class FakeHeroService implements HeroService {
	heroes = HEROES.map(h => h.clone());
	lastPromise: Promise<any>;  // remember so we can spy on promise calls

	getHero(id: number | string): Promise<Hero> {
		if (typeof id === 'string') {
			id = parseInt(id as string, 10);
		}
		let hero = this.heroes.find(h => h.id === id) as Hero;
		return this.lastPromise = Promise.resolve(hero) as any;
	}

	getHeroes(): Promise<Hero[]> {
		return this.lastPromise = Promise.resolve<Hero[]>(this.heroes) as any;
	}

	updateHero(hero: Hero): Promise<Hero> {
		return this.lastPromise = this.getHero(hero.id).then(h => {
			return h ?
				Object.assign(h, hero) :
				Promise.reject(`Hero ${hero.id} not found`) as any as Promise<Hero>
			;
		});
	}
}

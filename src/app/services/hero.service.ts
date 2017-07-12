import { Injectable } from '@angular/core';

import { Hero }       from '../models/hero';
import { HEROES }     from '../../testing/test-heroes';

export { Hero }

@Injectable()
/** Dummy HeroService. Pretend it makes real http requests */
export class HeroService {
	getHeroes() {
		return Promise.resolve(HEROES);
	}

	getHero(id: number | string): Promise<Hero> {
		if (typeof id === 'string') {
			id = parseInt(id, 10);
		}
		return <any> this.getHeroes().then(heroes => {
			return heroes.find(hero => hero.id === id);
		});
	}

	updateHero(hero: Hero): Promise<Hero> {
		return this.getHero(hero.id).then(h => {
			if (!h) {
				throw new Error(`Hero ${hero.id} not found`);
			}
			return Object.assign(h, hero);
		});
	}
}

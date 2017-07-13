const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { spy } from 'sinon';

import { Router } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { FakeHeroService, Hero }    from '../../../testing/fake-hero.service';

class FakeRouter {
	navigateByUrl(url: string) { return url;  }
}

describe('DashboardComponent: w/o Angular TestBed', () => {
	let comp: DashboardComponent;
	let heroService: FakeHeroService;
	let router: Router;

	beforeEach(() => {
		router = new FakeRouter() as any as Router;
		heroService = new FakeHeroService();
		comp = new DashboardComponent(router, heroService);
	});

	it('should NOT have heroes before calling OnInit', () => {
		expect(comp.heroes).to.have.lengthOf(0, 'should not have heroes before OnInit');
	});

	it('should NOT have heroes immediately after OnInit', async () => {
		comp.ngOnInit(); // ngOnInit -> getHeroes
		expect(comp.heroes).to.have.lengthOf(0, 'should not have heroes until service promise resolves');
		await heroService.lastPromise;
	});

	it('should HAVE heroes after HeroService gets them', async () => {
		comp.ngOnInit(); // ngOnInit -> getHeroes
		await heroService.lastPromise; // the one from getHeroes
		expect(comp.heroes).to.have.lengthOf.above(0, 'should have heroes after service promise resolves');
	});

	it('should tell ROUTER to navigate by hero id', () => {
		const hero = new Hero(42, 'Abbracadabra');
		const navigateSpy = spy(router, 'navigateByUrl');

		comp.gotoDetail(hero);

		expect(navigateSpy, 'should nav to HeroDetail for Hero 42')
			.to.have.been.calledWithExactly(`/heroes/42`)
		;
	});
});

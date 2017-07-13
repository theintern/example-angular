const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { stub } from 'sinon';

import { HeroDetailComponent } from './hero-detail.component';
import { Hero }                from '../../models/hero';

import { ActivatedRouteStub }  from '../../../testing/router-stubs';

//////////  Tests  ////////////////////

describe('HeroDetailComponent - no TestBed', () => {
	let activatedRoute: ActivatedRouteStub;
	let comp: HeroDetailComponent;
	let expectedHero: Hero;
	let hds: any;
	let router: any;

	beforeEach(async () => {
		expectedHero = new Hero(42, 'Bubba');
		activatedRoute = new ActivatedRouteStub();
		activatedRoute.testParamMap = { id: expectedHero.id };

		router = {
			navigate: stub()
		};

		hds = {
			getHero: stub().returns(Promise.resolve(expectedHero)),
			saveHero: stub().returns(Promise.resolve(expectedHero))
		};

		comp = new HeroDetailComponent(hds, <any> activatedRoute, router);
		comp.ngOnInit();

		// OnInit calls HDS.getHero; wait for it to get the fake hero
		await hds.getHero.firstCall.returnValue;
	});

	it('should expose the hero retrieved from the service', () => {
		expect(comp.hero).to.equal(expectedHero);
	});

	it('should navigate when click cancel', () => {
		comp.cancel();
		expect(router.navigate, 'router.navigate called').to.have.been.called;
	});

	it('should save when click save', () => {
		comp.save();
		expect(hds.saveHero, 'HeroDetailService.save called').to.have.been.called;
		expect(router.navigate, 'router.navigate not called yet').not.to.have.been.called;
	});

	it('should navigate when click save resolves', async () => {
		comp.save();
		// waits for async save to complete before navigating
		await hds.saveHero.firstCall.returnValue;
		expect(router.navigate, 'router.navigate called').to.have.been.called;
	});

});

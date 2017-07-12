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
		expect(router.navigate.called).to.equal(true, 'router.navigate called');
	});

	it('should save when click save', () => {
		comp.save();
		expect(hds.saveHero.called).to.equal(true, 'HeroDetailService.save called');
		expect(router.navigate.called).to.equal(false, 'router.navigate not called yet');
	});

	it('should navigate when click save resolves', async () => {
		comp.save();
		// waits for async save to complete before navigating
		await hds.saveHero.firstCall.returnValue;
		expect(router.navigate.called).to.equal(true, 'router.navigate called');
	});

});

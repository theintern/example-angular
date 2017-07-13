const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { spy } from 'sinon';

import { inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroService }        from '../../services/hero.service';
import { FakeHeroService }    from '../../../testing/fake-hero.service';
import { click }    from '../../../testing/utils';

import { By }     from '@angular/platform-browser';
import { Router } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DashboardModule }    from './dashboard.module';

class RouterStub {
	navigateByUrl(url: string) { return url; }
}

// beforeEach ( addMatchers );

let comp: DashboardComponent;
let fixture: ComponentFixture<DashboardComponent>;

////////  Deep  ////////////////

describe('DashboardComponent (deep)', () => {
	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [ DashboardModule ]
		});
		await compileAndCreate();
	});

	tests(clickForDeep);

	function clickForDeep() {
		// get first <div class="hero"> DebugElement
		const heroEl = fixture.debugElement.query(By.css('.hero'));
		click(heroEl);
	}
});

////////  Shallow ////////////////

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DashboardComponent (shallow)', () => {
	beforeEach(async () => {
		TestBed.configureTestingModule({
			declarations: [ DashboardComponent ],
			schemas:      [NO_ERRORS_SCHEMA]
		});
		await compileAndCreate();
	});

	tests(clickForShallow);

	function clickForShallow() {
		// get first <dashboard-hero> DebugElement
		const heroEl = fixture.debugElement.query(By.css('dashboard-hero'));
		heroEl.triggerEventHandler('selected', comp.heroes[0]);
	}
});

/** Add TestBed providers, compile, and create DashboardComponent */
async function compileAndCreate() {
	await TestBed.configureTestingModule({
			providers: [
				{ provide: HeroService, useClass: FakeHeroService },
				{ provide: Router,      useClass: RouterStub }
			]
		})
		.compileComponents()
	;
	fixture = TestBed.createComponent(DashboardComponent);
	comp = fixture.componentInstance;
}

/**
 * The (almost) same tests for both.
 * Only change: the way that the first hero is clicked
 */
function tests(heroClick: Function) {

	it('should NOT have heroes before ngOnInit', () => {
		expect(comp.heroes).to.have.lengthOf(0,
			'should not have heroes before ngOnInit');
	});

	it('should NOT have heroes immediately after ngOnInit', () => {
		fixture.detectChanges(); // runs initial lifecycle hooks

		expect(comp.heroes).to.have.lengthOf(0,
			'should not have heroes until service promise resolves');
	});

	describe('after get dashboard heroes', () => {

		// Trigger component so it gets heroes and binds to them
		beforeEach(async () => {
			fixture.detectChanges(); // runs ngOnInit -> getHeroes
			await fixture.whenStable(); // No need for the `lastPromise` hack!
			fixture.detectChanges(); // bind to heroes
		});

		it('should HAVE heroes', () => {
			expect(comp.heroes).to.have.lengthOf.above(0, 'should have heroes after service promise resolves');
		});

		it('should DISPLAY heroes', () => {
			// Find and examine the displayed heroes
			// Look for them in the DOM by css class
			const heroes = fixture.debugElement.queryAll(By.css('dashboard-hero'));
			expect(heroes).to.have.lengthOf(4, 'should display 4 heroes');
		});

		it('should tell ROUTER to navigate when hero clicked',
			inject([Router], (router: Router) => { // ...

				const navigateSpy = spy(router, 'navigateByUrl');

				heroClick(); // trigger click on first inner <div class="hero">

				const id = comp.heroes[0].id;
				// expecting to navigate to id of the component's first hero
				expect(navigateSpy, 'should nav to HeroDetail for first hero')
					.to.have.been.calledWithExactly(`/heroes/${id}`)
				;
			})
		);
	});
}


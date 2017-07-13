// For more examples:
//   https://github.com/angular/angular/blob/master/modules/@angular/router/test/integration.spec.ts

const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { stub } from 'sinon';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation }         from '@angular/common/testing';

import { click, advance } from '../testing/utils';

import {
	Router, RouterLinkWithHref, Event as RouterEvent, NavigationStart,
	NavigationEnd, RoutesRecognized, RouteConfigLoadStart, RouteConfigLoadEnd
} from '@angular/router';

import { By }                 from '@angular/platform-browser';
import { DebugElement, Type } from '@angular/core';
import { Location }           from '@angular/common';

import { AppModule }              from './app.module';
import { AppComponent }           from './app.component';
import { AboutComponent }         from './components/about.component';
import { DashboardHeroComponent } from './components/dashboard/dashboard-hero.component';
import { TwainService }           from './services/twain.service';

let comp:     AppComponent;
let fixture:  ComponentFixture<AppComponent>;
let page:     Page;
let router:   Router;
let location: SpyLocation;

describe('AppComponent & RouterTestingModule', () => {

	beforeEach(async () => {
		await TestBed.configureTestingModule({
				imports: [ AppModule, RouterTestingModule ]
			})
			.compileComponents()
		;
	});

	it('should navigate to "Dashboard" immediately', async () => {
		await createComponent();
		expect(location.path()).to.equal('/dashboard', 'after initialNavigation()');
		expectElementOf(DashboardHeroComponent);
	});

	it('should navigate to "About" on click', async () => {
		await createComponent();
		click(page.aboutLinkDe);
		// page.aboutLinkDe.nativeElement.click(); // ok but fails in phantom

		await advance(fixture);
		// advance();
		expectPathToBe('/about');
		expectElementOf(AboutComponent);

		page.expectEvents([
			[NavigationStart, '/about'],
			[RoutesRecognized, '/about'],
			[NavigationEnd, '/about']
		]);
	});

	it('should navigate to "About" w/ browser location URL change', async () => {
		await createComponent();
		location.simulateHashChange('/about');
		// location.go('/about'); // also works ... except in plunker
		await advance(fixture);
		expectPathToBe('/about');
		expectElementOf(AboutComponent);
	});

	// Can't navigate to lazy loaded modules with this technique
	it('should navigate to "Heroes" on click', async function () {
		this.skip('lazy loaded navigation doesn\'t work');

		await createComponent();
		click(page.heroesLinkDe);
		await advance(fixture);
		expectPathToBe('/heroes');
	});

});


///////////////
import { NgModuleFactoryLoader }    from '@angular/core';
import { SpyNgModuleFactoryLoader } from '@angular/router/testing';

import { HeroModule }             from './components/hero/hero.module';  // should be lazy loaded
import { HeroListComponent }      from './components/hero/hero-list.component';

let loader: SpyNgModuleFactoryLoader;

///////// Can't get lazy loaded Heroes to work yet
describe('AppComponent & Lazy Loading', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
				imports: [ AppModule, RouterTestingModule ]
			})
			.compileComponents()
		;
		await createComponent();
		loader   = TestBed.get(NgModuleFactoryLoader);
		loader.stubbedModules = { expected: HeroModule };
		router.resetConfig([{path: 'heroes', loadChildren: 'expected'}]);
	});

	it('dummy', () => {
		expect(true).to.be.true;
	});

	it('should navigate to "Heroes" on click', async () => {
		click(page.heroesLinkDe);
		await advance(fixture);
		expectPathToBe('/heroes');
		expectElementOf(HeroListComponent);
	});

	it('can navigate to "Heroes" w/ browser location URL change', async () => {
		location.go('/heroes');
		await advance(fixture);
		expectPathToBe('/heroes');
		expectElementOf(HeroListComponent);

		page.expectEvents([
			[NavigationStart, '/heroes'],
			[RouteConfigLoadStart, 'heroes'],
			[RouteConfigLoadEnd, 'heroes'],
			[RoutesRecognized, '/heroes'],
			[NavigationEnd, '/heroes']
		]);
	});
});

////// Helpers /////////

async function createComponent() {
	fixture = TestBed.createComponent(AppComponent);
	comp = fixture.componentInstance;

	const injector = fixture.debugElement.injector;
	location = injector.get(Location) as SpyLocation;
	router = injector.get(Router);
	router.initialNavigation();
	stub(injector.get(TwainService), 'getQuote').returns(Promise.resolve('Test Quote')); // fakes it

	await advance(fixture);

	page = new Page();
}

class Page {
	aboutLinkDe:     DebugElement;
	dashboardLinkDe: DebugElement;
	heroesLinkDe:    DebugElement;
	recordedEvents:  RouterEvent[]  =  [];

	// for debugging
	comp: AppComponent;
	location: SpyLocation;
	router: Router;
	fixture: ComponentFixture<AppComponent>;

	expectEvents(pairs: [Type<RouterEvent>, string][]) {
		const events = this.recordedEvents;
		expect(events).to.have.lengthOf(pairs.length, 'actual/expected events length mismatch');
		events.forEach((event, index) => {
			const [ ctor, id ] = pairs[index];

			expect(event).to.be.instanceOf(ctor, 'unexpected event type');

			if (event instanceof RouteConfigLoadEnd || event instanceof RouteConfigLoadStart) {
				expect(event.route.path).to.equal(id, 'unexpected event path');
			} else {
				expect(event.url).to.equal(id, 'unexpected event url');
			}
		});
	}

	constructor() {
		router.events.subscribe(e => this.recordedEvents.push(e));
		const links = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
		this.aboutLinkDe     = links[2];
		this.dashboardLinkDe = links[0];
		this.heroesLinkDe    = links[1];

		// for debugging
		this.comp    = comp;
		this.fixture = fixture;
		this.router  = router;
	}
}

function expectPathToBe(path: string, expectationFailOutput?: any) {
	expect(location.path()).to.equal(path, expectationFailOutput || 'location.path()');
}

function expectElementOf(type: Type<any>): any {
	const el = fixture.debugElement.query(By.directive(type));
	expect(el).to.exist;
	return el;
}

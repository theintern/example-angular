const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { click } from '../testing/utils';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { NO_ERRORS_SCHEMA }          from '@angular/core';
import { Component }                 from '@angular/core';
import { AppComponent }              from './app.component';
import { BannerComponent }           from './components/banner.component';
import { RouterLinkStubDirective }   from '../testing/router-stubs';
import { RouterOutletStubComponent } from '../testing/router-stubs';

@Component({selector: 'app-welcome', template: ''})
class WelcomeStubComponent {}

let comp:    AppComponent;
let fixture: ComponentFixture<AppComponent>;

describe('AppComponent & TestModule', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
				declarations: [
					AppComponent,
					BannerComponent, WelcomeStubComponent,
					RouterLinkStubDirective, RouterOutletStubComponent
				]
			})
			.compileComponents()
		;
		fixture = TestBed.createComponent(AppComponent);
		comp    = fixture.componentInstance;

		beforeEachTests();
	});

	tests();
});

//////// Testing w/ NO_ERRORS_SCHEMA //////
describe('AppComponent & NO_ERRORS_SCHEMA', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
				declarations: [ AppComponent, RouterLinkStubDirective ],
				schemas:      [ NO_ERRORS_SCHEMA ]
			})
			.compileComponents()
		;
		fixture = TestBed.createComponent(AppComponent);
		comp    = fixture.componentInstance;

		beforeEachTests();
	});
	tests();
});

//////// Testing w/ real root module //////
// Tricky because we are disabling the router and its configuration
// Better to use RouterTestingModule
import { AppModule }    from './app.module';
import { AppRoutingModule } from './app-routing.module';

describe('AppComponent & AppModule', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
				imports: [ AppModule ]
			})
			// Get rid of app's Router configuration otherwise many failures.
			// Doing so removes Router declarations; add the Router stubs
			.overrideModule(AppModule, {
				remove: {
					imports: [ AppRoutingModule ]
				},
				add: {
					declarations: [ RouterLinkStubDirective, RouterOutletStubComponent ]
				}
			})
			.compileComponents()
		;

		fixture = TestBed.createComponent(AppComponent);
		comp    = fixture.componentInstance;

		beforeEachTests();
	});

	tests();
});

let links: RouterLinkStubDirective[];
let linkDes: DebugElement[];

function beforeEachTests() {
	// trigger initial data binding
	fixture.detectChanges();

	// find DebugElements with an attached RouterLinkStubDirective
	linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));

	// get the attached link directive instances using the DebugElement injectors
	links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
}

function tests() {
	it('can instantiate it', () => {
		expect(comp).not.to.be.null;
	});

	it('can get RouterLinks from template', () => {
		expect(links).to.have.lengthOf(3, 'should have 3 links');
		expect(links[0].linkParams).to.equal('/dashboard', '1st link should go to Dashboard');
		expect(links[1].linkParams).to.equal('/heroes', '1st link should go to Heroes');
	});

	it('can click Heroes link in template', () => {
		const heroesLinkDe = linkDes[1];
		const heroesLink = links[1];

		expect(heroesLink.navigatedTo).to.be.null;

		click(heroesLinkDe);
		fixture.detectChanges();

		expect(heroesLink.navigatedTo).to.equal('/heroes');
	});
}

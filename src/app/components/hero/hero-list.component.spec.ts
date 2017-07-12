import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { spy, SinonSpy } from 'sinon';

import { newEvent } from '../../../testing/utils';
import { Router, RouterStub } from '../../../testing/router-stubs';
import { HEROES, FakeHeroService } from '../../../testing/fake-hero.service';

import { HeroModule }         from './hero.module';
import { HeroListComponent }  from './hero-list.component';
import { HighlightDirective } from '../../shared/highlight.directive';
import { HeroService }        from '../../services/hero.service';

let comp: HeroListComponent;
let fixture: ComponentFixture<HeroListComponent>;
let page: Page;

/////// Tests //////

describe('HeroListComponent', () => {

	beforeEach(async () => {
		await TestBed.configureTestingModule({
				imports: [HeroModule],
				providers: [
					{ provide: HeroService, useClass: FakeHeroService },
					{ provide: Router,      useClass: RouterStub}
				]
			})
			.compileComponents()
		;
		await createComponent();
	});

	it('should display heroes', () => {
		expect(page.heroRows).to.have.lengthOf.above(0);
	});

	it('1st hero should match 1st test hero', () => {
		const expectedHero = HEROES[0];
		const actualHero = page.heroRows[0].textContent;
		expect(actualHero).to.contain(expectedHero.id, 'hero.id');
		expect(actualHero).to.contain(expectedHero.name, 'hero.name');
	});

	it('should select hero on click', async () => {
		const expectedHero = HEROES[1];
		const li = page.heroRows[1];
		li.dispatchEvent(newEvent('click'));
		await comp.heroes;
		expect(comp.selectedHero).to.deep.equal(expectedHero);
	});

	it('should navigate to selected hero detail on click', async () => {
		const expectedHero = HEROES[1];
		const li = page.heroRows[1];
		li.dispatchEvent(newEvent('click'));

		await page.navSpy.lastCall.returnValue;

		// should have navigated
		expect(page.navSpy.called).to.equal(true, 'navigate called');

		// composed hero detail will be URL like 'heroes/42'
		// expect link array with the route path and hero id
		// first argument to router.navigate is link array
		const navArgs = page.navSpy.firstCall.args[0];
		expect(navArgs[0]).to.contain('heroes', 'nav to heroes detail URL');
		expect(navArgs[1]).to.equal(expectedHero.id, 'expected hero.id');

	});

	it('should find `HighlightDirective` with `By.directive', () => {
		// Can find DebugElement either by css selector or by directive
		const h2        = fixture.debugElement.query(By.css('h2'));
		const directive = fixture.debugElement.query(By.directive(HighlightDirective));
		expect(h2).to.equal(directive);
	});

	it('should color header with `HighlightDirective`', () => {
		const h2 = page.highlightDe.nativeElement as HTMLElement;
		const bgColor = h2.style.backgroundColor;

		// different browsers report color values differently
		const isExpectedColor = bgColor === 'gold' || bgColor === 'rgb(255, 215, 0)';
		expect(isExpectedColor).to.equal(true, 'backgroundColor');
	});

	it('the `HighlightDirective` is among the element\'s providers', () => {
		expect(page.highlightDe.providerTokens).to.contain(HighlightDirective, 'HighlightDirective');
	});
});

/////////// Helpers /////

/** Create the component and set the `page` test variables */
async function createComponent() {
	fixture = TestBed.createComponent(HeroListComponent);
	comp = fixture.componentInstance;

	// change detection triggers ngOnInit which gets a hero
	fixture.detectChanges();

	await fixture.whenStable();
	// got the heroes and updated component
	// change detection updates the view
	fixture.detectChanges();
	page = new Page();
}

class Page {
	/** Hero line elements */
	heroRows: HTMLLIElement[];

	/** Highlighted element */
	highlightDe: DebugElement;

	/** Spy on router navigate method */
	navSpy: SinonSpy;

	constructor() {
		this.heroRows    = fixture.debugElement.queryAll(By.css('li')).map(de => de.nativeElement);

		// Find the first element with an attached HighlightDirective
		this.highlightDe = fixture.debugElement.query(By.directive(HighlightDirective));

		// Get the component's injected router and spy on it
		const router = fixture.debugElement.injector.get(Router);
		this.navSpy = spy(router, 'navigate');
	};
}

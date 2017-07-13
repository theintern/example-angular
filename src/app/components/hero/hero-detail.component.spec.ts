const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { spy, stub, SinonSpy } from 'sinon';

import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { click, newEvent } from '../../../testing/utils';
import { ActivatedRoute, ActivatedRouteStub, Router, RouterStub } from '../../../testing/router-stubs';

import { HeroDetailComponent } from './hero-detail.component';
import { HeroDetailService, Hero }   from '../../services/hero-detail.service';
import { HeroModule }          from './hero.module';

////// Testing Vars //////
let activatedRoute: ActivatedRouteStub;
let comp: HeroDetailComponent;
let fixture: ComponentFixture<HeroDetailComponent>;
let page: Page;

////// Tests //////
describe('HeroDetailComponent', () => {
	beforeEach(() => {
		activatedRoute = new ActivatedRouteStub();
	});
	describe('with HeroModule setup', heroModuleSetup);
	describe('when override its provided HeroDetailService', overrideSetup);
	describe('with FormsModule setup', formsModuleSetup);
	describe('with SharedModule setup', sharedModuleSetup);
});

////////////////////
function overrideSetup() {
	class HeroDetailServiceSpy {
		testHero = new Hero(42, 'Test Hero');

		getHero = stub().callsFake(
			() => Promise
				.resolve(true)
				.then(() => Object.assign({}, this.testHero))
		);

		saveHero = stub().callsFake(
			(hero: Hero) => Promise
				.resolve(true)
				.then(() => Object.assign(this.testHero, hero))
		);
	}

	beforeEach(async () => {
		// the `id` value is irrelevant because ignored by service stub
		activatedRoute.testParamMap = { id: 99999 };

		await TestBed.configureTestingModule({
				imports:   [ HeroModule ],
				providers: [
					{ provide: ActivatedRoute, useValue: activatedRoute },
					{ provide: Router,         useClass: RouterStub},
					// HeroDetailService at this level is IRRELEVANT!
					{ provide: HeroDetailService, useValue: {} }
				]
			})

			// Override component's own provider
			.overrideComponent(HeroDetailComponent, {
				set: {
					providers: [
						{ provide: HeroDetailService, useClass: HeroDetailServiceSpy }
					]
				}
			})

			.compileComponents()
		;

		await createComponent();

		// get the component's injected HeroDetailServiceSpy
		hdsSpy = fixture.debugElement.injector.get(HeroDetailService) as any;
	});

	let hdsSpy: HeroDetailServiceSpy;

	it('should have called `getHero`', () => {
		expect(hdsSpy.getHero.calledOnce).to.equal(true, 'getHero called once');
	});

	it('should display stub hero\'s name', () => {
		expect(page.nameDisplay.textContent).to.equal(hdsSpy.testHero.name);
	});

	it('should save stub hero change', async () => {
		const origName = hdsSpy.testHero.name;
		const newName = 'New Name';

		page.nameInput.value = newName;
		page.nameInput.dispatchEvent(newEvent('input')); // tell Angular

		expect(comp.hero.name).to.equal(newName, 'component hero has new name');
		expect(hdsSpy.testHero.name).to.equal(origName, 'service hero unchanged before save');

		click(page.saveBtn);
		expect(hdsSpy.saveHero.calledOnce).to.equal(true, 'saveHero called once');

		await hdsSpy.saveHero.lastCall.returnValue;
		expect(hdsSpy.testHero.name).to.equal(newName, 'service hero has new name after save');
		expect(page.navSpy.called).to.equal(true, 'router.navigate called');
	});

	it('fixture injected service is not the component injected service',
		inject([HeroDetailService], (service: HeroDetailService) => {

			expect(service).to.deep.equal({}, 'service injected from fixture');
			expect(Boolean(hdsSpy)).to.equal(true, 'service injected into component');
		})
	);
}

////////////////////
import { HEROES, FakeHeroService } from '../../../testing/fake-hero.service';
import { HeroService }             from '../../services/hero.service';

const firstHero = HEROES[0];

function heroModuleSetup() {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
				imports:   [ HeroModule ],
				//  declarations: [ HeroDetailComponent ], // NO!  DOUBLE DECLARATION
				providers: [
					{ provide: ActivatedRoute, useValue: activatedRoute },
					{ provide: HeroService,    useClass: FakeHeroService },
					{ provide: Router,         useClass: RouterStub},
				]
			})
			.compileComponents()
		;
	});

	describe('when navigate to existing hero', () => {
		let expectedHero: Hero;

		beforeEach(async () => {
			expectedHero = firstHero;
			activatedRoute.testParamMap = { id: expectedHero.id };
			await createComponent();
		});

		it('should display that hero\'s name', () => {
			expect(page.nameDisplay.textContent).to.equal(expectedHero.name);
		});

		it('should navigate when click cancel', () => {
			click(page.cancelBtn);
			expect(page.navSpy.called).to.equal(true, 'router.navigate called');
		});

		it('should save when click save but not navigate immediately', () => {
			// Get service injected into component and spy on its`saveHero` method.
			// It delegates to fake `HeroService.updateHero` which delivers a safe test result.
			const hds = fixture.debugElement.injector.get(HeroDetailService);
			const saveSpy = spy(hds, 'saveHero');

			click(page.saveBtn);
			expect(saveSpy.called).to.equal(true, 'HeroDetailService.save called');
			expect(page.navSpy.called).to.equal(false, 'router.navigate not called');
		});

		it('should navigate when click save and save resolves', async () => {
			const hds = fixture.debugElement.injector.get(HeroDetailService);
			const saveSpy = spy(hds, 'saveHero');

			click(page.saveBtn);

			await saveSpy.lastCall.returnValue;

			expect(page.navSpy.called).to.equal(true, 'router.navigate called');
		});

		it('should convert hero name to Title Case', () => {
			const inputName = 'quick BROWN  fox';
			const titleCaseName = 'Quick Brown  Fox';

			// simulate user entering new name into the input box
			page.nameInput.value = inputName;

			// dispatch a DOM event so that Angular learns of input value change.
			page.nameInput.dispatchEvent(newEvent('input'));

			// Tell Angular to update the output span through the title pipe
			fixture.detectChanges();

			expect(page.nameDisplay.textContent).to.equal(titleCaseName);
		});
	});

	describe('when navigate with no hero id', () => {
		beforeEach(createComponent);

		it('should have hero.id === 0', () => {
			expect(comp.hero.id).to.equal(0);
		});

		it('should display empty hero name', () => {
			expect(page.nameDisplay.textContent).to.equal('');
		});
	});

	describe('when navigate to non-existent hero id', () => {
		beforeEach(async () => {
			activatedRoute.testParamMap = { id: 99999 };
			await createComponent();
		});

		it('should try to navigate back to hero list', () => {
			expect(page.gotoSpy.called).to.equal(true, 'comp.gotoList called');
			expect(page.navSpy.called).to.equal(true, 'router.navigate called');
		});
	});

	// Why we must use `fixture.debugElement.injector` in `Page()`
	it('cannot use `inject` to get component\'s provided HeroDetailService', () => {
		let service: HeroDetailService;
		fixture = TestBed.createComponent(HeroDetailComponent);
		// Throws because `inject` only has access to TestBed's injector
		// which is an ancestor of the component's injector
		expect(
			inject([HeroDetailService], (hds: HeroDetailService) => {
				service = hds;
			})
		).to.throw(/No provider for HeroDetailService/);

		// get `HeroDetailService` with component's own injector
		service = fixture.debugElement.injector.get(HeroDetailService);
		expect(service).to.not.be.undefined;
	});
}

/////////////////////
import { FormsModule }         from '@angular/forms';
import { TitleCasePipe }       from '../../shared/title-case.pipe';

function formsModuleSetup() {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
				imports:      [ FormsModule ],
				declarations: [ HeroDetailComponent, TitleCasePipe ],
				providers: [
					{ provide: ActivatedRoute, useValue: activatedRoute },
					{ provide: HeroService,    useClass: FakeHeroService },
					{ provide: Router,         useClass: RouterStub},
				]
			})
			.compileComponents()
		;
	});

	it('should display 1st hero\'s name', async () => {
		const expectedHero = firstHero;
		activatedRoute.testParamMap = { id: expectedHero.id };
		await createComponent();
		expect(page.nameDisplay.textContent).to.equal(expectedHero.name);
	});
}

///////////////////////
import { SharedModule }        from '../../shared/shared.module';

function sharedModuleSetup() {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
				imports:      [ SharedModule ],
				declarations: [ HeroDetailComponent ],
				providers: [
					{ provide: ActivatedRoute, useValue: activatedRoute },
					{ provide: HeroService,    useClass: FakeHeroService },
					{ provide: Router,         useClass: RouterStub},
				]
			})
			.compileComponents()
		;
	});

	it('should display 1st hero\'s name', async () => {
		const expectedHero = firstHero;
		activatedRoute.testParamMap = { id: expectedHero.id };
		await createComponent();
		expect(page.nameDisplay.textContent).to.equal(expectedHero.name);
	});
}

/////////// Helpers /////

/** Create the HeroDetailComponent, initialize it, set test variables  */
async function createComponent() {
	fixture = TestBed.createComponent(HeroDetailComponent);
	comp    = fixture.componentInstance;
	page    = new Page();

	// 1st change detection triggers ngOnInit which gets a hero
	fixture.detectChanges();
	await fixture.whenStable();
	// 2nd change detection displays the async-fetched hero
	fixture.detectChanges();
	page.addPageElements();
}

class Page {
	gotoSpy:      SinonSpy;
	navSpy:       SinonSpy;

	saveBtn:      DebugElement;
	cancelBtn:    DebugElement;
	nameDisplay:  HTMLElement;
	nameInput:    HTMLInputElement;

	constructor() {
		const router = TestBed.get(Router); // get router from root injector
		this.gotoSpy = spy(comp, 'gotoList');
		this.navSpy  = spy(router, 'navigate');
	}

	/** Add page elements after hero arrives */
	addPageElements() {
		if (comp.hero) {
			// have a hero so these elements are now in the DOM
			const buttons    = fixture.debugElement.queryAll(By.css('button'));
			this.saveBtn     = buttons[0];
			this.cancelBtn   = buttons[1];
			this.nameDisplay = fixture.debugElement.query(By.css('span')).nativeElement;
			this.nameInput   = fixture.debugElement.query(By.css('input')).nativeElement;
		}
	}
}

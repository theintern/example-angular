import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

// import { addMatchers, click } from '../../testing';

import { Hero } from '../../models/hero';
import { DashboardHeroComponent } from './dashboard-hero.component';

// beforeEach( addMatchers );

describe('DashboardHeroComponent when tested directly', () => {

	let comp: DashboardHeroComponent;
	let expectedHero: Hero;
	let fixture: ComponentFixture<DashboardHeroComponent>;
	let heroEl: DebugElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
				declarations: [ DashboardHeroComponent ],
			})
			.compileComponents() // compile template and css
		;

		fixture = TestBed.createComponent(DashboardHeroComponent);
		comp    = fixture.componentInstance;
		heroEl  = fixture.debugElement.query(By.css('.hero')); // find hero element

		// pretend that it was wired to something that supplied a hero
		expectedHero = new Hero(42, 'Test Name');
		comp.hero = expectedHero;
		fixture.detectChanges(); // trigger initial data binding
	});

	it('should display hero name', () => {
		const expectedPipedName = expectedHero.name.toUpperCase();
		expect(heroEl.nativeElement.textContent).to.contain(expectedPipedName);
	});

	it('should raise selected event when clicked', () => {
		let selectedHero: Hero;
		comp.selected.subscribe((hero: Hero) => selectedHero = hero);

		heroEl.triggerEventHandler('click', null);
		expect(selectedHero).to.equal(expectedHero);
	});
});

//////////////////

describe('DashboardHeroComponent when inside a test host', () => {
	let testHost: TestHostComponent;
	let fixture: ComponentFixture<TestHostComponent>;
	let heroEl: DebugElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ DashboardHeroComponent, TestHostComponent ], // declare both
		}).compileComponents();

		// create TestHostComponent instead of DashboardHeroComponent
		fixture  = TestBed.createComponent(TestHostComponent);
		testHost = fixture.componentInstance;
		heroEl   = fixture.debugElement.query(By.css('.hero')); // find hero
		fixture.detectChanges(); // trigger initial data binding
	});

	it('should display hero name', () => {
		const expectedPipedName = testHost.hero.name.toUpperCase();
		expect(heroEl.nativeElement.textContent).to.contain(expectedPipedName);
	});

	it('should raise selected event when clicked', () => {
		heroEl.triggerEventHandler('click', null);
		// selected hero should be the same data bound hero
		expect(testHost.selectedHero).to.equal(testHost.hero);
	});
});

////// Test Host Component //////
import { Component } from '@angular/core';

@Component({
	template: `
	<dashboard-hero  [hero]="hero"  (selected)="onSelected($event)"></dashboard-hero>`
})
class TestHostComponent {
	hero = new Hero(42, 'Test Name');
	selectedHero: Hero;
	onSelected(hero: Hero) { this.selectedHero = hero; }
}

import { ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { BannerComponent } from './banner.component';

const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

describe('BannerComponent (AutoChangeDetect)', () => {
	let comp:    BannerComponent;
	let fixture: ComponentFixture<BannerComponent>;
	let de:      DebugElement;
	let el:      HTMLElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
				declarations: [ BannerComponent ], // declare the test component
				providers: [
					{ provide: ComponentFixtureAutoDetect, useValue: true }
				]
			})
			.compileComponents()  // compile template and css
		;

		fixture = TestBed.createComponent(BannerComponent);
		comp = fixture.componentInstance;
		de = fixture.debugElement.query(By.css('h1'));
		el = de.nativeElement;
	});

	it('should display original title', () => {
		// Hooray! No `fixture.detectChanges()` needed
		expect(el.textContent).to.contain(comp.title);
	});

	it('should still see original title after comp.title change', () => {
		const oldTitle = comp.title;
		comp.title = 'Test Title';
		// Displayed title is old because Angular didn't hear the change :(
		expect(el.textContent).to.contain(oldTitle);
	});

	it('should display updated title after detectChanges', () => {
		comp.title = 'Test Title';
		fixture.detectChanges(); // detect changes explicitly
		expect(el.textContent).to.contain(comp.title);
	});
});

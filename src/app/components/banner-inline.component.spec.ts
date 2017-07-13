const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { BannerComponent } from './banner-inline.component';

describe('BannerComponent (inline template)', () => {

	let comp:    BannerComponent;
	let fixture: ComponentFixture<BannerComponent>;
	let de:      DebugElement;
	let el:      HTMLElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ BannerComponent ] // declare the test component
		});

		fixture = TestBed.createComponent(BannerComponent);

		comp = fixture.componentInstance; // BannerComponent test instance

		// query for the title <h1> by CSS element selector
		de = fixture.debugElement.query(By.css('h1'));
		el = de.nativeElement;
	});

	it('no title in the DOM until manually call `detectChanges`', () => {
		expect(el.textContent).to.equal('');
	});

	it('should display original title', () => {
		fixture.detectChanges();
		expect(el.textContent).to.contain(comp.title);
	});

	it('should display a different test title', () => {
		comp.title = 'Test Title';
		fixture.detectChanges();
		expect(el.textContent).to.contain('Test Title');
	});
});

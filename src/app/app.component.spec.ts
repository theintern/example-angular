import { AppComponent } from './app.component';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

describe('AppComponent', () => {
	let comp: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let de: DebugElement;
	let el: HTMLElement;

	beforeEach(() => {
		return TestBed.configureTestingModule({
				declarations: [ AppComponent ]
			})
			.compileComponents()
			.then(() => {
				fixture = TestBed.createComponent(AppComponent);
				comp = fixture.componentInstance;
				de = fixture.debugElement.query(By.css('h1'));
				el = de.nativeElement;
			})
		;
	});

	it('should create component', () => {
		expect(comp).to.not.be.undefined;
	});

	it('should have <h1> text', () => {
		fixture.detectChanges();
		expect(el.innerText).to.match(/angular/i);
	});
});

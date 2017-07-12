import { IOComponent } from './io.component';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { spy } from 'sinon';

describe('IOComponent direct', () => {
	let comp: IOComponent;
	let fixture: ComponentFixture<IOComponent>;
	let de: DebugElement;
	let el: HTMLElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
				declarations: [ IOComponent ]
			})
			.compileComponents()
		;

		fixture = TestBed.createComponent(IOComponent);
		comp = fixture.componentInstance;
		de = fixture.debugElement.query(By.css('.hero'));
		el = de.nativeElement;

		comp.name = 'Spiderman';
		fixture.detectChanges();
	});

	it('should display hero name', () => {
		expect(el.textContent.trim()).to.equal('Spiderman');
	});

	it('should display new hero name', () => {
		comp.name = 'Batman';
		fixture.detectChanges();

		expect(el.textContent.trim()).to.equal('Batman');
	});

	it('should emit event when clicked', () => {
		const handler = spy();

		comp.clicked.subscribe(handler);
		de.triggerEventHandler('click', null);

		expect(handler.calledOnce).to.be.true;
		expect(handler.firstCall.args).to.deep.equal(['Spiderman']);
	});
});

import { Component } from '@angular/core';

@Component({
	template: `
		<io [name]="name" (clicked)="onClick($event)"></io>
	`
})
class TestHostComponent {
	name = 'Spiderman';
	clickedName: string;

	onClick(name: string) {
		this.clickedName = name;
	}
}

describe('IOComponent in host', () => {
	let testHost: TestHostComponent;
	let fixture: ComponentFixture<TestHostComponent>;
	let de: DebugElement;
	let el: HTMLElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
				declarations: [ TestHostComponent, IOComponent ]
			})
			.compileComponents()
		;

		fixture = TestBed.createComponent(TestHostComponent);
		testHost = fixture.componentInstance;
		de = fixture.debugElement.query(By.css('.hero'));
		el = de.nativeElement;

		fixture.detectChanges();
	});

	it('should display hero name', () => {
		expect(el.textContent.trim()).to.equal('Spiderman');
		expect(testHost.clickedName).to.be.undefined;
	});

	it('should emit event when clicked', () => {
		de.triggerEventHandler('click', null);
		expect(testHost.clickedName).to.equal('Spiderman');
	});
});

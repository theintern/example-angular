const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { stub, SinonStub } from 'sinon';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }                        from '@angular/platform-browser';
import { DebugElement }              from '@angular/core';

import { TwainService }   from '../services/twain.service';
import { TwainComponent } from './twain.component';

describe('TwainComponent', () => {
	let comp: TwainComponent;
	let fixture: ComponentFixture<TwainComponent>;

	let getQuoteSpy: SinonStub;
	let de: DebugElement;
	let el: HTMLElement;
	let twainService: TwainService; // the actually injected service

	const testQuote = 'Test Quote';

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ TwainComponent ],
			providers:    [ TwainService ],
		});

		fixture = TestBed.createComponent(TwainComponent);
		comp    = fixture.componentInstance;

		// TwainService actually injected into the component
		twainService = fixture.debugElement.injector.get(TwainService);

		// Setup spy on the `getQuote` method
		getQuoteSpy = stub(twainService, 'getQuote').returns(Promise.resolve(testQuote));

		// Get the Twain quote element by CSS selector (e.g., by class name)
		de = fixture.debugElement.query(By.css('.twain'));
		el = de.nativeElement;
	});

	it('should not show quote before OnInit', () => {
		expect(el.textContent).to.equal('', 'nothing displayed');
		expect(getQuoteSpy.called).to.equal(false, 'getQuote not yet called');
	});

	it('should still not show quote after component initialized', () => {
		fixture.detectChanges();
		// getQuote service is async => still has not returned with quote
		expect(el.textContent).to.equal('...', 'no quote yet');
		expect(getQuoteSpy.called).to.equal(true, 'getQuote called');
	});

	it('should show quote after getQuote promise', async () => {
		fixture.detectChanges();

		await fixture.whenStable(); // wait for async getQuote
		fixture.detectChanges();    // update view with quote
		expect(el.textContent).to.equal(testQuote);
	});

	it('should show quote after getQuote promise (await spy)', async () => {
		fixture.detectChanges();

		// get the spy promise and wait for it to resolve
		await getQuoteSpy.lastCall.returnValue as Promise<any>;
		fixture.detectChanges(); // update view with quote
		expect(el.textContent).to.equal(testQuote);
	});
});

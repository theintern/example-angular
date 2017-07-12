import { WelcomeComponent } from './welcome.component';
import { UserService } from '../services/user.service';
import { QuoteService } from '../services/quote.service';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { stub } from 'sinon';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

describe('WelcomeComponent', () => {
	let comp: WelcomeComponent;
	let fixture: ComponentFixture<WelcomeComponent>;
	let de: DebugElement;
	let el: HTMLElement;
	let qe: DebugElement;
	let ql: HTMLElement;
	let userService: UserService;
	let quoteService: QuoteService;

	beforeEach(async () => {
		const userServiceStub = {
			isLoggedIn: true,
			user: {
				name: 'Test User'
			}
		};

		const quoteServiceStub = {
			getQuote: stub().returns(Observable.of({
				id: 1,
				text: 'some quote'
			}))
		};

		await TestBed.configureTestingModule({
				declarations: [ WelcomeComponent ],
				providers: [
					{ provide: UserService, useValue: userServiceStub },
					{ provide: QuoteService, useValue: quoteServiceStub }
				]
			})
			.compileComponents()
		;

		fixture = TestBed.createComponent(WelcomeComponent);
		comp = fixture.componentInstance;
		userService = TestBed.get(UserService);
		quoteService = TestBed.get(QuoteService);
		de = fixture.debugElement.query(By.css('.welcome'));
		el = de.nativeElement;
		qe = fixture.debugElement.query(By.css('.quote'));
		ql = qe.nativeElement;
	});

	it('should welcome the user', async () => {
		fixture.detectChanges();

		await fixture.whenStable();

		const content = el.textContent;
		expect(content).to.contain('Welcome');
		expect(content).to.contain('Test User', 'expected name');
		expect(ql.textContent).to.equal('some quote');
	});

	it('should welcome "Bubba"', async () => {
		userService.user.name = 'Bubba'; // welcome message hasn't been shown yet
		fixture.detectChanges();

		await fixture.whenStable();

		expect(el.textContent).to.contain('Bubba');
	});

	it('should request login if not logged in', async () => {
		userService.isLoggedIn = false; // welcome message hasn't been shown yet
		fixture.detectChanges();

		await fixture.whenStable();

		const content = el.textContent;
		expect(content).not.to.contain('Welcome', 'not welcomed');
		expect(content).to.match(/log in/i, '"log in"');
	});
});

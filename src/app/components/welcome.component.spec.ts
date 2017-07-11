import { WelcomeComponent } from './welcome.component';
import { UserService } from '../services/user.service';
import { QuoteService } from '../services/quote.service';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { spy, stub } from 'sinon';
import { Observable } from 'rxjs/Observable';

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

	beforeEach(() => {
		const userServiceStub = {
			isLoggedIn: true,
			user: {
				name: 'Test User'
			}
		};

		const quoteServiceStub = {
			getQuote: stub().returns(Observable.of('some quote'))
		};

		return TestBed.configureTestingModule({
				declarations: [ WelcomeComponent ],
				providers: [
					{ provide: UserService, useValue: userServiceStub },
					{ provide: QuoteService, useValue: quoteServiceStub }
				]
			})
			.compileComponents()
			.then(() => {
				fixture = TestBed.createComponent(WelcomeComponent);
				comp = fixture.componentInstance;
				userService = TestBed.get(UserService);
				quoteService = TestBed.get(QuoteService);
				de = fixture.debugElement.query(By.css('.welcome'));
				el = de.nativeElement;
				qe = fixture.debugElement.query(By.css('.quote'));
				ql = qe.nativeElement;
			})
		;
	});

	it('should welcome the user', () => {
		fixture.detectChanges();

		return fixture.whenStable().then(() => {
			const content = el.textContent;
			expect(content).to.contain('Welcome');
			expect(content).to.contain('Test User', 'expected name');
			expect(ql.textContent).to.equal('some quote');
		});
	});

	it('should welcome "Bubba"', () => {
		userService.user.name = 'Bubba'; // welcome message hasn't been shown yet
		fixture.detectChanges();

		return fixture.whenStable().then(() => {
			expect(el.textContent).to.contain('Bubba');
		});
	});

	it('should request login if not logged in', () => {
		userService.isLoggedIn = false; // welcome message hasn't been shown yet
		fixture.detectChanges();

		return fixture.whenStable().then(() => {
			const content = el.textContent;
			expect(content).not.to.contain('Welcome', 'not welcomed');
			expect(content).to.match(/log in/i, '"log in"');
		});
	});
});

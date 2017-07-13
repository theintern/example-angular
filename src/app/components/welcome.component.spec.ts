const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By }                                from '@angular/platform-browser';
import { DebugElement }                      from '@angular/core';

import { UserService }      from '../services/user.service';
import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
	let comp: WelcomeComponent;
	let fixture: ComponentFixture<WelcomeComponent>;
	let componentUserService: UserService; // the actually injected service
	let userService: UserService; // the TestBed injected service
	let de: DebugElement;  // the DebugElement with the welcome message
	let el: HTMLElement; // the DOM element with the welcome message

	let userServiceStub: {
		isLoggedIn: boolean;
		user: { name: string}
	};

	beforeEach(async () => {
		// stub UserService for test purposes
		userServiceStub = {
			isLoggedIn: true,
			user: { name: 'Test User'}
		};

		await TestBed.configureTestingModule({
				declarations: [ WelcomeComponent ],
				providers:    [
					{ provide: UserService, useValue: userServiceStub }
				]
			})
			.compileComponents()
		;

		fixture = TestBed.createComponent(WelcomeComponent);
		comp    = fixture.componentInstance;

		// UserService actually injected into the component
		userService = fixture.debugElement.injector.get(UserService);
		componentUserService = userService;
		// UserService from the root injector
		userService = TestBed.get(UserService);

		//  get the "welcome" element by CSS selector (e.g., by class name)
		de = fixture.debugElement.query(By.css('.welcome'));
		el = de.nativeElement;
	});

	it('should welcome the user', () => {
		fixture.detectChanges();
		const content = el.textContent;
		expect(content).to.contain('Welcome', '"Welcome ..."');
		expect(content).to.contain('Test User', 'expected name');
	});

	it('should welcome "Bubba"', () => {
		userService.user.name = 'Bubba'; // welcome message hasn't been shown yet
		fixture.detectChanges();
		expect(el.textContent).to.contain('Bubba');
	});

	it('should request login if not logged in', () => {
		userService.isLoggedIn = false; // welcome message hasn't been shown yet
		fixture.detectChanges();
		const content = el.textContent;
		expect(content).not.to.contain('Welcome', 'not welcomed');
		expect(content).to.match(/log in/i, '"log in"');
	});

	it('should inject the component\'s UserService instance',
		inject([UserService], (service: UserService) => {
			expect(service).to.be.equal(componentUserService);
		})
	);

	it('TestBed and Component UserService should be the same', () => {
		expect(userService === componentUserService).to.be.true;
	});

	it('stub object and injected UserService should not be the same', () => {
		expect(userServiceStub === userService).to.be.false;

		// Changing the stub object has no effect on the injected service
		userServiceStub.isLoggedIn = false;
		expect(userService.isLoggedIn).to.be.true;
	});
});

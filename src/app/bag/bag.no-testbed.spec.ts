const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { stub } from 'sinon';

import { DependentService, FancyService } from './bag';

///////// Fakes /////////
export class FakeFancyService extends FancyService {
	value = 'faked value';
}
////////////////////////
// Straight Jasmine - no imports from Angular test libraries

describe('FancyService without the TestBed', () => {
	let service: FancyService;

	beforeEach(() => { service = new FancyService(); });

	it('#getValue should return real value', () => {
		expect(service.getValue()).to.equal('real value');
	});

	it('#getAsyncValue should return async value', async () => {
		const value = await service.getAsyncValue();
		expect(value).to.equal('async value');
	});

	it('#getTimeoutValue should return timeout value',  async () => {
		service = new FancyService();
		const value = await service.getTimeoutValue();
		expect(value).to.equal('timeout value');
	});

	it('#getObservableValue should return observable value', async () => {
		const value = await new Promise((resolve, reject) => {
			service.getObservableValue().subscribe(resolve, reject);
		});
		expect(value).to.equal('observable value');
	});

});

// DependentService requires injection of a FancyService
describe('DependentService without the TestBed', () => {
	let service: DependentService;

	it('#getValue should return real value by way of the real FancyService', () => {
		service = new DependentService(new FancyService());
		expect(service.getValue()).to.equal('real value');
	});

	it('#getValue should return faked value by way of a fakeService', () => {
		service = new DependentService(new FakeFancyService());
		expect(service.getValue()).to.equal('faked value');
	});

	it('#getValue should return faked value from a fake object', () => {
		const fake =  { getValue: () => 'fake value' };
		service = new DependentService(fake as FancyService);
		expect(service.getValue()).to.equal('fake value');
	});

	it('#getValue should return stubbed value from a FancyService spy', () => {
		const fancy = new FancyService();
		const stubValue = 'stub value';
		const spy = stub(fancy, 'getValue').returns(stubValue);
		service = new DependentService(fancy);

		expect(service.getValue()).to.equal(stubValue, 'service returned stub value');
		expect(spy, 'stubbed method was called once').to.have.been.calledOnce;
		expect(spy).to.have.always.returned(stubValue);
	});
});

import { ReversePipe } from './bag';

describe('ReversePipe', () => {
	let pipe: ReversePipe;

	beforeEach(() => { pipe = new ReversePipe(); });

	it('transforms "abc" to "cba"', () => {
		expect(pipe.transform('abc')).to.equal('cba');
	});

	it('no change to palindrome: "able was I ere I saw elba"', () => {
		const palindrome = 'able was I ere I saw elba';
		expect(pipe.transform(palindrome)).to.equal(palindrome);
	});

});


import { ButtonComponent } from './bag';
describe('ButtonComp', () => {
	let comp: ButtonComponent;
	beforeEach(() => {
		comp = new ButtonComponent()
	});

	it('#isOn should be false initially', () => {
		expect(comp.isOn).to.equal(false);
	});

	it('#clicked() should set #isOn to true', () => {
		comp.clicked();
		expect(comp.isOn).to.be.true;
	});

	it('#clicked() should set #message to "is on"', () => {
		comp.clicked();
		expect(comp.message).to.match(/is on/i);
	});

	it('#clicked() should toggle #isOn', () => {
		comp.clicked();
		expect(comp.isOn).to.be.true;
		comp.clicked();
		expect(comp.isOn).to.be.false;
	});
});

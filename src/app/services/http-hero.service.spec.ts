const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { inject, TestBed } from '@angular/core/testing';

import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { HttpHeroService as HeroService, Hero } from './http-hero.service';

const makeHeroData = () => [
	{ id: 1, name: 'Windstorm' },
	{ id: 2, name: 'Bombasto' },
	{ id: 3, name: 'Magneta' },
	{ id: 4, name: 'Tornado' }
] as Hero[];

////////  Tests  /////////////
describe('Http-HeroService (mockBackend)', () => {

	beforeEach(async () => {
		await TestBed.configureTestingModule({
				imports: [ HttpModule ],
				providers: [
					HeroService,
					{ provide: XHRBackend, useClass: MockBackend }
				]
			})
			.compileComponents()
		;
	});

	it('can instantiate service when inject service',
		inject([HeroService], (service: HeroService) => {
			expect(service).to.be.instanceOf(HeroService);
		})
	);

	it('can instantiate service with "new"', inject([Http], (http: Http) => {
		expect(http).not.to.be.null;
		let service = new HeroService(http);
		expect(service).to.be.instanceOf(HeroService);
	}));

	it('can provide the mockBackend as XHRBackend',
		inject([XHRBackend], (backend: MockBackend) => {
			expect(backend).not.to.be.null;
		})
	);

	describe('when getHeroes', () => {
		let backend: MockBackend;
		let service: HeroService;
		let fakeHeroes: Hero[];
		let response: Response;

		beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
			backend = be;
			service = new HeroService(http);
			fakeHeroes = makeHeroData();
			const options = new ResponseOptions({
				status: 200,
				body: {data: fakeHeroes}
			});
			response = new Response(options);
		}));

		it('should have expected fake heroes (then)', inject([], async () => {
			backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

			const heroes = await service.getHeroes().toPromise();
			// .then(() => Promise.reject('deliberate'))
			expect(heroes).to.have.lengthOf(fakeHeroes.length,
				'should have expected no. of heroes');
		}));

		it('should have expected fake heroes (Observable.do)', inject([], async () => {
			backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

			await service.getHeroes().do(heroes => {
				expect(heroes).to.have.lengthOf(fakeHeroes.length,
					'should have expected no. of heroes');
			}).toPromise();
		}));


		it('should be OK returning no heroes', inject([], async () => {
			let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
			backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

			const heroes = await service.getHeroes().toPromise();
			expect(heroes).to.have.lengthOf(0, 'should have no heroes');
		}));

		it('should treat 404 as an Observable error', inject([], async () => {
			let resp = new Response(new ResponseOptions({status: 404}));
			backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

			await service.getHeroes()
				.do(() => {
					throw new Error('should not respond with heroes');
				})
				.catch(err => {
					expect(err).to.match(/Bad response status/, 'should catch bad response status code');
					return Observable.of(null); // failure is the expected test result
				})
				.toPromise()
			;
		}));
	});
});

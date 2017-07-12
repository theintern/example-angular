import { QuoteService } from './quote.service';

import { stub, SinonStub } from 'sinon';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';

const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

describe('QuoteService', () => {
	let service: QuoteService;
	let httpStub: {
		get: SinonStub
	};

	beforeEach(() => {
		httpStub = {
			get: stub().returns(Observable.of({
				json(): any {
					return {
						id: 1,
						text: 'foo bar baz'
					};
				}
			}))
		};
		service = new QuoteService(httpStub as any);
	});

	it('should request /quote', async () => {
		await service.getQuote().toPromise();

		expect(httpStub.get.calledOnce).to.be.true;
		expect(httpStub.get.firstCall.args).to.deep.equal(['/quote']);
	});

	it('should return a quote', async () => {
		const response = await service.getQuote().toPromise();

		expect(response).to.deep.equal({
			id: 1,
			text: 'foo bar baz'
		});
	});
});

const { describe, it, beforeEach, afterEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { Observable } from 'rxjs/Observable';

async function timeout(callback: Function, time = 0) {
	await new Promise((resolve, reject) => {
		setTimeout(() => {
			try {
				if (callback) {
					callback();
				}
				resolve();
			} catch (error) {
				reject(error);
			}
		}, time)
	});
}

describe('Angular async helper', () => {
	let actuallyDone = false;

	beforeEach(() => { actuallyDone = false; });

	afterEach(() => { expect(actuallyDone, 'actuallyDone should be true').to.be.true; });

	it('should run normal test', () => { actuallyDone = true; });

	it('should run normal async test', async () => {
		await timeout(() => { actuallyDone = true });
	});

	it('should run async test with successful promise', async () => {
		await timeout(null, 10);
		actuallyDone = true;
	});

	it('should run async test with failed promise', async () => {
		try {
			await timeout(() => { throw new Error('test'); }, 10);
		} catch (err) {
			actuallyDone = true;
		}
	});

	// Use done. Cannot use setInterval with async or fakeAsync
	// See https://github.com/angular/angular/issues/10127
	it('should run async test with successful delayed Observable', async () => {
		const source = Observable.of(true).delay(10);
		const value = await new Promise<any>((resolve, reject) => {
			source.subscribe(
				val => resolve(val),
				err => reject(err)
			);
		});
		actuallyDone = value;
	});

	// Cannot use setInterval from within an async zone test
	// See https://github.com/angular/angular/issues/10127
	// xit('should run async test with successful delayed Observable', async(() => {
	//   const source = Observable.of(true).delay(10);
	//   source.subscribe(
	//     val => actuallyDone = true,
	//     err => fail(err)
	//   );
	// }));

	// // Fail message: Error: 1 periodic timer(s) still in the queue
	// // See https://github.com/angular/angular/issues/10127
	// xit('should run async test with successful delayed Observable', fakeAsync(() => {
	//   const source = Observable.of(true).delay(10);
	//   source.subscribe(
	//     val => actuallyDone = true,
	//     err => fail(err)
	//   );

	//   tick();
	// }));

});

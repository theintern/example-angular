import { UserService } from './user.service';

const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

describe('UserService', () => {
	let service: UserService;

	beforeEach(() => {
		service = new UserService();
	});

	it('should have default values', () => {
		expect(service.isLoggedIn).to.be.false;
		expect(service.user).to.equal(null);
	});
});

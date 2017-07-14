const { describe, it, before } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import Home from './pages/Home';

describe('E2E Tests', () => {
	let page: Home;

	before(async ({ remote }) => {
		page = new Home(remote);
		await page.load();
	});

	it('should begin at /dashboard', async () => {
		expect(await page.getCurrentUrl()).to.match(/\/dashboard$/);
		expect(await page.getDashboard()).to.exist;
	});

	it('should navigate to /heroes when clicking Heroes', async () => {
		await page.clickHeroesNav();
		await page.waitForHeroes();
		expect(await page.getCurrentUrl()).to.match(/\/heroes$/);
	});

	it('should navigate to /about when clicking About', async () => {
		await page.clickAboutNav();
		await page.waitForAbout();
		expect(await page.getCurrentUrl()).to.match(/\/about$/);
	});
});

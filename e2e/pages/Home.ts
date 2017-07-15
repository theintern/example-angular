import Page from './Page';
import { By } from './locators';

export async function load() {
	const { parent: remote } = this;
	await remote.setFindTimeout(5000);
	await remote.get('dist/index.html');
	await remote.findDisplayedByCssSelector('my-app[ng-version]');
}

export default class Home extends Page {
	protected _app = By.css('my-app[ng-version]');
	protected _nav = this._app.xpath('./nav');
	protected _dashboard = this._app.css('app-dashboard');
	protected _heroes = this._app.css('app-heroes');
	protected _about = this._app.css('app-about');

	async load() {
		await super.load();

		const { remote } = this;
		await remote.get('dist/index.html');
		await this.waitForApp();
	}

	async getApp() {
		return this._find(this._app);
	}

	async getNav() {
		return this._find(this._nav);
	}

	async getDashboard() {
		return this._find(this._dashboard);
	}

	async getHeroes() {
		return this._find(this._heroes);
	}

	async getAbout() {
		return this._find(this._about);
	}

	async clickHeroesNav() {
		await this._clickNav('/heroes');
	}

	async clickAboutNav() {
		await this._clickNav('/about');
	}

	async waitForApp() {
		return this._findDisplayed(this._app);
	}

	async waitForDashboard() {
		return this._findDisplayed(this._dashboard);
	}

	async waitForHeroes() {
		return this._findDisplayed(this._heroes);
	}

	async waitForAbout() {
		return this._findDisplayed(this._about);
	}

	protected async _clickNav(route: string) {
		const nav = await this.getNav();
		const link = await this._find(By.xpath(`./a[@routerlink="${route}"]`), nav);
		await link.click();
	}
}

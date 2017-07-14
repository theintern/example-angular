import Page from './Page';

export async function load() {
	const { parent: remote } = this;
	await remote.setFindTimeout(5000);
	await remote.get('dist/index.html');
	await remote.findDisplayedByCssSelector('my-app[ng-version]');
}

export default class Home extends Page {
	protected _app = 'my-app[ng-version]';
	protected _dashboard = 'my-app app-dashboard';
	protected _heroes = 'my-app app-heroes';
	protected _about = 'my-app app-about';

	async load() {
		const { _remote: remote } = this;
		await remote.setFindTimeout(5000);
		await remote.get('dist/index.html');
		await this.waitForApp();
	}

	async getApp() {
		return this._find(this._app);
	}

	async getNav() {
		return this._find('my-app > nav');
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

	async getCurrentUrl() {
		return this._remote.getCurrentUrl();
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
		const link = await nav.findByCssSelector(`a[routerLink="${route}"]`);
		await link.click();
	}
}

import { Command, Element } from '@theintern/leadfoot';
import { Remote } from 'intern/lib/executors/Node';
import { Locator, find, findDisplayed } from './locators';

export default class Page {
	constructor (protected remote: Remote) {}

	async load() {
		await this.remote.setFindTimeout(5000);
	}

	async getCurrentUrl() {
		return this.remote.getCurrentUrl();
	}

	protected async _find(selector: string | Locator, command: Command<Element> | Element = this.remote) {
		if (typeof selector === 'string') {
			return command.findByCssSelector(selector);
		}

		return find(command, selector);
	}

	protected async _findDisplayed(selector: string | Locator, command: Command<Element> | Element = this.remote) {
		if (typeof selector === 'string') {
			return command.findDisplayedByCssSelector(selector);
		}

		return findDisplayed(command, selector);
	}
}

import { Remote } from 'intern/lib/executors/Node';

export default class Page {
	constructor (protected _remote: Remote) {}

	protected async _find(selector: string) {
		const { _remote } = this;
		return _remote.findByCssSelector(selector);
	}

	protected async _findDisplayed(selector: string) {
		const { _remote } = this;
		return _remote.findDisplayedByCssSelector(selector);
	}
}

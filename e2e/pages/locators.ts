import { Command, Element } from '@theintern/leadfoot';
import { Strategies } from '@theintern/leadfoot/lib/Locator';

export { Strategies }

export interface LocatorArg {
	readonly using: Strategies;
	readonly value: string;
};

export class Locator {
	readonly args: LocatorArg[];

	constructor(args: LocatorArg[] = []) {
		this.args = args;
	}

	className(value: string) {
		return this.add('class name', value);
	}

	css(value: string) {
		return this.add('css selector', value);
	}

	id(value: string) {
		return this.add('id', value);
	}

	name(value: string) {
		return this.add('name', value);
	}

	linkText(value: string) {
		return this.add('link text', value);
	}

	partialLinkText(value: string) {
		return this.add('partial link text', value);
	}

	tagName(value: string) {
		return this.add('tag name', value);
	}

	xpath(value: string) {
		return this.add('xpath', value);
	}

	protected add(using: Strategies, value: string) {
		return new Locator([...this.args, { using, value }]);
	}
}

export const By = {
	className(value: string) {
		return new Locator().className(value);
	},

	css(value: string) {
		return new Locator().css(value);
	},

	id(value: string) {
		return new Locator().id(value);
	},

	name(value: string) {
		return new Locator().name(value);
	},

	linkText(value: string) {
		return new Locator().linkText(value);
	},

	partialLinkText(value: string) {
		return new Locator().partialLinkText(value);
	},

	tagName(value: string) {
		return new Locator().tagName(value);
	},

	xpath(value: string) {
		return new Locator().xpath(value);
	}
};

export async function find(command: Command<Element> | Element, locator: Locator) {
	return locator.args.reduce(async (previous, { using, value }) => {
		const element = ((await previous) || command) as Element;
		return element.find(using, value);
	}, Promise.resolve(null) as Promise<Element>);
}

export async function findDisplayed(command: Command<Element> | Element, locator: Locator) {
	return locator.args.reduce(async (previous, { using, value }) => {
		const element = ((await previous) || command) as Element;
		return element.findDisplayed(using, value);
	}, Promise.resolve(null) as Promise<Element>);
}

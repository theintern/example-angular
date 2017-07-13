const chai = intern.getPlugin('chai');
import 'sinon';

function elementText(element: any): string {
	if (Array.isArray(element)) {
		return element.map(elementText).join('');
	}

	if (element.nodeType === Node.COMMENT_NODE) {
		return '';
	}

	if (element.nodeType === Node.ELEMENT_NODE && element.hasChildNodes()) {
		return elementText([...element.childNodes]);
	}

	if (element.nativeElement) {
		element = element.nativeElement;
	}

	return element.textContent;
}

chai.use(({ Assertion }, utils: any) => {
	Assertion.addMethod('nodeText', function (str: string) {
		const obj = utils.flag(this, 'object');
		const text = elementText(obj);

		new Assertion(text).to.contain(str);
	});
});

declare global {
	namespace Chai {
		interface Assertion {
			nodeText: Include;
		}
	}
}

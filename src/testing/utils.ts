import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

export function newEvent(eventName: string, bubbles = false, cancelable = false) {
	let evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
	evt.initCustomEvent(eventName, bubbles, cancelable, null);
	return evt;
}

// See https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvents = {
	left:  { button: 0 },
	right: { button: 2 }
};

export function click(element: DebugElement, eventObj: any = ButtonClickEvents.left) {
	element.triggerEventHandler('click', eventObj);
}

export async function tick() {
	await new Promise(resolve => {
		setTimeout(() => resolve(), 500);
	});
}

/** Wait a tick, then detect changes */
export async function advance(fixture: ComponentFixture<any>) {
	fixture.detectChanges();
	await fixture.whenStable();
	fixture.detectChanges();
	await tick();
	fixture.detectChanges();
}

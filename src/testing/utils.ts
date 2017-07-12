export function newEvent(eventName: string, bubbles = false, cancelable = false) {
	let evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
	evt.initCustomEvent(eventName, bubbles, cancelable, null);
	return evt;
}

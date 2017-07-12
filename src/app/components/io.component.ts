import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'io',
	template: `<span (click)="onClick()" class="hero">
		{{ name }}
	</span>`
})
export class IOComponent {
	@Input() name: string;
	@Output() clicked = new EventEmitter<string>();

	onClick() {
		this.clicked.emit(this.name);
	}
}

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

export interface Quote {
	id: number;
	text: string;
}

@Injectable()
export class QuoteService {
	constructor(private http: Http) {}

	getQuote() {
		return this.http.get('/quote')
			.map(response => response.json() as Quote)
		;
	}
}

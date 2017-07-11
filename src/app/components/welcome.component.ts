import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { QuoteService } from '../services/quote.service';

@Component({
	selector: 'app-welcome',
	template: '<h3 class="welcome"><i>{{welcome}}</i></h3><div class="quote">{{quote}}</div>'
})
export class WelcomeComponent implements OnInit {
	welcome = '-- not initialized yet --';
	quote = '...';

	constructor(private userService: UserService,
				private quoteService: QuoteService) { }

	ngOnInit(): void {
		this.welcome = this.userService.isLoggedIn ?
			'Welcome, ' + this.userService.user.name :
			'Please log in.';

		this.quoteService.getQuote().subscribe(quote => this.quote = quote);
	}
}

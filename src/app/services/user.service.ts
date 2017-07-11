import { Injectable } from '@angular/core';

export interface User {
	name: string;
}

@Injectable()
export class UserService {
	isLoggedIn = false;
	user: User = null;
}

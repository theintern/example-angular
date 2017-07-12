import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';

import { AppComponent }     from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AboutComponent }   from './components/about.component';
import { BannerComponent }  from './components/banner.component';
import { HeroService }      from './services/hero.service';
import { UserService }      from './services/user.service';
import { TwainService }     from './services/twain.service';
import { WelcomeComponent } from './components/welcome.component';


import { DashboardModule }  from './components/dashboard/dashboard.module';
import { SharedModule }     from './shared/shared.module';

@NgModule({
	imports: [
		BrowserModule,
		DashboardModule,
		AppRoutingModule,
		SharedModule
	],
	providers:    [ HeroService, TwainService, UserService ],
	declarations: [ AppComponent, AboutComponent, BannerComponent, WelcomeComponent ],
	bootstrap:    [ AppComponent ]
})
export class AppModule { }

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {ListusersComponent} from './listusers/listusers.component';
import {UpdateUserComponent} from './update-user/update-user.component';
import {FilmslistComponent} from './filmslist/filmslist.component';
import {AddfilmComponent} from './addfilm/addfilm.component';
import {HomeComponent} from './home/home.component'; // Import HomeComponent instead of AppComponent
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {CookieService} from 'ngx-cookie-service';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideClientHydration} from '@angular/platform-browser';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import { authGuard} from './auth.guard';
import {WatchListComponent} from './CompGit/watch-list/watch-list.component';
import {AddMovieComponent} from './CompGit/add-movie/add-movie.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login-user', component: LoginComponent},
  {path: 'listusers', component: ListusersComponent,canActivate:[authGuard]},
  {path: 'users/update-user/:id', component: UpdateUserComponent,},
  {path: 'films/all', component: FilmslistComponent,},
  {path: 'film/add', component: AddfilmComponent,},
  //{path: '', component: HomeComponent ,canActivate:[authGuard]} , // Use HomeComponent instead of AppComponent

//sdfsdfsdfg
  { path: '', component: WatchListComponent },
  { path: 'addMovie', component: AddMovieComponent },

];


@NgModule({

  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],  bootstrap: [AppComponent], declarations: [

  ], providers: [
  ],
})
export class AppRoutingModule { }



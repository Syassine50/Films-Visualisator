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
import {ShowAbonnementsComponent} from './AbonnementMangaement/show-abonnements/show-abonnements.component';
import {AddAbonnComponent} from './AbonnementMangaement/add-abonn/add-abonn.component';
import {UpdateAbnnComponent} from './AbonnementMangaement/update-abnn/update-abnn.component';
import {PaiementComponent} from './PaiementComponents/paiement/paiement.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login-user', component: LoginComponent},
  {path: 'listusers', component: ListusersComponent,canActivate:[authGuard]},
  {path: 'users/update-user/:id', component: UpdateUserComponent,},
  {path: '', component: FilmslistComponent,},
  {path: 'film/add', component: AddfilmComponent, canActivate:[authGuard]},

  //{path: '', component: HomeComponent ,canActivate:[authGuard]} , // Use HomeComponent instead of AppComponent

// // //sdfsdfsdfg
//   { path: '', component: WatchListComponent },
//   { path: 'addMovie', component: AddMovieComponent },

  {path: 'Abonnement/ListAbonnement' , component:ShowAbonnementsComponent},
  {path: 'Abonnement/Add' , component:AddAbonnComponent , canActivate:[authGuard]},
  {path: 'Abonnement/update/:id' , component:UpdateAbnnComponent , canActivate:[authGuard]},
  {path: 'Paiement/add/:id/:duree' , component:PaiementComponent , canActivate:[authGuard]},
  { path: 'film/edit/:id', component: AddfilmComponent }
];


@NgModule({

  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],  bootstrap: [AppComponent], declarations: [

  ], providers: [
  ],
})
export class AppRoutingModule { }



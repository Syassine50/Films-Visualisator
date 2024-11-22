import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ListusersComponent } from './listusers/listusers.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { FilmslistComponent } from './filmslist/filmslist.component';
import { AddfilmComponent } from './addfilm/addfilm.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {authGuard} from './auth.guard';
import {WatchListComponent} from './CompGit/watch-list/watch-list.component';
import {ToolBarComponent} from './CompGit/tool-bar/tool-bar.component';
import {ButtonComponent} from './CompGit/button/button.component';
import {MovieTileComponent} from './CompGit/movie-tile/movie-tile.component';
import {AddMovieComponent} from './CompGit/add-movie/add-movie.component';
import { AbonnementAddComponent } from './abonnement-add/abonnement-add.component';
import { AddAbonnComponent } from './AbonnementMangaement/add-abonn/add-abonn.component';
import { UpdateAbnnComponent } from './AbonnementMangaement/update-abnn/update-abnn.component';
import { ShowAbonnementsComponent } from './AbonnementMangaement/show-abonnements/show-abonnements.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ListusersComponent,
    UpdateUserComponent,
    FilmslistComponent,
    AddfilmComponent,
    HomeComponent,
    NavbarComponent,

    //commppp


    WatchListComponent,
    ToolBarComponent,
    ButtonComponent,
    MovieTileComponent,
    AddMovieComponent,
    AbonnementAddComponent,
    AddAbonnComponent,
    UpdateAbnnComponent,
    ShowAbonnementsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule
  ],
  providers: [

    provideHttpClient(withFetch()),
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

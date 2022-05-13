import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { MembresComponent } from './components/membres/membres.component';
import { GameComponent } from './components/game/game.component';
import { FinComponent } from './components/fin/fin.component';
import { StatComponent } from './components/stat/stat.component';
//firebase:

import { AngularFireModule} from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InscriptionComponent,
    MembresComponent,
    GameComponent,
    FinComponent,
    StatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireAuthModule,

    AngularFireModule.initializeApp(environment.firebase),


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

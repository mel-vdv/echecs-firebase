import { StatComponent } from './components/stat/stat.component';
import { FinComponent } from './components/fin/fin.component';
import { GameComponent } from './components/game/game.component';
import { MembresComponent } from './components/membres/membres.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {path:'inscription/:idg', component: InscriptionComponent},
  {path:'membres/:idg',component: MembresComponent},
  {path: 'game/:num/:qui', component: GameComponent},
  {path: 'fin/:num', component: FinComponent},
  {path: 'stat/:idg', component: StatComponent},
  { path: "**", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

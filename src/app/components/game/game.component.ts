import { VerifMouvService } from './../../services/verif-mouv.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CrudservService } from './../../services/crudserv.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  maColor!: string;;
  p?: any;
  cases$: any;
  parSub?: Subscription;
  num?: any;
  duo!: any[];


  constructor(
    private crud: CrudservService,
    private ar: ActivatedRoute,
    private verifMouv: VerifMouvService
  ) { }

  ngOnInit(): void {
    this.maColor = 'b';
    this.verifMouv.maColor = this.maColor;
    this.duo = [];
    this.parSub = this.ar.paramMap.subscribe((params: any) => {
      this.num = params.get('num');
      console.log('ngoninit: num ', this.num);

      this.crud.getInfoPartie(this.num).subscribe((data: any) => {
        this.p = data;
        console.log(JSON.stringify(this.p));
      });
      this.crud.getCases(this.num).subscribe((data: any) => {
        this.cases$ = data;
        console.log(JSON.stringify(this.cases$[1]));
      });
    });
  }
  ///////////////////////////////////////
  toucher(color: string, caz: any, piece: string, perso: string, chiffre: any, lettre: string) {
    console.log(caz, perso);
    if (this.p.tour === this.maColor) {
      switch (this.duo!.length) {
        case 0: if (this.maColor === color) { this.duo.push({ color: color, case: caz, piece: piece, perso: perso, chiffre: chiffre, lettre: lettre }) }
        else { console.log('clic1: couleur refusée') };
          break;
        case 1: if (this.maColor !== color) {
          this.duo.push({ color: color, case: caz, piece: piece, perso: perso, chiffre: chiffre, lettre: lettre });

         this.verifMouv.verifMouvPiece(this.duo)
          .then(() => {
            if(this.verifMouv.verdict){console.log('mouvement autorisé: etape suivante');}
            else{
              console.log('mouvement interdit: pop()');
              this.duo.pop();
            }
         
          });
        }
        else { console.log('clic2: couleur refusée') };
          break;
        default: console.log('3em clic refusé');
      }
    }
    else { console.log('pas votre tour de jouer'); }
  }
  //////////////////////////////////////////////////////////

}

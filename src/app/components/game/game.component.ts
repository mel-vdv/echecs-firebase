import { EnregistrerService } from './../../services/enregistrer.service';
import { VerifEchecService } from './../../services/verif-echec.service';
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

  //////////////////////////////////////////////////////////
  constructor(
    private crud: CrudservService,
    private ar: ActivatedRoute,
    private verifMouv: VerifMouvService,
    private verifEchec: VerifEchecService,
    private enreg : EnregistrerService
  ) { }
  ////////////////////////////////////////////////////////////////
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
        //etape1 : color clic 1:
        case 0: if (this.maColor === color) { this.duo.push({ color: color, case: caz, piece: piece, perso: perso, chiffre: chiffre, lettre: lettre }) }
        else { console.log('clic1: couleur refusée') };
          break;
        //etape 2 : color clic 2 : 

        case 1: if (this.maColor !== color) {
          this.duo.push({ color: color, case: caz, piece: piece, perso: perso, chiffre: chiffre, lettre: lettre });
          //etape 3 : mouv autorisé selon piece?:
          this.verifMouv.verifMouvPiece(this.duo)
            .then(() => {
              if (this.verifMouv.verdict) {
                console.log('mouvement autorisé: etape suivante');
                // etape 4 : 1/simuler le mouvement 2/positions ennemis 3/ pour vérif si echec : 
                //1/
                this.simuler().then(() => {
                  //2/
                  this.getPositionsEnnemis().then(() => {
                    let monroi = this.simulacre$.filter((a: any) => a.perso === 'r' && a.color === this.maColor)[0];
                    this.verifMouv.verdict = false;

                    this.positionsEnnemis.forEach((b: any) => {
                      //3/
                      if (this.verifMouv.verdict) {
                        console.log('clic2 refusé : met mon roi en echec --> duo.pop()');
                        this.duo.pop(); return;
                      }
                      else {
            
                        let pair = [b, monroi];
                        this.verifMouv.verifMouvPiece(pair);
                      }
                    });
                    if(!this.verifMouv.verdict){
                        console.log('ok, ce mvmt met pas mon roi en echec --> enregistre');
                        //etape 5 : enregistrer dans bdd:
                        this.crud.updateCase1(this.num, this.duo[0].case);
                        this.crud.updateCase2(this.num, this.duo[1].case, this.duo[0]);
                        /*
                        if(this.duo[1].piece !=='vide'&& this.duo[1].color==='n'){
                          this.p.mortsn.push(this.duo[1].piece); 
                          this.crud.updateMortsn(this.num,this.p.mortsn);
                        }
                        else if (this.duo[1].piece !=='vide'&& this.duo[1].color==='b'){
                          this.p.mortsb.push(this.duo[1].piece); 
                          this.crud.updateMortsb(this.num,this.p.mortsb);

                        }*/
                    }
                  });
                });
              }
              else {
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
  simulacre$: any;
  async simuler() {

    let inda = this.cases$.findIndex((z: any) => z.case === this.duo[0].case);
    let indb = this.cases$.findIndex((z: any) => z.case === this.duo[1].case);

    this.simulacre$ = this.cases$.slice();

    this.simulacre$.splice(inda, 1, {
      case: this.duo[0].case, lettre: this.duo[0].lettre, chiffre: this.duo[0].chiffre,
      perso: 'vide', color: 'vide', piece: 'vide'
    });
    this.simulacre$.splice(indb, 1, {
      case: this.duo[1].case, lettre: this.duo[1].lettre, chiffre: this.duo[1].chiffre,
      perso: this.duo[0].perso, color: this.duo[0].color, piece: this.duo[0].piece
    });
  }
  /////////////////////////////////////////////////////////////
  positionsEnnemis: any;
  async getPositionsEnnemis() {
    this.positionsEnnemis = this.simulacre$.slice();
    this.positionsEnnemis = this.positionsEnnemis.filter((e: any) => e.color !== this.maColor && e.perso !== 'vide');

    return this.positionsEnnemis;
  }


  ///////////////////////////////////////////////////////////////

 
}

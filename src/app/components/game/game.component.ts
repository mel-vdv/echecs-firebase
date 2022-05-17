import { EnregistrerService } from './../../services/enregistrer.service';
import { VerifEchecService } from './../../services/verif-echec.service';
import { VerifMouvService } from './../../services/verif-mouv.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CrudservService } from './../../services/crudserv.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  maColor!: string; taColor!: string;
  p?: any;
  cases$: any;
  parSub?: Subscription;
  partieSub?: Subscription;
  casesSub?: Subscription;

  num!: any;
  duo!: any[];
  qui!: any;

  //////////////////////////////////////////////////////////
  constructor(
    private crud: CrudservService,
    private ar: ActivatedRoute,
    private verifMouv: VerifMouvService,
    private verifEchec: VerifEchecService,
    private enreg: EnregistrerService
  ) { }
  ////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.duo = [];
    //souscription1:
    this.parSub = this.ar.paramMap.subscribe((params: any) => {
      this.num = params.get('num');
      this.qui = params.get('qui');
      console.log('ngoninit (params):', this.num, this.qui);
      //souscription 2 :
      this.partieSub = this.crud.getInfoPartie(this.num).subscribe((data: any) => {
        this.p = data;
        if (this.p.b === this.qui) { this.maColor = 'b'; this.taColor = 'n'; } else { this.maColor = 'n'; this.taColor = 'b'; }
        this.verifMouv.maColor = this.maColor;
      });
      //souscription 3:
      this.casesSub = this.crud.getCases(this.num).subscribe((data: any) => {
        this.cases$ = data;
        this.cases$.forEach((e: any) => { e.classe = 'normal'; })
      });
    });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  toucher(color: string, caz: any, piece: string, perso: string, chiffre: any, lettre: string) {
    console.log(caz, perso);
    if (this.p.tour === this.maColor) {
      switch (this.duo!.length) {
        //etape1 : color clic 1:-----------------------------------------------------------------------------------
        case 0: if (this.maColor === color) {
          console.log('1/ clic 1 ok');
          this.cases$.forEach((f: any) => {
            if (f.case === caz) { f.classe = 'vert'; } else { f.classe = 'normal'; }
          });
          this.duo.push({ color: color, case: caz, piece: piece, perso: perso, chiffre: chiffre, lettre: lettre });
        }
        else { console.log('1/ clic1: couleur refusée') };
          break;
        //etape 2 : color clic 2 : ---------------------------------------------------------------------------------

        case 1: if (this.maColor !== color) {
          this.duo.push({ color: color, case: caz, piece: piece, perso: perso, chiffre: chiffre, lettre: lettre });
          //etape 3 : mouv autorisé selon piece?:
          this.verifMouv.verifMouvPiece(this.duo)
            .then(() => {
              if (this.verifMouv.verdict) {
                console.log('2/ clic2 : mouv piece autorisé');
                //3.bis: obstacle? trajet: tous 'vide'?------------------------------------------------------------------
                this.verifObstacle().then(() => {
                  if (!this.obstacle) { // non
                    console.log('3/ pas de obstacle');
                    // etape 4 : 1/simuler le mouvement 2/positions ennemis 3/ pour vérif si echec : ---------------------------
                    //1/
                    this.simuler().then(() => {
                      //2/
                      this.getPositionsEnnemis().then(() => {
                        this.echecAmonRoi().then(() => {
                          if (this.echecMonRoi) {
                            console.log('4/ echec à mon roi: clic2 refusé: pop()');
                            this.duo.pop();
                          }
                          else {
                            console.log('4/ pas echec a mon roi: clic 2 ok');
                            console.log('5/ enregistre mouv (+ morts)');
                            //etape 5 : enregistrer dans bdd:--------------------------------------------------------------------
                            //a. le mouvement a-->b:
                            this.crud.updateCase1(this.num, this.duo[0].case);
                            this.crud.updateCase2(this.num, this.duo[1].case, this.duo[0]);
                            // b. les morts b/n si il y en a : 

                            if (this.duo[1].piece !== 'vide' && this.duo[1].color === 'n') {
                              this.p.mortsn.push(this.duo[1].piece);
                              this.crud.updateMortsn(this.num, this.p.mortsn);
                            }
                            else if (this.duo[1].piece !== 'vide' && this.duo[1].color === 'b') {
                              this.p.mortsb.push(this.duo[1].piece);
                              this.crud.updateMortsb(this.num, this.p.mortsb);
                            }
                          }
                        })
                      })
                        //etape 6 = echec à ton roi? :---------------------------------------------------------------------------------------------------
                        .then(() => {
                          this.getPositionsMesSoldats().then(() => {
                            this.echecAtonRoi().then(() => {

                              if (this.echecRoiEnnemi) {
                                //etape7: on enregistre : ----------------------------------------------------------------------
                                let echec;
                                if (this.maColor === 'b') {
                                  echec = 'echecn';
                                } else { echec = 'echecb'; }
                                this.crud.echec(this.num, echec);
                                console.log('6/ echec au roi ennemi, au suivant');
                              }
                              else { console.log('6/ pas echec au roi, au suivant'); }
                            });
                          })
                            // etape 7 : au suivant ();--------------------------------------------------------------------------
                            .then(() => {
                              console.log('7/ au suivant()');
                              this.auSuivant();
                            });
                        });
                    });
                  }//--------------------------------------------------------------------------------------------------------------
                  //---------------------------------------------------------------------------------------------------------------
                  else { // oui, un obstacle
                    this.cases$.forEach((x: any) => {
                      if (x.case == caz) { x.classe = 'rouge'; }
                    });
                    this.duo.pop();
                    console.log('3/ obstacle : pop()');
                  }
                })
              }
              else {
                this.cases$.forEach((x: any) => {
                  if (x.case == caz) { x.classe = 'rouge'; }
                });
                console.log('2/ clic 2 : mouvement interdit: pop()');
                this.duo.pop();
              }
            });
        }
        else {
          //je change d'avis pour le clic 1 :---------------------------------------------------------
          this.duo = [{ color: color, case: caz, piece: piece, perso: perso, chiffre: chiffre, lettre: lettre }];
          this.cases$.forEach((f: any) => {
            if (f.case === caz) { f.classe = 'vert'; } else { f.classe = 'normal'; }
          });

        };
          break;
        default: console.log('3em clic refusé');
      }
    }
    else { console.log('pas votre tour de jouer'); }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  simulacre$: any;
  async simuler() {
    console.log('simule...');

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
    console.log('getpositions ennemis');
    this.positionsEnnemis = this.simulacre$.slice();
    this.positionsEnnemis = this.positionsEnnemis.filter((e: any) => e.color !== this.maColor && e.perso !== 'vide');
    return this.positionsEnnemis;
  }
  /////////////////////////////////////////////////////////////
  positionsMesSoldats: any;
  async getPositionsMesSoldats() {
    console.log('get pos mes soldats');
    this.positionsMesSoldats = this.cases$.slice();
    this.positionsMesSoldats = this.positionsMesSoldats.filter((e: any) => e.color === this.maColor && e.perso !== 'vide');
    return this.positionsMesSoldats;
  }
  //////////////////////////////////////////////////////////////
  obstacle?: boolean;
  async verifObstacle() {
    console.log('verif obstacle');
    if (this.duo[0].perso === 'f' || this.duo[0].perso === 't' || this.duo[0].perso === 'rn') {
      if (this.cases$.filter((e: any) => this.verifMouv.trajet.includes(e.case) && e.perso === 'vide').length === this.verifMouv.trajet.length) {
        console.log('ok, pas de obstacle'); return this.obstacle = false;
      }
      else { console.log('aie, obstacle: ->pop()'); return this.obstacle = true; }
    }
    else {
      return this.obstacle = false;
    }
  }
  /////////////////////////////
  echecMonRoi?: boolean;
  async echecAmonRoi() {
    console.log('verif echec a mon roi...');
    let monroi = this.cases$.filter((a: any) => a.perso === 'r' && a.color === this.maColor)[0];
    this.verifMouv.verdict = false;

    this.positionsMesSoldats.forEach((b: any) => {
      //3/
      if (this.verifMouv.verdict) {
        console.log('echec à mon roi');
        return this.echecRoiEnnemi = true;
      }
      else {
        let pair = [b, monroi];
        this.verifMouv.verifMouvPiece(pair);
      }
      return;
    });
  }
  /////////////////////////////
  echecRoiEnnemi?: boolean;
  async echecAtonRoi() {
    console.log('verif echec au roi ennemi');
    let tonroi = this.cases$.filter((a: any) => a.perso === 'r' && a.color !== this.maColor)[0];
    this.verifMouv.verdict = false;

    this.positionsMesSoldats.forEach((b: any) => {
      //3/
      if (this.verifMouv.verdict) {
        console.log('echec au roi ennemi');
        return this.echecRoiEnnemi = true;
      }
      else {
        let pair = [b, tonroi];
        this.verifMouv.verifMouvPiece(pair);
      }
      return;
    });
  }
  ///////////////////////////////////////////////////////////
  auSuivant() {
    console.log('au suivant');
    this.crud.changerTour(this.num, this.taColor);
    this.duo = [];
  }
  ///////////////////////////////////////////////////////////////

  ngOnDestroy(): void {
    console.log('game destroy -->  unsubscribe() x3');
    this.parSub?.unsubscribe();
    this.casesSub?.unsubscribe();
    this.partieSub?.unsubscribe();
  }
}

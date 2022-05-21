
import { VerifMouvService } from './../../services/verif-mouv.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CrudservService } from './../../services/crudserv.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReturnStatement } from '@angular/compiler';

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
        this.verifMouv.cases$ = data;
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
          this.verifMouv.cases$ = this.cases$;
          this.verifMouv.verifMouvPiece(this.duo)
            .then(() => {
              if (this.verifMouv.verdict) {

                console.log('2/ clic2 : mouv piece autorisé et pas de obstacle ');
                //-----------------------------------------------------------------
                // etape 4 : 1/simuler le mouvement 2/positions ennemis 3/ pour vérif si echec : ---------------------------
                //1/
                this.simuler().then(() => {
                  this.verifMouv.cases$ = this.simulacre$;
                  //2/
                  this.getPositionsEnnemis().then(() => {
                    this.echecAmonRoi().then(() => {
                      if (this.echecMonRoi) {
                        console.log('3/ echec à mon roi: clic2 refusé: pop()');
                        this.duo.pop();
                        this.duo.pop();
                        this.cases$.forEach((x: any) => {
                          x.classe = 'normal';
                        });
                        return;
                      }
                      else {
                        console.log('3/ pas echec a mon roi: clic 2 ok');
                        console.log('4/ enregistre mouv (+ morts)');
                        //etape 5 : enregistrer dans bdd:--------------------------------------------------------------------
                        this.enregistrer()
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
                                  console.log('5/ echec au roi ennemi, au suivant');
                                  return;
                                }
                                else {
                                  if (this.p.echec !== 'noechec') {
                                    this.crud.echec(this.num, 'noechec');
                                  }
                                  console.log('5/ pas echec au roi, au suivant');
                                }
                                return;
                              });
                            })
                              // etape 7 : au suivant ();--------------------------------------------------------------------------
                              .then(() => {
                                console.log('6/ au suivant()');
                                this.auSuivant();
                              });
                          });
                      }
                    });
                  })
                });
                //--------------------------------------------------------------------------------------------------------------

              }
              else {
                this.cases$.forEach((x: any) => {
                  if (x.case == caz) { x.classe = 'rouge'; }
                });
                console.log('2/ clic 2 : mouvement interdit/ obstacle: pop()');
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
    console.log('3. simule...');

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
    this.verifMouv.cases$ = this.simulacre$;
    return this.simulacre$;
  }
  /////////////////////////////////////////////////////////////
  positionsEnnemis: any;
  async getPositionsEnnemis() {
    console.log('3. getpositions ennemis');
    this.positionsEnnemis = this.simulacre$.slice();
    this.positionsEnnemis = this.positionsEnnemis.filter((e: any) => e.color !== this.maColor && e.perso !== 'vide');
    return this.positionsEnnemis;
  }
  /////////////////////////////////////////////////////////////
  positionsMesSoldats: any;
  async getPositionsMesSoldats() {
    console.log('5. get pos mes soldats');
    this.positionsMesSoldats = this.simulacre$.slice();
    this.positionsMesSoldats = this.positionsMesSoldats.filter((e: any) => e.color === this.maColor && e.perso !== 'vide');
    return this.positionsMesSoldats;
  }
  //////////////////////////////////////////////////////////////

  /////////////////////////////
  echecMonRoi?: boolean;
  async echecAmonRoi() {
    console.log('3. verif echec a mon roi...');
    let monroi = this.simulacre$.slice().filter((a: any) => a.perso === 'r' && a.color === this.maColor)[0];
    this.verifMouv.cases$ = this.simulacre$;
    this.verifMouv.verdict=false;
    this.echecMonRoi= false;

    this.positionsEnnemis.forEach((b: any) => {
      let pair = [b, monroi];
      if (this.verifMouv.verdict) {
        console.log('3. echec a mon roi', b.piece);
        return this.echecMonRoi = true;
      }
      else {
          this.verifMouv.verifMouvPiece(pair).then(() => {
            console.log('3. pas echec a mon roi ', b.piece);
            return;
          });
          return;
        }
      });
      return;
  }
  /////////////////////////////
  echecRoiEnnemi?: boolean;
  async echecAtonRoi() {
    console.log('5. verif echec au roi ennemi...');
    let tonroi = this.simulacre$.slice().filter((a: any) => a.perso === 'r' && a.color !== this.maColor)[0];
    this.verifMouv.cases$ = this.simulacre$;
    this.verifMouv.verdict=false;
    this.echecRoiEnnemi = false;

    this.positionsMesSoldats.forEach((b: any) => {
      let pair = [b, tonroi];
      if (this.verifMouv.verdict) {
        console.log('5. echec roi ennemi', b.piece);
        return this.echecRoiEnnemi = true;
      }
      else {
          this.verifMouv.verifMouvPiece(pair).then(() => {
            console.log('5. pas echec au roi ennemi ', b.piece);
           // return;
          });
         
        }
         return;
      });
      return;
  }
  //////////////////////////////////////////
  async enregistrer() {
    console.log('4. enregistre...');
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
  ///////////////////////////////////////////////////////////
  auSuivant() {
    console.log('6. au suivant');
    this.crud.changerTour(this.num, this.taColor);
    this.duo = [];
    return;
  }
  ///////////////////////////////////////////////////////////////

  ngOnDestroy(): void {
    console.log('game destroy -->  unsubscribe() x3');
    this.parSub?.unsubscribe();
    this.casesSub?.unsubscribe();
    this.partieSub?.unsubscribe();
  }
}

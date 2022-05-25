import { VerifMouvService } from './verif-mouv.service';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class MatService {

  constructor(
    private verifMouv: VerifMouvService
  ) { }

  ///////////////////////////////////////////////
  mat?: boolean;
  cases$: any;
  tabCazPoss: any; tabCazPoss2: any; tabCazPoss3: any;
  tabAttak: any; mesSoldats: any; trajetAttak: any;
  maColor!: string;
  maxLettre!: number; minLettre!: number; minChiffre!: number; maxChiffre!: number;
  roiActuel: any; indexRoiActuel: any;


  async verifMat() {
    this.getTabCazPoss().then(
      () => {
        this.mouvCazPoss().then(() => {
          return this.mat;
        });
      }
    );
  };

  //etape 1 :////////////////////////////////////////////////////////////////////////////
  async getTabCazPoss() {
    this.roiActuel = this.cases$.slice().filter((e: any) => e.perso === 'r' && e.color === this.maColor)[0];
    let lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    this.indexRoiActuel = lettres.findIndex(e => e === this.roiActuel.lettre);
    this.tabCazPoss = [];

    switch (this.indexRoiActuel) {
      case 0: this.minLettre = 0; this.maxLettre = 1; break;
      case 7: this.minLettre = 6; this.maxLettre = 7; break;
      default: this.minLettre = this.indexRoiActuel - 1; this.maxLettre = this.indexRoiActuel + 1;
    }
    //-------------
    switch (this.roiActuel.chiffre) {
      case 1: this.minChiffre = 1; this.maxChiffre = 2; break;
      case 8: this.minChiffre = 7; this.maxChiffre = 8; break;
      default: this.minChiffre = (this.roiActuel.chiffre) - 1; this.maxChiffre = (this.roiActuel.chiffre) + 1;
    }
    //------------------
    for (let i = this.minChiffre; i < (this.maxChiffre + 1); i++) {
      for (let y = this.minLettre; y < (this.maxLettre + 1); y++) {
        let lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        let possibilite = this.cases$.slice().filter((e: any) => e.chiffre === i && e.lettre === lettres[y])[0];
        this.tabCazPoss.push(possibilite);
      }
    }
    return this.tabCazPoss;
  }
  // etape 2 :////////////////////////////////////////////////////////////////////////////
  async getTab2() {
    this.tabCazPoss2 = [];
    this.verifMouv.cases$ = this.cases$;
    this.tabCazPoss.forEach((poss: any) => {
      if (poss.color !== this.maColor) {
        this.tabCazPoss2.push(poss); return;
      }
    });
  }
  //----------------------------
  async mouvCazPoss() {

    this.getTab2().then(() => {
      console.log('2: length tab2 :', this.tabCazPoss2.length);
      if (this.tabCazPoss2.length > 0) {
        console.log('2 : donc oui, minimum 1 echappatoire');

      this.tabCazPoss3 = 0; 

        this.tabCazPoss2.forEach((c: any) => {
          this.verifMouv.verdict = false;
          this.casePossibEchec = false;

          this.echecCase(c).then(() => {

            if (this.casePossibEchec) {
              console.log('on zappe cette case car echec');
              return;

            }
            else {
              console.log('on garde cette case');
              this.tabCazPoss3++;
              return;

            }
          });
          return;
        });
       

      }
      else {
        console.log('2. donc zéro échappatoire : MAT');
        this.mat = true;
        return;
      }
    }).then(() => {
      if (this.tabCazPoss3 > 0) {
        console.log('1 echapp sans echec : PAS MAT');
        this.mat = false;
        return;
      }
      else {
        return this.nbAttak();
      }
    });
    return;
  }

  /////////////////////////////////////////////////////////
  casePossibEchec?: boolean;
  async echecCase(casePossib: any) {
    let indexExemple = this.cases$.findIndex((e: any) => { e.case === casePossib.case });
    let piece = this.maColor === 'b' ? 'rob' : 'ron';
    let essai = this.cases$.slice();
    essai.splice(indexExemple, 1, {
      case: casePossib.case,
      color: this.maColor,
      perso: 'r',
      piece: piece,
      chiffre: casePossib.chiffre,
      lettre: casePossib.lettre
    });
    essai.splice(this.indexRoiActuel, 1, {
      case: this.roiActuel.case,
      chiffre: this.roiActuel.chiffre,
      lettre: this.roiActuel.lettre,
      color: 'vide', perso: 'vide', piece: 'vide'
    });

    this.verifMouv.cases$ = essai;
    let positionsEnnemisDeLaCase = this.cases$.slice().filter((e: any) => e.color !== this.maColor && e.perso !== 'vide');

    this.verifMouv.verdict = false;

    this.casePossibEchec = positionsEnnemisDeLaCase.every((b: any) => {
      this.casePossibEchec = false;
      let pair = [b, {
        case: casePossib.case,
        color: this.maColor,
        perso: 'r',
        piece: piece,
        chiffre: casePossib.chiffre,
        lettre: casePossib.lettre
      }];
       
      this.verifMouv.verifMouvPiece(pair).then(()=>{
        if(this.verifMouv.verdict){
return true;
        }
        else{
          return false;
        }

      });
      
      return;
    });

    return this.casePossibEchec;

  }
  /////////////////////////////////////////////////////////////////

  //etape4 : ////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////
  async nbAttak() {
    console.log('4 : nbAttaquants');
    let monKing = this.cases$.slice().filter((e: any) => e.perso === 'r' && e.color === this.maColor)[0];
    let mesEnnemis = this.cases$.slice().filter((e: any) => e.perso !== 'vide' && e.color !== this.maColor);
    this.tabAttak = [];
    mesEnnemis.forEach((ennemi: any) => {
      this.verifMouv.verdict = false;
      let pair = [ennemi, monKing];
      this.verifMouv.verifMouvPiece(pair).then(() => {
        if (this.verifMouv.verdict) {
          this.tabAttak.push(ennemi);
        }
      });
    }).then(() => {
      console.log('4. tabAttak.length : ', this.tabAttak.lenth);
      if (this.tabAttak.length > 1) {
        console.log('4. donc plusieurs attaquants : MAT');
        return this.mat = true;
      }
      else {
        console.log('4. donc 1 seul attaquant');
        return this.testMangeable();
      }
    });

  }

  // etape 5://////////////////////////////////////////////////
  mangeable?: boolean;
  async testMangeable() {
    console.log('5 : testMangeable()');
    this.mangeable = false;
    this.mesSoldats = this.cases$.slice().filter((e: any) => e.perso !== 'vide' && e.color === this.maColor);
    this.verifMouv.cases$ = this.cases$;
    this.verifMouv.verdict = false;

    this.mesSoldats.forEach((soldat: any) => {
      let pair = [soldat, this.tabAttak[0]];
      this.verifMouv.verifMouvPiece(pair).then(() => {
        if (this.verifMouv.verdict) {
          console.log('5. on peut manger lattaquant : PAS MAT');
          this.mangeable = true;
          this.mat = false;
        }
      });
    });
    if (this.mangeable === false) {
      console.log('5. on ne peut pas manger attaquant');
      return this.testTrajet();
    }
    else {
      console.log('5. PAS MAT');
      return this.mat = false;
    }

  }
  //etape 6 : ////////////////////////////////////////////////
  obstacable?: boolean;
  async testTrajet() {
    console.log('6. testTrajet()');
    this.trajetAttak.forEach((caseTrajet: any) => {
      this.mesSoldats.forEach((soldat: any) => {
        let pair = [soldat, caseTrajet];
        this.verifMouv.verifMouvPiece(pair).then(() => {
          if (this.verifMouv.verdict) {
            console.log('6. on peut mettre un obstacle : pas mat');
            this.obstacable = true;
          }
        });
      });
    });
    if (this.obstacable === true) {
      console.log('6. on peut obstacle : PAS MAT ');
      return this.mat = false;
    }
    else {
      console.log('6. on peut pas obstacle : MAT');
      return this.mat = true;
    }
  }
  ////////////////////////////////////////////////////////////////

}

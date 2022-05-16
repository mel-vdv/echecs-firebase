import { ConstantPool } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerifMouvService {

  constructor() { }

  maColor = 'b';
  lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  verdict!: any;
  ///////////////////////////////////////////////////////
  async verifMouvPiece(duo: any) {
    switch (duo[0].perso) {
      case 'p': this.pionBouge(duo[0].lettre, duo[0].chiffre, duo[1].lettre, duo[1].chiffre, duo[1].perso);
        break;
      case 'f': this.fouBouge(duo[0].lettre, duo[0].chiffre, duo[1].lettre, duo[1].chiffre);
        break;
      case 't': this.tourBouge(duo[0].lettre, duo[0].chiffre, duo[1].lettre, duo[1].chiffre);
        break;
      case 'r': this.roiBouge(duo[0].lettre, duo[0].chiffre, duo[1].lettre, duo[1].chiffre);
        break;
      case 'rn': this.reineBouge(duo[0].lettre, duo[0].chiffre, duo[1].lettre, duo[1].chiffre);
        break;
      case 'c': this.chevalBouge(duo[0].lettre, duo[0].chiffre, duo[1].lettre, duo[1].chiffre);
        break;
      default: console.log('ceci est une case vide');
    }
  }
  //--------------------------------------------

  pionBouge(lettreA: string, chiffreA: number, lettreB: string, chiffreB: number, persoB: string) {
    // console.log(this.maColor, lettreA, chiffreA, lettreB, chiffreB, persoB);
    let indexA = this.lettres.findIndex(e => e === lettreA);
    let indexB = this.lettres.findIndex(e => e === lettreB);
    if (persoB === 'vide') { // DEPLACEMENT TOUT DROIT :
      if (this.maColor === 'b') {
        if ((lettreA === lettreB) && ((chiffreB - chiffreA) === 1)) {
          return this.verdict = true;

        }
        else {
          return this.verdict = false;
        }
      }
      else {
        if ((lettreA === lettreB) && ((chiffreA - chiffreB) === 1)) {
          return this.verdict = true;
        }
        else {
          return this.verdict = false;
        }
      }
    }
    else { // MANGER EN DIAGONALE:
      if (indexA - indexB === 1 || indexB - indexA === 1) {
        if (this.maColor === 'b') {
          if (chiffreB - chiffreA === 1) {
            return this.verdict = true;
          }
          else {
            return this.verdict = false;
          }
        }
        else {
          if (chiffreA - chiffreB === 1) {
            return this.verdict = true;
          }
          else {
            return this.verdict = false;
          }
        }
      }
      else {
        return this.verdict = false;
      }
    }
  }
  ///////////////////////////////////////////////////////////

  fouBouge(lettreA: string, chiffreA: number, lettreB: string, chiffreB: number) {
    let indexA = this.lettres.findIndex(e => e === lettreA);
    let indexB = this.lettres.findIndex(e => e === lettreB);
    const conditionFou = ((chiffreA - chiffreB) === (indexA - indexB) || (chiffreB - chiffreA) === (indexA - indexB));
    if (conditionFou) {
      //obstacle? :
      switch (true) {
        case indexA > indexB: this.obstacleDiagonal(indexB, indexA, chiffreB, chiffreA).then(() => { this.verdict = true; }); break;
        case indexB > indexA: this.obstacleDiagonal(indexA, indexB, chiffreA, chiffreB).then(() => { this.verdict = true; }); break;
        default: console.log('merte');
      }
      return;
    }
    else {
      return this.verdict = false;
    }
  }
  ////////////////////////////////////////////////////////////////
  tourBouge(lettreA: string, chiffreA: number, lettreB: string, chiffreB: number) {
    //1/ mouv autorisé?
    if (lettreA === lettreB || chiffreA === chiffreB) {
      //2/ pas de obstacle?
      let lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      let indexA = lettres.findIndex(l => l === lettreA);
      let indexB = lettres.findIndex(t => t === lettreB);
      switch (true) {
        case indexA > indexB: this.obstacleHorizontal(indexB, indexA, chiffreA).then(() => { this.verdict = true; }); break;
        case indexB > indexA: this.obstacleHorizontal(indexA, indexB, chiffreA).then(() => { this.verdict = true; }); break;
        case chiffreA > chiffreB: this.obstacleVertical(chiffreB, chiffreA, lettreA).then(() => { this.verdict = true; }); break;
        case chiffreB > chiffreA: this.obstacleVertical(chiffreA, chiffreB, lettreA).then(() => { this.verdict = true; }); break;
        default: return this.verdict = false;
      }
      return;
    }
    else {
      return this.verdict = false;
    }
  }
  //////////////////////////////////////////////////////////////////
  roiBouge(lettreA: string, chiffreA: number, lettreB: string, chiffreB: number) {
    let indexA = this.lettres.findIndex(e => e === lettreA);
    let indexB = this.lettres.findIndex(e => e === lettreB);
    if (
      (chiffreA === chiffreB || (chiffreA - chiffreB) === 1 || (chiffreB - chiffreA) === 1)
      &&
      (indexA === indexB || (indexA - indexB) === 1 || (indexB - indexA) === 1)
    ) {
      return this.verdict = true;
    }
    else {
      return this.verdict = false;
    }
  }
  //////////////////////////////////////////////////////////////////////
  reineBouge(lettreA: string, chiffreA: number, lettreB: string, chiffreB: number) {
    let indexA = this.lettres.findIndex(e => e === lettreA);
    let indexB = this.lettres.findIndex(e => e === lettreB);
    if (lettreA === lettreB || chiffreA === chiffreB)
    {
      //obstacle horizontal ? :
      let lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      let indexA = lettres.findIndex(l => l === lettreA);
      let indexB = lettres.findIndex(t => t === lettreB);
      switch (true) {
        case indexA > indexB: this.obstacleHorizontal(indexB, indexA, chiffreA).then(() => { this.verdict = true; }); break;
        case indexB > indexA: this.obstacleHorizontal(indexA, indexB, chiffreA).then(() => { this.verdict = true; }); break;
        case chiffreA > chiffreB: this.obstacleVertical(chiffreB, chiffreA, lettreA).then(() => { this.verdict = true; }); break;
        case chiffreB > chiffreA: this.obstacleVertical(chiffreA, chiffreB, lettreA).then(() => { this.verdict = true; }); break;
        default: return this.verdict = false;
      }
      return;
    }
    else if((chiffreA - chiffreB) === (indexA - indexB) || (chiffreB - chiffreA) === (indexA - indexB)){
    // obstacle diagonal? : 
      switch (true) {
        case indexA > indexB: this.obstacleDiagonal(indexB, indexA, chiffreB, chiffreA).then(() => { this.verdict = true; }); break;
        case indexB > indexA: this.obstacleDiagonal(indexA, indexB, chiffreA, chiffreB).then(() => { this.verdict = true; }); break;
        default: console.log('merte');
      }
      return;
    }
    
    else {
      return this.verdict = false;
    }
  }
  /////////////////////////////////////////////////////////////////////////
  chevalBouge(lettreA: string, chiffreA: number, lettreB: string, chiffreB: number) {
    let indexA = this.lettres.findIndex(e => e === lettreA);
    let indexB = this.lettres.findIndex(e => e === lettreB);
    if (
      (Math.abs(indexA - indexB) === 1 && Math.abs(chiffreA - chiffreB) === 2) ||
      (Math.abs(indexA - indexB) === 2 && Math.abs(chiffreA - chiffreB) === 1)

    ) {
      return this.verdict = true;
    }
    else {
      return this.verdict = false;
    }
  }
  /////////////////////////////////////////////////////////////////////////////
  trajet: any;
  async obstacleHorizontal(de: number, vers: number, chiffre: number) {
    this.trajet = [];
    for (let i = de + 1; i < vers; i++) {
      let etape = this.lettres[i] + chiffre + '';
      this.trajet.push(etape);
      console.log('trajet: ', this.trajet);
    }
    return this.trajet;

  }
  async obstacleVertical(de: number, vers: number, lettre: string) {
    this.trajet = [];
    for (let i = de + 1; i < vers; i++) {
      let etape = lettre + i
      this.trajet.push(etape);
      console.log('trajet: ', this.trajet);
    }
    return this.trajet;
  }
  async obstacleDiagonal(indexde: number, indexvers: number, chiffrede: number, chiffrevers: number) {
    this.trajet = []; let lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    for (let i = indexde + 1; i < indexvers; i++) {
      if (chiffrede < chiffrevers) {
        chiffrede++;
        let etape = lettres[i] + (chiffrede) + '';
        this.trajet.push(etape);
      } else {
        chiffrede--;
        let etape = lettres[i] + (chiffrede) + '';
        this.trajet.push(etape);
      }
      console.log('trajet: ', this.trajet);
    }
  }
}



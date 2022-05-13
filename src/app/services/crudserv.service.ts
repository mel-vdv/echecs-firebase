import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class CrudservService {

  constructor(
 private afs : AngularFirestore
  ) { }

////////////////
getIdg(idg:any){
return this.afs.doc(`membres/mb${idg}`).valueChanges() as Observable<any>;
}
////////////////
inscrire(user:any){
return this.afs.collection('membres').doc(`mb${user.idg}`).set({
 'idg': user.idg,
 'pseudo': user.pseudo,
 'co':true,
 'amis':[]
});
}
//////////////////
getAllMembres(){
  return this.afs.collection('membres').valueChanges() as Observable<any> ;
}
//////////////////
ajouter(monpseudo:string, monidauth:string,pseudo:string,idauth:string){
  this.afs.collection(`mb-${monpseudo}`).doc(pseudo).set({
 'pseudo':pseudo, 'idg':idauth, 'lien':'aucun'
  });
  this.afs.collection(`mb-${pseudo}`).doc(monpseudo).set({
 'pseudo': monpseudo, 'idg':monidauth, 'lien':'aucun'
    });
    return;
}
///////////////////////////
getAllAmis(monpseudo:string){
  return this.afs.collection(`mb-${monpseudo}`).valueChanges({idField:'pseudo'}) as Observable<any>;
}
//--------
  //---------
  majMaCollek(monpseudo:string,ami:string, objet:any){
    return this.afs.doc(`mb-${monpseudo}/${ami}`).update(objet); 
  }
  //---------
  majCollekAmi(monpseudo:string,ami:string, objet:any){
    return this.afs.doc(`mb-${ami}/${monpseudo}`).update(objet); 
  }
  //-----------------
  creerNewPartie(x:any){
   return this.afs.collection('parties').doc(`p-${x.num}`).set({
      'num':x.num,
      'noir':x.noir,'blanc':x.blanc,
      'encours':false,
      'tour':'blanc',
      'echec':false, 'a':'','par':'',
      'mortsb':[], 'mortsn':[]
  });


}
//------------------------
miseEnPlaceJeu(num:any){
this.afs.collection(`cases-${num}`).doc('a1').set({'case':'a1','lettre':'a','chiffre':1,'chiffreString':'un',  'piece':'tb1','perso':'t','color':'b','vivant':true});  
this.afs.collection(`cases-${num}`).doc('b1').set({'case':'b1','lettre':'b','chiffre':1,'chiffreString':'un',  'piece':'cb1','perso':'c','color':'b','vivant':true});  
this.afs.collection(`cases-${num}`).doc('c1').set({'case':'c1','lettre':'c','chiffre':1,'chiffreString':'un', 'piece':'fb1','perso':'f','color':'b','vivant':true});  
this.afs.collection(`cases-${num}`).doc('d1').set({'case':'d1','lettre':'d','chiffre':1,'chiffreString':'un',  'piece':'rnb','perso':'rn','color':'b','vivant':true});  
this.afs.collection(`cases-${num}`).doc('e1').set({'case':'e1','lettre':'e','chiffre':1,'chiffreString':'un',  'piece':'rb', 'perso':'r','color':'b','vivant':true});  
this.afs.collection(`cases-${num}`).doc('f1').set({'case':'f1','lettre':'f','chiffre':1,'chiffreString':'un',  'piece':'fb2','perso':'f','color':'b','vivant':true});  
this.afs.collection(`cases-${num}`).doc('g1').set({'case':'g1','lettre':'g','chiffre':1,'chiffreString':'un',  'piece':'cb2','perso':'c','color':'b','vivant':true});  
this.afs.collection(`cases-${num}`).doc('h1').set({'case':'h1','lettre':'h','chiffre':1,'chiffreString':'un',  'piece':'tb2','perso':'t','color':'b','vivant':true}); 

this.afs.collection(`cases-${num}`).doc('a2').set({'case':'a2','lettre':'a','chiffre':2,'chiffreString':'deux',  'piece':'pb1','perso':'p','color':'b','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('b2').set({'case':'b2','lettre':'b','chiffre':2,'chiffreString':'deux',  'piece':'pb2','perso':'p','color':'b','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('c2').set({'case':'c2','lettre':'c','chiffre':2,'chiffreString':'deux',  'piece':'pb3','perso':'p','color':'b','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('d2').set({'case':'d2','lettre':'d','chiffre':2,'chiffreString':'deux',  'piece':'pb4','perso':'p','color':'b','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('e2').set({'case':'e2','lettre':'e','chiffre':2,'chiffreString':'deux',  'piece':'pb5','perso':'p','color':'b','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('f2').set({'case':'f2','lettre':'f','chiffre':2,'chiffreString':'deux',  'piece':'pb6','perso':'p','color':'b','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('g2').set({'case':'g2','lettre':'g','chiffre':2,'chiffreString':'deux',  'piece':'pb7','perso':'p','color':'b','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('h2').set({'case':'h2','lettre':'h','chiffre':2,'chiffreString':'deux',  'piece':'pb8','perso':'p','color':'b','vivant':true}); 

this.afs.collection(`cases-${num}`).doc('a3').set({'case':'a3','lettre':'a','chiffre':3,'chiffreString':'trois',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('b3').set({'case':'b3','lettre':'b','chiffre':3,'chiffreString':'trois',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('c3').set({'case':'c3','lettre':'c','chiffre':3,'chiffreString':'trois',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('d3').set({'case':'d3','lettre':'d','chiffre':3,'chiffreString':'trois',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('e3').set({'case':'e3','lettre':'e','chiffre':3,'chiffreString':'trois',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('f3').set({'case':'f3','lettre':'f','chiffre':3,'chiffreString':'trois',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('g3').set({'case':'g3','lettre':'g','chiffre':3,'chiffreString':'trois',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('h3').set({'case':'h3','lettre':'h','chiffre':3,'chiffreString':'trois',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 

this.afs.collection(`cases-${num}`).doc('a4').set({'case':'a4','lettre':'a','chiffre':4,'chiffreString':'quatre',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('b4').set({'case':'b4','lettre':'b','chiffre':4,'chiffreString':'quatre',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('c4').set({'case':'c4','lettre':'c','chiffre':4,'chiffreString':'quatre',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('d4').set({'case':'d4','lettre':'d','chiffre':4,'chiffreString':'quatre',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('e4').set({'case':'e4','lettre':'e','chiffre':4,'chiffreString':'quatre',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('f4').set({'case':'f4','lettre':'f','chiffre':4,'chiffreString':'quatre',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('g4').set({'case':'g4','lettre':'g','chiffre':4,'chiffreString':'quatre',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('h4').set({'case':'h4','lettre':'h','chiffre':4,'chiffreString':'quatre',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 

this.afs.collection(`cases-${num}`).doc('a5').set({'case':'a5','lettre':'a','chiffre':5,'chiffreString':'cinq',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('b5').set({'case':'b5','lettre':'b','chiffre':5,'chiffreString':'cinq',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('c5').set({'case':'c5','lettre':'c','chiffre':5,'chiffreString':'cinq',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('d5').set({'case':'d5','lettre':'d','chiffre':5,'chiffreString':'cinq',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('e5').set({'case':'e5','lettre':'e','chiffre':5,'chiffreString':'cinq',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('f5').set({'case':'f5','lettre':'f','chiffre':5,'chiffreString':'cinq',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('g5').set({'case':'g5','lettre':'g','chiffre':5,'chiffreString':'cinq',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('h5').set({'case':'h5','lettre':'h','chiffre':5,'chiffreString':'cinq',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 

this.afs.collection(`cases-${num}`).doc('a6').set({'case':'a6','lettre':'a','chiffre':6,'chiffreString':'six',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('b6').set({'case':'b6','lettre':'b','chiffre':6,'chiffreString':'six',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('c6').set({'case':'c6','lettre':'c','chiffre':6,'chiffreString':'six',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('d6').set({'case':'d6','lettre':'d','chiffre':6,'chiffreString':'six',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('e6').set({'case':'e6','lettre':'e','chiffre':6,'chiffreString':'six',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('f6').set({'case':'f6','lettre':'f','chiffre':6,'chiffreString':'six',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('g6').set({'case':'g6','lettre':'g','chiffre':6,'chiffreString':'six',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('h6').set({'case':'h6','lettre':'h','chiffre':6,'chiffreString':'six',  'piece':'vide','perso':'vide','color':'vide','vivant':true}); 

this.afs.collection(`cases-${num}`).doc('a7').set({'case':'a7','lettre':'a','chiffre':7,'chiffreString':'sept',  'piece':'pn1','perso':'p','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('a7').set({'case':'b7','lettre':'b','chiffre':7,'chiffreString':'sept',  'piece':'pn2','perso':'p','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('a7').set({'case':'c7','lettre':'c','chiffre':7,'chiffreString':'sept',  'piece':'pn3','perso':'p','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('a7').set({'case':'d7','lettre':'d','chiffre':7,'chiffreString':'sept',  'piece':'pn4','perso':'p','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('a7').set({'case':'e7','lettre':'e','chiffre':7,'chiffreString':'sept',  'piece':'pn5','perso':'p','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('a7').set({'case':'f7','lettre':'f','chiffre':7,'chiffreString':'sept',  'piece':'pn6','perso':'p','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('a7').set({'case':'g7','lettre':'g','chiffre':7,'chiffreString':'sept',  'piece':'pn7','perso':'p','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('a7').set({'case':'h7','lettre':'h','chiffre':7,'chiffreString':'sept',  'piece':'pn8','perso':'p','color':'n','vivant':true}); 

this.afs.collection(`cases-${num}`).doc('a8').set({'case':'a8','lettre':'a','chiffre':8,'chiffreString':'huit',  'piece':'tn1','perso':'t','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('b8').set({'case':'b8','lettre':'b','chiffre':8,'chiffreString':'huit',  'piece':'cn1','perso':'c','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('c8').set({'case':'c8','lettre':'c','chiffre':8,'chiffreString':'huit',  'piece':'fn1','perso':'f','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('d8').set({'case':'d8','lettre':'d','chiffre':8,'chiffreString':'huit',  'piece':'rnn','perso':'rn','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('e8').set({'case':'e8','lettre':'e','chiffre':8,'chiffreString':'huit',  'piece':'rn','perso':'r','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('f8').set({'case':'f8','lettre':'f','chiffre':8,'chiffreString':'huit',  'piece':'fn2','perso':'f','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('g8').set({'case':'g8','lettre':'g','chiffre':8,'chiffreString':'huit',  'piece':'cn2','perso':'c','color':'n','vivant':true}); 
this.afs.collection(`cases-${num}`).doc('h8').set({'case':'h8','lettre':'h','chiffre':8,'chiffreString':'huit',  'piece':'tn2','perso':'t','color':'n','vivant':true}); 




}}
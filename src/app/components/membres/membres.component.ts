import { CrudservService } from './../../services/crudserv.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-membres',
  templateUrl: './membres.component.html',
  styleUrls: ['./membres.component.scss']
})
export class MembresComponent implements OnInit {
monidg?:any;
monpseudo= '';
amis$?: any[];
mb$ ? : any[];
////////////////////////////////////
  constructor(
    private router: Router,
    private ar: ActivatedRoute,
    private crud: CrudservService


  ) { }
/////////////////////////////////
  ngOnInit(): void {
    this.ar.paramMap.subscribe((params:any)=>{
      this.monidg= params.get('idg');
      this.crud.getIdg(this.monidg).subscribe((data:any)=>{
        this.monpseudo= data.pseudo;
        this.crud.getAllAmis(this.monpseudo).subscribe((data:any)=>{
          this.amis$ = data;
        })
       
      });
      this.crud.getAllMembres().subscribe((data:any)=>{
        this.mb$= data;
        this.mb$= this.mb$?.filter(e=>e!== this.monpseudo);
      });
     

    });

  }

  ////////////////////////////
  copiercoller() {
    navigator.clipboard.writeText("Salut, je t'invite à me défier au jeu d'échecs, rejoins-moi sur https://setheme-69d4d.firebaseapp.com/");

  }
  ///////////////////////////
  ajouter(pseudo: string, idg: string) {
      this.crud.ajouter(this.monpseudo, this.monidg!, pseudo, idg);
      this.mb$ = this.mb$?.filter(e => e.pseudo !== pseudo);
  }
  /////////////////////// 
reprendre(num:any){
this.router.navigate([`/game/${num}/${this.monpseudo}`]);
}

  /////////////////////// 
inviter(ami: string) {
    this.crud.majMaCollek(this.monpseudo!, ami, { lien: 'defie' });
    this.crud.majCollekAmi(this.monpseudo!, ami, { lien: 'defiepar' });
}
  /////////////////////// 
repondre(i: number) {
  this.amis$![i].repondreVis = true;
}
  /////////////////////// 
  accepter(ami:string, index:number){
    let idpartie = Math.floor(Math.random() * 9999999);
    this.crud.majMaCollek(this.monpseudo!, ami, {lien: 'play', num: idpartie });
    this.crud.majCollekAmi(this.monpseudo!, ami, { lien: 'play', num: idpartie });
    this.crud.creerNewPartie({
      'num':idpartie,'n':this.monpseudo, 'b':ami
    }).then(() => {
      console.log('new partie créée');
  });
  this.crud.miseEnPlaceJeu(idpartie);
  this.router.navigate([`/game/${idpartie}/${this.monpseudo}`]);
}
  ///////////////////////
refuser(ami: string, i: number) {
  this.crud.majMaCollek(this.monpseudo!, ami, { lien: 'aucun' });
  this.crud.majCollekAmi(this.monpseudo!, ami, { lien: 'aucun' });
  this.amis$![i].repondreVis = false;
}
  
}

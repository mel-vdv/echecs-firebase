import { Subscription } from 'rxjs';
import { CrudservService } from './../../services/crudserv.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit, OnDestroy {
  pseudo='';
  idg?:any;
  parSub?:Subscription;
////////////////////
  constructor(
    private ar: ActivatedRoute,
    private crud: CrudservService,
    private router: Router
  ) { }
//////////////////////
  ngOnInit(): void {

    this.parSub = this.ar.paramMap.subscribe((params: any) => {
      this.idg = params.get('idg');
      console.log('ngoninit: ', this.idg);
  });
}
/////////////////////
valider(){
  let nouveau= {
    pseudo: this.pseudo,
    idg:this.idg
  }
 this.crud.inscrire(nouveau).then(()=>{
   console.log('inscription: done ->/ membres');
   this.router.navigate([`/membres/${this.idg}`]);
 })
}
//////////////////
ngOnDestroy(): void {
  this.parSub?.unsubscribe();
  console.log('inscr: destroy');
}
}

import { CrudservService } from './crudserv.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerifEchecService {

  constructor(
    private crud: CrudservService
  ) { }
verif(monroi:any, ennemis:any){

  ennemis.f.forEach( (fou:any)=>{
    
  })

}
}

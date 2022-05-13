import { CrudservService } from './../../services/crudserv.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
//on ajoute :
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';
import firebase from 'firebase/compat/app'; //ne marche pas si j'oublie le 'app' !!!!
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(
    private auth: AngularFireAuth,
    private crud: CrudservService,
    private router: Router
  ) { }
  user?: User;// (interface fournie par firebase)
  userSub?: Subscription;
  //--------------------------------------------------
  ngOnInit(): void {
    console.log('ngoninit: vericonnect()');
    this.verifConnect();
  }
  //----------------------------------------------
  //etape 1 : connecté?
  verifConnect(){
    this.userSub = this.auth.authState
    .subscribe((user: any) => {
      this.user = user;
      if (this.user) {
        console.log('user déjà connecté');
        //etape 2 : déjà inscrit?
        this.crud.getIdg(this.user.uid).subscribe((data:any)=>{
          if(!data || data===undefined){
            console.log('pas inscrit--> /inscription/:idg');
            this.router.navigate([`/inscription/${this.user!.uid}`]);
          }
          else{
            console.log('deja inscrit --> /membres/:idg');
            this.router.navigate([`/membres/${this.user!.uid}`]);
          }
        });

      }
      else {
        console.log('pas de user : pas connecté');
        this.coGoogle();
      }
    });
  }
  //------------------------------------------------
 async  coGoogle(){
  return this.auth
  .signInWithPopup(new firebase.auth.GoogleAuthProvider())
  .then((result) => {
    console.log('coGoogle()done :', result);
  })
  .catch((error) => {
    console.error(error.message);
  });

  }
 async  decoGoogle(){
  return this.auth.signOut().then(()=>{
    console.log('deco done');
  })
  }
//-----------------------------
ngOnDestroy(): void {
  console.log('ngondestroy loginComp');
  this.userSub?.unsubscribe();
}
}

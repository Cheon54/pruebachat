import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: Observable<firebase.User>;
  authenticated: boolean = false;
  userId: string;

  constructor(public afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              private router: Router){ 
    this.afAuth.authState.subscribe(
      (auth) =>{
        if(auth != null){
          this.user = afAuth.authState;
          this.authenticated = true;
          this.userId = auth.uid;
          this.router.navigate(['/member']);
        }
      }
    );
  }


  loginFb(){
    this.afAuth.auth.signInWithPopup( new firebase.auth.FacebookAuthProvider())
    .then((result)=>{
      this.authenticated = true;
      console.log('Signed in successfully!');

      this.router.navigate(['/member']);
    }).catch((error)=>{
      this.authenticated = false;
      console.log('Error signing in: ',error);
    })
  }

  ngOnInit() {
  }

}

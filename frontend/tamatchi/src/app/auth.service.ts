import { AfterContentChecked, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;

  constructor(public af: AngularFireAuth, public cookie: CookieService) {
    this.user = af.authState;
  }

  newUser(username, password) //create new user
  {
    this.af.createUserWithEmailAndPassword(username, password).then(res =>
      {
        //Do post account creation things here.
        this.login(username, password); //then log the user in.
      }).catch(err => {alert(err)});
  }

  login(username, password) //login
  {
    this.af.signInWithEmailAndPassword(username, password).then(res =>
      {
        alert("Logged in.");

        //set their cookies
        this.cookie.set('email', username);
        
        //And their token
        this.af.currentUser.then(user => {
          user.getIdToken(true).then(token =>
            {
              this.cookie.set('token', token);
            });
        });

      }).catch(err => {
        alert("Account credentials failed to validate.");
      });
  }

  logOut() //logout
  {
    this.af.signOut();
    this.cookie.deleteAll();
  }


}
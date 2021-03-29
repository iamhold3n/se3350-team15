import { AfterContentChecked, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;

  constructor(public af: AngularFireAuth, public cookie: CookieService, public api: APIService) {
    this.user = af.authState;
  }

  /*newUser(username, password) //create new user
  {
    this.af.createUserWithEmailAndPassword(username, password).then(res =>
      {
        //Do post account creation things here.
      }).catch(err => {alert(err)});
  }*/

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
  }//end of logOut

  getLoggedIn()
  {
    if (firebase.auth().currentUser)
    {
      return true;
    }
    else
    {
      this.logOut(); //just incase the cookie remains
      return false;
    }
  }//end of getLoggedIn

  getClaims()
  {
    return new Promise((resolve, reject) =>
    {
      this.api.getClaims().subscribe((claims) =>
    {
      if (claims["disabled"] == true)
      {
        resolve({disabled: true}); //return an otherwise empty object if disabled so that no further disabled checking needs to be done
      }
      else
      {
        resolve(claims);
      }
    })
    })
    
  }
  getUserObject()
  {
    return new Promise((resolve, reject) =>
    {
      this.af.currentUser.then(user =>
        {
          resolve(user);
        }).catch((e) =>
        {
          reject(e);
        });
    });
  }
}

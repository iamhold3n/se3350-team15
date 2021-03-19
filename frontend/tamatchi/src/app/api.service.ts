import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import firebase from 'firebase/app';
import 'firebase/auth';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  url = ``;
  constructor(private http: HttpClient, public cookie: CookieService) { }

  registerNewUser(username)
  {
    return this.http.put(`${this.url}/api/users`, {"email": username}, {headers : {'authorization' : this.cookie.get("token")}});
  }

  getClaims()
  {
    return this.http.get(`${this.url}/api/users`, {headers : {'authorization' : this.cookie.get("token")}}); 
  }

  setClaims(uID, claims)
  {
    return this.http.post(`${this.url}/api/users`, {"userID": uID, "perms": claims}, {headers : {'authorization' : this.cookie.get("token")}});
  }

  getUsers()
  {
    return this.http.get(`${this.url}/api/users/list`, {headers : {'authorization' : this.cookie.get("token")}});
  }

}

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase/app';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  url = `http://localhost:3000`;
  constructor(private http: HttpClient) { }

  registerNewUser(username)
  {
    return this.http.put(`${this.url}/api/users`, {"email": username});
  }

  getClaims()
  {
    return this.http.get(`${this.url}/api/users`); 
  }

  setClaims(uID, claims)
  {
    return this.http.post(`${this.url}/api/users`, {"userID": uID, "perms": claims});
  }

  getUsers()
  {
    return this.http.get(`${this.url}/api/users/list`);
  }
}

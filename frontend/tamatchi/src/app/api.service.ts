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

  registerNewUser(username, password)
  {
    return this.http.put(`${this.url}/api/users`, {"email": username, "password": password});
  }
}

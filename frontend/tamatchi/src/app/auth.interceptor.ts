import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import firebase from 'firebase/app';
import 'firebase/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth : AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.method == "OPTIONS")
    {
      return next.handle(request); //allow options through without authentication
    }
    else if (this.auth.getLoggedIn())
    {
      firebase.auth().currentUser.getIdToken(true).then(
        (result) =>
        {
          const modifiedRequest = request.clone({headers: request.headers.set('authorization', result)}); //if the user is logged in, add auth data to their requests.
          return next.handle(modifiedRequest);
        }
      )
    }
    else
    {
      return next.handle(request);
    }

  }
}

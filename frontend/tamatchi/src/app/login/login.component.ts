import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth : AuthService) { }

  /*register(username, pass) //for debugging purpose only
  {
    this.auth.newUser(username, pass);
  }*/

  login(username, pass)
  {
    this.auth.login(username, pass);
  }

  ngOnInit(): void {
  }

}

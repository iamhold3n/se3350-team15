import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private auth : AuthService) { }

  ngOnInit(): void {
  }

  register(username, pass) //register a new user
  {
    
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import firebase from 'firebase/app';
import 'firebase/auth';
import { APIService } from '../api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  userList : Array<object>;
  constructor(private auth : AuthService, private api : APIService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  register(username) //register a new user
  {
    var fAuth = firebase.auth();
    this.api.registerNewUser(username).subscribe( 
      (response) => {
        if(response == true)
        {
          alert("New user created, password reset email sent"); 
          fAuth.sendPasswordResetEmail(username); //immediately send the user a pass reset email
          this.getUsers(); //update user list
        }
        else
        {
          alert("Failed to create user."); //at some point, more details should be added to the failure message.
          console.log(response);
        }
      },
      (error) => {alert("An error has occured"); console.log(error);}
    )
  }

  sendPasswordResetEmail(email) //send a password reset email
  {
    console.log(email);
    var fAuth = firebase.auth();
    fAuth.sendPasswordResetEmail(email);
  }

  setClaims(uid, admin, professor, chair)
  {
    console.log("Setting claims on " + uid + admin + professor + chair);
    this.api.setClaims(uid, {"admin": admin, "professor": professor, "chair": chair}).subscribe();
  }

  getUsers()
  {
    this.api.getUsers().subscribe(
      (response) =>
      {
        this.userList = response as unknown as Array<object>;
      }
    )
  }

  getStatus(user, claim, checkbox)
  {
    var data = user['claims'][claim];
    if (data == undefined)
    {
      data = false;
    }
    if(claim == 'disabled')
    {
      data = user['disabled'];
    }
    checkbox.checked = data; //checkbox doesn't properly update if you don't force it to update sometimes
    return data;

  }
}
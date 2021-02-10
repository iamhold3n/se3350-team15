import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tamatchi';
  constructor(private auth : AuthService) {}

  register(username, pass) //for debugging purpose only
  {
    this.auth.newUser(username, pass);
  }

  login(username, pass)
  {
    this.auth.login(username, pass);
  }

  logout()
  {
    this.auth.logOut();
  }
}

import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public auth: AuthService, private data: DataService) {}

  ngOnInit(): void {
    this.auth.getNavObservables();
  }//end of ngOnInit

  markActive(a) {
    this.auth.getNavObservables();
    let nav;

    if (this.auth.admin||this.auth.chair) nav = ['nav-login','nav-info','nav-allocate','nav-assign','nav-export','nav-upload','nav-admin'];
    else if (this.auth.instructor) nav = ['nav-login','nav-questions','nav-ranking','nav-review'];
    else nav = ['nav-login'];
    
    for (let i = 0; i < nav.length; i++) {
      let e = document.getElementById(nav[i]);

      if (a === i) e.className = 'active';
      else e.className = '';

      if (i === 0) e.className += ' left';
    }
  }//end of markActive

  logout() {
    this.auth.logOut();
    alert('Logged out of ' + this.auth.account_email);
  }

}//end of exports

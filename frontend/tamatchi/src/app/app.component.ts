import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  admin: boolean
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.isAdmin();
  }

  markActive(a) {
    let nav = ['nav-login','nav-course','nav-form','nav-allocate','nav-assign','nav-ranking', 'nav-admin'];
    this.isAdmin();
    for (let i = 0; i < nav.length; i++) {
      let e = document.getElementById(nav[i]);

      if (a === i) e.className = 'active';
      else e.className = '';

      if (i === 0) e.className += ' left';
    }
  }

  isAdmin()
  {
    
      this.auth.getClaims().then((claims) =>
      {
      //for debugging

        if (claims["admin"] == true)
        {
          this.admin = true;
        }
        else
        {
          this.admin = false;
        } 
      });
  }
}

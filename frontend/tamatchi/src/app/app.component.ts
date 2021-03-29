import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  account_email:string

  admin: boolean

  chair: boolean

  instructor: boolean
  unranked_count: number

  constructor(private auth: AuthService, private data: DataService) {}

  ngOnInit(): void {
    this.unranked_count=null;
    this.getPerm();
    this.markActive(0);
  }//end of ngOnInit

  markActive(a) {
    let nav;
    this.getPerm();

    if (this.admin||this.chair) nav = ['nav-login','nav-info','nav-allocate','nav-assign','nav-upload','nav-admin'];
    else if (this.instructor) nav = ['nav-login','nav-questions','nav-ranking'];
    else nav = ['nav-login'];

    let navsz;
    if(this.admin) navsz = nav.length;
    else navsz = nav.length - 1;
    
    for (let i = 0; i < navsz; i++) {
      let e = document.getElementById(nav[i]);

      if (a === i) e.className = 'active';
      else e.className = '';

      if (i === 0) e.className += ' left';
    }
  }//end of markActive

  //customize the page to match the user's permissions
  getPerm()
  {
      //retrieving user claims
      this.auth.getClaims().then((claims) =>
      {

        //processing user claims
        if(claims !== null){

          //retrieving user object
          this.auth.getUserObject().then((user) =>
          {
            if(user!==null){

              //processing user object
              this.applyPerm(user, claims);

            }

          });
        
        }

      });

  }//end of getPerm

  /**
   * Once the claims nad userObject have all been retrieved
   * Update the webpage to reflect this
   * @param user 
   * @param claims 
   */
  applyPerm(user, claims){

    this.account_email = user["email"];

    this.admin = claims["admin"];

    this.chair = claims["chair"];
          
    //if instructor is logged in
    if(claims["professor"]){

      this.instructor = true;

      //then display notifications for unranked TAs 
      //only do this once upon logging in
      if(this.unranked_count===null){
        this.checkUnrankedNotif(user);
      }
      
    }
    //if proffessor is logged out
    else{
      //reset the notification system for next professor login
      this.unranked_count=null;
    }

  }

  /**
   * if instructor is logged in, then display notifications for unranked TAs (if necessary)
   */
  checkUnrankedNotif(user){

        this.data.getProfessor(user["email"]).subscribe(res => {
  
          for(let a=0; a<res["course"].length; a++){
            this.data.getUnrankedApplicants(res["course"][a]).subscribe(unranked_list => {
              
              this.unranked_count+= unranked_list["unranked_applicants"].length;
            })
          }
  
        });
      

    
  }//end of checkUnranked

}//end of exports

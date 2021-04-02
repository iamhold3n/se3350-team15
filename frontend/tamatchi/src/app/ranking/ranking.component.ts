import { moveItemInArray, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Candidate } from '../candidate';
import { DataService } from '../data.service';
import { TaInfoComponent } from '../ta-info/ta-info.component';

import {AuthService} from '../auth.service';

import { TaInfoComponent } from '../ta-info/ta-info.component';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  @ViewChild(TaInfoComponent) private tainfo: TaInfoComponent;

  //list of all courses that are available to rank (based on who's logged in)
  course_list: string[];
  //empty course. For when no selection has been made
  empty_course: string; 
  //course that is currently being viewed
  viewed_course: string;

  //list of unranked TAs belonging to currently logged professors (based on courseList)
  unranked_tas: Candidate[][];
  //list of ranked TAs belonging to currently logged professors (based on courseList)
  ranked_tas: Candidate[][];
  //list of ranked TAs belonging to the current course view
  ranked_view: Candidate[];
  //list of unranked TAs belonging to the current course view
  unranked_view: Candidate[];

  //detects if logged in
  loggedIn: boolean;

  constructor(private data: DataService, private auth : AuthService) { 
  }

  ngOnInit(): void {

    //initialize empty list of TAs
    this.ranked_tas = [];
    this.unranked_tas = [];

    //initialize the empty course
    this.empty_course="---";
    //initialize the current course to be empty
    //this.viewed_course = this.empty_course;
    //initialize the viewed TAs to match empty course view
    this.ranked_view=[];
    this.unranked_view=[];

    //check user permissions
    //before pulling all their data from the backend
    this.loggedIn = false;
    this.checkPerm();

  }

  /**
   * Checks if user has admin permissions (faculty admin or undergrad chair)
   * and updates this component as necessary to reflect that
   */
  checkPerm()
  {
      
    this.auth.getClaims().then((claims) =>
    {
  
      if(claims["professor"]){
        this.loggedIn = true;
        this.getUser();
      }
 
    });

  }//end of checkPerm

  /**
   * Assumes the logged in user is an instructor
   * Fetches the appropriate credentials
   * So that the webpage can reflect the user
   */
  getUser(){

    this.auth.getUserObject().then((user) =>
    {

      if(user === null){

      }
      else{
        this.data.getProfessor(user["email"]).subscribe(res => {

          //list of courses that will be available for ranking
          //reflects whichever professor is currently logged in
          this.course_list = res["course"];
  
          for(let a=0; a<this.course_list.length; a++){
            //list of ta names to be or already ranked 
            //assume courselist has already been initialized
            this.getRankedApplicants(a);
            this.getUnrankedApplicants(a);
          }

          
  
        });
      }

    });

  }//end of getUser

  /**
   * Fetch Applicant data from back-end
   * Assumes courseList has already been populated
   * Gets both ranked and unranked applicants
   */
  getRankedApplicants(index){

    //get the list of ranked applicants from back-end
    this.data.getRankedApplicants(this.course_list[index]).subscribe(res => {


      //adjsut the data to be compatible with this component
      this.ranked_tas[index] = res["ranked_applicants"];

    });//end of processing ranked applicant list from back-end

  }//end of getRankedApplicants

  /**
   * Fetch Applicant data from back-end
   * Assumes courseList has already been populated
   * Gets both ranked and unranked applicants
   */
  getUnrankedApplicants(index){

    //get the list of ranked applicants from back-end
    this.data.getUnrankedApplicants(this.course_list[index]).subscribe(res => {


      //adjsut the data to be compatible with this component
      this.unranked_tas[index] = res["unranked_applicants"];

    });//end of processing ranked applicant list from back-end

  }//end of getRankedApplicants

  /**
   * Changes which course is currently being viewed in the editor
   * 
   * @param index : The index of the Course object to pull from course_list
   *  -If index is -1, then do the empty course
   */
  courseView(index: number){

    if(index == -1){
      this.viewed_course = this.empty_course;
      this.ranked_view = [];
      this.unranked_view = [];
    }
    else{

      //check if the user is currently logged in
      //to determine if certain buttons and such will be visible
      this.checkPerm();

      //update this component to view the course
      this.viewed_course = this.course_list[index];

      //update the list of tas
      this.ranked_view = this.ranked_tas[index];
      this.unranked_view = this.unranked_tas[index];
    }

  }//end of courseView

  //This method will reorder the appropriate array when items are dragged around
  drop(event: CdkDragDrop<string[]>) {

    //if reordering items in the ranked array
    if(event.container == event.previousContainer){
      moveItemInArray(this.ranked_view, event.previousIndex, event.currentIndex);
    }
    //if moving items from unranked to ranked array
    else{

      transferArrayItem(this.unranked_view, this.ranked_view, event.previousIndex, event.currentIndex);
    }

  }

  //This method will save the ranking changes and send the updated list to the database
  //TODO: Save changes to rankings
  confirmRankings() {

    this.data.updateCourseRanking(this.viewed_course,this.ranked_view).subscribe(res => {
      alert("Changes Saved");
    });

  }

  toggleCourse(index) {
    // toggle which course is selected in course nav
    this.courseView(index);

    for (let i = 0; i < this.course_list.length; i++) {
      let e = document.getElementById(this.course_list[i]);

      if (index === i) e.className = 'subnav active';
      else e.className = 'subnav';
    }
  }

  viewTaDetails(c, ta) {
    this.tainfo.getInfo(c, ta);

    const darkened = document.getElementById('darkened2');
    const popup = document.getElementById('popup2');
    darkened.style.display = 'block';
    popup.style.display = 'block';
  }

}

import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Candidate } from '../candidate';
import { DataService } from '../data.service';

import {AuthService} from '../auth.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  //list of all courses that are available to rank (based on who's logged in)
  course_list: string[];
  //empty course. For when no selection has been made
  empty_course: string; 
  //course that is currently being viewed
  viewed_course: string;

  //list of unranked TAs belonging to currently logged professors (based on courseList)
  unranked_tas: string[][];
  //list of ranked TAs belonging to currently logged professors (based on courseList)
  ranked_tas: string[][];
  //list of ranked TAs belonging to the current course view
  ranked_view: string[];
  //list of unranked TAs belonging to the current course view
  unranked_view: string[];

  constructor(private data: DataService, private auth : AuthService) { 
  }

  ngOnInit(): void {

    //initialize empty list of TAs
    this.ranked_tas = [];
    this.unranked_tas = [];

    //initialize the empty course
    this.empty_course="---";
    //initialize the current course to be empty
    this.viewed_course = this.empty_course;
    //initialize the viewed TAs to match empty course view
    this.ranked_view=[];
    this.unranked_view=[];

    //check user permissions
    //before pulling all their data from the backend
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
        this.data.getInstructor(user["email"]).subscribe(res => {

          //list of courses that will be available for ranking
          //reflects whichever professor is currently logged in
          //TODO: determine which prof is logged in
          this.course_list = res["course"];
  
          for(let a=0; a<this.course_list.length; a++){
            //list of ta names to be ranked 
            //assume courselist has already been initialized
            this.getRankedApplicants(a);
          }

          this.getUnrankedApplicants();
  
        });
      }

    });

  }//end of getUser

  /**
   * Fetch Applicant data from back-end
   * Assumes courseList has already been populated
   * filters Applicants based on courseList
   */
  getRankedApplicants(index){

    //get the list of ranked applicants from back-end
    this.data.getRankedApplicants(this.course_list[index]).subscribe(res => {


      //adjsut the data to be compatible with this component
      this.ranked_tas[index] = res["ranked_applicants"];

      //console.log(this.taList);

    });//end of processing ranked applicant list from back-end

  }//end of getRankedApplicants

  /**
   * Assume the ranked applicants have already been retrieved
   */
  getUnrankedApplicants(){

    let temp;

    //get the list of unranked applicants from back-end
    this.data.getApplicants().subscribe(res => {


      //adjsut the data to be compatible with this component
      temp = res;
      let c = this.course_list;

      //adjsut the data to be compatible with this component
      for(let a=0; a<c.length; a++){
        this.unranked_tas[a] = temp
        .filter(ta => { return ta.course.includes(c[a]) && !this.ranked_tas[a].includes(ta.email) })
        .map( ta => { return ta.email });
      }

      //console.log(this.taList);

    });//end of processing unranked applicant list from back-end
  }

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

  //This method will reorder the array when items are dragged around
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.ranked_view, event.previousIndex, event.currentIndex);
  }

  //This method will save the ranking changes and send the updated list to the database
  //TODO: Save changes to rankings
  confirmRankings() {

    this.data.updateCourseRanking(this.viewed_course,this.ranked_view).subscribe(res => {
      alert("Changes Saved");
    });

  }
}

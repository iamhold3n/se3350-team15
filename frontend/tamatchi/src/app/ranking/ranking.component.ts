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

  //list of TAs belonging to currently logged professors (based on courseList)
  taList: Candidate[];
  //list of TAs belonging to the current course view
  viewed_tas: Candidate[];

  constructor(private data: DataService, private auth : AuthService) { 
  }

  ngOnInit(): void {

    //initialize the empty course
    this.empty_course="---";
    //initialize the current course to be empty
    this.viewed_course = this.empty_course;
    //initialize the viewed TAs to match empty course view
    this.viewed_tas=[];

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

      this.data.getInstructor(user["email"]).subscribe(res => {

        //list of courses that will be available for ranking
        //reflects whichever professor is currently logged in
        //TODO: determine which prof is logged in
        this.course_list = res["course"];

        //list of ta names to be ranked 
        //assume courselist has already been initialized
        this.getApplicants();

      });

    });

  }//end of getUser

  /**
   * Fetch Applicant data from back-end
   * Assumes courseList has already been populated
   * filters Applicants based on courseList
   */
  getApplicants(){

    let temp;

    //get the list of courses from back-end
    this.data.getApplicants().subscribe(res => {

      temp = this.filterApplicants(res, this.course_list);

      //adjsut the data to be compatible with this component
      this.taList = temp.map( ta => {
        return {
          email:ta.email,
          name:ta.name,
          priority:ta.status,
          taHours:ta.hrs,
          course: ta.course,
        }
      });

      //console.log(this.taList);

    });//end of processing course list from back-end

  }//end of getApplicants

  /**
   * Filter applicants from a given list
   * Given a list of course codes to accept
   * return a new list
   * @param tas 
   * @param courses
   */
  filterApplicants(tas,courses){

    let newList = [];

    //loop through all the fetched TAs
    for (let l of tas){

      //check each of the accepted course codes
      for(let c of courses){

        //if it matches even one course code, include it
        if(l.course.includes(c)){
          newList.push(l);
          break; //once a match is found, move on to next TA
        }
      }

    }

    return newList;

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
      this.viewed_tas = [];
    }
    else{

      //check if the user is currently logged in
      //to determine if certain buttons and such will be visible
      this.checkPerm();

      //update this component to view the course
      this.viewed_course = this.course_list[index];

      //update the list of viewed tas
      this.viewed_tas = this.filterApplicants(this.taList,[this.viewed_course]);
    }

  }//end of courseView

  //This method will reorder the array when items are dragged around
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.taList, event.previousIndex, event.currentIndex);
  }

  //This method will save the ranking changes and send the updated list to the database
  //TODO: Save changes to rankings
  confirmRankings() {
    alert("Changes Saved *not really");
  }
}

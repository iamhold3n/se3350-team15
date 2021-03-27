import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { moveItemInArray, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Candidate } from '../candidate';
import {Course} from '../course';
import { DataService } from '../data.service';

import {AuthService} from '../auth.service';
import { templateJitUrl } from '@angular/compiler';

@Component({
  selector: 'app-assign-ta',
  templateUrl: './assign-ta.component.html',
  styleUrls: ['./assign-ta.component.css']
})
export class AssignTaComponent implements OnInit {

  //list of all courses that are available to rank (based on who's logged in)
  course_list: string[];
  //empty course. For when no selection has been made
  empty_course: string; 
  //course that is currently being viewed
  viewed_course: string;


  //list of ranked TAs belonging to currently logged professors (based on courseList)
  all_unassigned: Candidate[][];
  //list of ranked TAs belonging to the current course view
  viewed_unassigned: Candidate[];
  //list of ranked TAs belonging to currently logged professors (based on courseList)
  all_assigned: Candidate[][];
  //list of ranked TAs belonging to the current course view
  viewed_assigned: Candidate[];

  //detects if logged in
  loggedIn: boolean;

  constructor(private data: DataService, private auth : AuthService) { 
  }

  ngOnInit(): void {

    //initialize empty list of TAs
    this.all_unassigned = [];
    this.all_assigned = [];


    //initialize the empty course
    this.empty_course="---";
    //initialize the current course to be empty
    this.viewed_course = this.empty_course;
    //initialize the viewed TAs to match empty course view
    this.viewed_assigned=[];
    this.viewed_unassigned=[];

    this.getUser();

    //check user permissions
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


 
    });

  }//end of checkPerm

  /**
   * Assumes the logged in user is an instructor
   * Fetches the appropriate credentials
   * So that the webpage can reflect the user
   */
  getUser(){

    this.getCourseAllocations();

  }//end of getUser

  getCourseAllocations(){

    let arr;

    this.data.getAllocation().subscribe(res => {

      arr = res;
      
      //initialize and popualte the course array
      this.course_list = arr.map(crs => {return crs.course});

      ////initialize the arrays holding all assigned tas
      //assigned tas will be stored as email strings for now
      //until their full objects can be retrieved from backend
      this.all_assigned = arr.map(crs => {return crs.assignList});  
      
      //initialize the arrays holding all unassigned tas
      this.course_list.forEach( (e,index)=>{

        this.all_unassigned[index] = [];

      });

      this.getApplicants();

    });
  }

  /**
   * Fetch Applicant data from back-end
   * Assumes courseList has already been populated
   * Sort between assigned and unassigned applicants
   */
  getApplicants(){

    let arr;
    let temp;

    //get the list of ranked applicants from back-end
    this.data.getApplicants().subscribe(res => {



      arr = res;

      arr.forEach(ta =>{

        this.course_list.forEach( (crs, index) => {

          //convert the emails of assigned tas for thsi course into their object represnetations
          temp = this.all_assigned[index];

          //filter out any applicants that didnt apply for this course
          if(ta.course.includes(crs) ){

            //determine if the ta has already been assigned to this course
            if(temp.includes(ta.email) ){
              this.all_assigned[index].push(ta);
            }
            else{
              this.all_unassigned[index].push(ta);
            }

          }

        });

      });

      console.log(this.all_assigned);
      console.log(this.all_unassigned);

    });//end of processing applicant list from back-end

  }//end of getApplicants

  /**
   * Changes which course is currently being viewed in the editor
   * 
   * @param index : The index of the Course object to pull from course_list
   *  -If index is -1, then do the empty course
   */
  courseView(index: number){

    if(index == -1){
      this.viewed_course = this.empty_course;
      this.viewed_assigned = [];
      this.viewed_unassigned = [];
    }
    else{

      //check if the user is currently logged in
      //to determine if certain buttons and such will be visible
      this.checkPerm();

      //update this component to view the course
      this.viewed_course = this.course_list[index];

      //update the list of viewed tas
      this.viewed_assigned = this.all_assigned[index] ;
      this.viewed_unassigned = this.all_unassigned[index] ;
    }

  }//end of courseView

  //This method will reorder the appropriate array when items are dragged around
  drop(event: CdkDragDrop<string[]>) {

    //if reordering items in the ranked array
    if(event.container == event.previousContainer){
      //moveItemInArray(this.viewed_tas, event.previousIndex, event.currentIndex);
    }
    //if moving items from unranked to ranked array
    else{

      //transferArrayItem(this.unranked_view, this.viewed_tas, event.previousIndex, event.currentIndex);
    }

  }

  //This method will save the ranking changes and send the updated list to the database
  //TODO: Save changes to rankings
  saveChanges() {

    this.data.updateAllocationTas(this.viewed_assigned).subscribe(res => {
      alert("Changes Saved");
    });

  }
}//end of class

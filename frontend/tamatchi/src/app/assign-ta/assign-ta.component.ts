import { Component, OnInit } from '@angular/core';
import { Candidate } from '../candidate';

@Component({
  selector: 'app-assign-ta',
  templateUrl: './assign-ta.component.html',
  styleUrls: ['./assign-ta.component.css']
})
export class AssignTaComponent implements OnInit {

  //list of course codes for all courses that are being assigned TAs
  course_list: string[];

  //course that is currently being viewed
  current_course: string;

  //list of TA candidates
  candidate_list: Candidate[];

  //list of TAs assigned to the current course
  assign_list: Candidate[];

  constructor() { }

  ngOnInit(): void {

    //initialize and populate course_list array
    this.generateCourses();

    //initialize and populate candidate_list array
    this.generateCandidates();

    //initialize assigned_list array
    this.assign_list=[];

  }//end of ngOnInit

  //Generate placeholder course data
  generateCourses(){
    this.course_list=["SE3310","SE3350","CALC1000"];
  }//end of loadCourses

  //Generate placeholder candidate data
  generateCandidates(){

    //initialize the candidate_list array
    this.candidate_list = [];

    let num_candidates = 3;
    let temp;
    let num_courses = this.course_list.length;
    let temp_course_list;

    for(let a=0; a<num_candidates; a++){

      //choose random # of courses from course_list (at least one course)
      //choose that number of courses from start of course_list
      temp_course_list=[];
      for(let b=0; b<Math.floor(Math.random()*num_courses) +1; b++){
        temp_course_list.push(this.course_list[b]); //push the course code into the array
      }

      //create a "Candidate" object with randomized values
      temp = {
        id: a+"", //placeholder id
        name: "Student "+(a+1), //placeholder name
        priority: Math.floor(Math.random()*3) +1 , //random priority between 1 and 3
        ranked_courses: temp_course_list //the array that was generated above
      };

      //add the new object to the list of "Candidate" objects
      this.candidate_list.push(temp);

    }//end of candidate generation loop

  }//end of generateCandidates

  assignTa(newTa: Candidate ){

    //check if TA is already assigned
    if(!this.assign_list.includes(newTa)){
      //if not then push it
      this.assign_list.push(newTa);
    }

  }

  removeTa(index: number){

    //take all elements before and after the target index
    let temp_1 = this.assign_list.slice(0,index);
    let temp_2 = this.assign_list.slice(index+1);

    //concatentate them together
    this.assign_list= temp_1.concat(temp_2);

  }

}//end of class

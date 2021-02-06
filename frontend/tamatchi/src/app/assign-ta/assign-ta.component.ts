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

  //list of TA candidates
  candidate_list: Candidate[];

  constructor() { }

  ngOnInit(): void {

    this.generateCourses();
    this.generateCandidates();

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

}//end of class

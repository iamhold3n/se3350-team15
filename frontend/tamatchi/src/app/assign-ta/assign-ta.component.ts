import { Component, OnInit } from '@angular/core';
import { Candidate } from '../candidate';
import {Course} from '../course';

@Component({
  selector: 'app-assign-ta',
  templateUrl: './assign-ta.component.html',
  styleUrls: ['./assign-ta.component.css']
})
export class AssignTaComponent implements OnInit {

  //list of  all courses that are being assigned TAs
  course_list: Course[];
  //empty course. For when no selection has been made
  empty_course: Course; 

  //course that is currently being viewed
  viewed_course: Course;

  //list of TA candidates
  candidate_list: Candidate[];


  constructor() { }

  ngOnInit(): void {

    //initialize the empty course
    this.empty_course={courseCode:"---", taHours:0, assignList:[]};
    //initialize the current course to be empty
    this.viewed_course = this.empty_course;

    //initialize and populate course_list array
    this.generateCourses();

    //initialize and populate candidate_list array
    this.generateCandidates();

  }//end of ngOnInit

  /**
   * Generate placeholder course data
   * each object contians:
   *  -course code
   *  -number of ta hours
   */
  generateCourses(){
    this.course_list=[
      {courseCode:"3314", taHours:30, assignList:[]},
      {courseCode:"3310", taHours:50, assignList:[]},
      {courseCode:"2202", taHours:75, assignList:[]},
    ];
  }//end of loadCourses

  //Generate placeholder candidate data
  generateCandidates(){

    //initialize the candidate_list array
    this.candidate_list = [];

    let num_candidates = 10;
    let temp; //temp storage for randomly generated Candidate objects
    let num_courses = this.course_list.length;
    let temp1; //temp storage for a  ranom sized array of random course codes
    let temp2; //temps storage for Courses that havent been randomly chosen yet
    let crs_code; //temp storage for a course code

    for(let a=0; a<num_candidates; a++){

      //choose random # of courses from course_list (at least one course)
      //choose that number of selected courses from start of course_list
      temp1=[];
      temp2 = this.course_list;

      //loop a random numer of times (between 1 and the number of courses)
      for(let b=0; b<Math.floor(Math.random()*num_courses) +1; b++){

        //get course code of a random Course
        crs_code = temp2[Math.floor(Math.random()*temp2.length)].courseCode; 
        //push the course code into the array
        temp1.push(crs_code); 
        //decrease the pool of course codes to randomly choose from
        temp2 = temp2.filter( e =>{return e.courseCode != crs_code} );
      }


      //create a "Candidate" object with randomized values
      temp = {
        id: a, //placeholder id
        name: "Student "+(a+1), //placeholder name
        priority: Math.floor(Math.random()*3) +1 , //random priority between 1 and 3
        taHours: (Math.floor(Math.random()*2) +1) * 5, //randomly pick between 5 or 10
        ranked_courses: temp1 //the array of randomized selected courses that was generated above
      };

      //add the new object to the list of "Candidate" objects
      this.candidate_list.push(temp);

    }//end of candidate generation loop

  }//end of generateCandidates

  /**
   * Changes which course is currently being viewed in the editor
   * 
   * @param index : The index of the Course object to pull from course_list
   *  -If index is -1, then do the empty course
   */
  courseView(index: number){

    if(index == -1){
      this.viewed_course = this.empty_course;
    }
    else{
      this.viewed_course = this.course_list[index];
    }

  }

  /**
   * Adds a TA to a course 
   * Targets the currently viewed course by default (pass a Course object as a parameter if otherwise)
   * Checks if all ta hours for this course have been allocated
   * 
   * @param newTa : object representing the TA to be added
   * @param course : course to add to. default value is 'viewed_course'
   */
  assignTa(newTa: Candidate, course = this.viewed_course){

    //Callback fucntion to help calcualte remaining TA hours in this course
    function sumHours(total, hours){
      return total+hours;
    }

    //Callback fucntion to help calcualte remaining TA hours in this course
    function mapHours(TA){
      return TA.taHours;
    }

    //calcualte remaining TA hours in this course
    var remainingHours = course.taHours;
    if(course.assignList.length > 0){
      remainingHours -= course.assignList.map(mapHours).reduce(sumHours);
    }

    /**
     * Only assign the TA if the following is true
     *  -TA is NOT already assigned to this course
     *  -Sufficient TA hours available
     */
    if(!course.assignList.includes(newTa) && remainingHours >= newTa.taHours ){

      //if not then push it to the assigned list
      course.assignList.push(newTa);

      let index = this.candidate_list.indexOf(newTa);

      //take all elements before and after the target index
      let temp_1 = this.candidate_list.slice(0,index);
      let temp_2 = this.candidate_list.slice(index+1);

      //concatentate them together to remove the TA
      this.candidate_list= temp_1.concat(temp_2);

    }

  }

  /**
   * Removes a TA from the currently viewed course in the editor
   * @param index : index of the TA on the editor to be removed
   */
  removeTa(index: number){

    //add the TA back into the candidate list
    this.candidate_list.push(this.viewed_course.assignList[index])

    //take all elements before and after the target index
    let temp_1 = this.viewed_course.assignList.slice(0,index);
    let temp_2 = this.viewed_course.assignList.slice(index+1);

    //concatentate them together to remove the TA
    this.viewed_course.assignList= temp_1.concat(temp_2);

  }

  /**
   * This is used by the array pipe to filters the *ngFor
   * Builds a callback function and returns it so the pipe can use it for filtering
   * In this case: for filtering out candidates that dont match the course
   */
  isApplicant(course: Course){

    //get the currently viewed course and make it a scope variable
    var crs_code = course.courseCode;

    /** 
     * Returns true if the given Candidate applied for the course
    */
    function isApplicant(candidate: Candidate){
      return candidate.ranked_courses.indexOf(crs_code) != -1; //takes the scope variable 'crs_code'
    }

    //return the newly built function to be used in the callback pipe
    return isApplicant;
  }

  /**
   * Sorts the aaplicants based on pre-defined criteria
   * Takes all the applicnats that applied to the given course
   * returns a new array with them sorted by:
   *    -priority (1,2,or 3)
   *    -applicant's ranked preferences
   */
  sortApplicant(course: Course){

    //filter the candidate list for applkicants that applied to the currently viewed course
    var result = this.candidate_list.filter(this.isApplicant(course));

    var crs_code = course.courseCode;

    /**
     * sort the applicants based on:
     *    -priority (1,2,or 3)
     *    -applicant's ranked preferences
     */
    function sort(a,b){

      let diff = (a.priority + a.ranked_courses.indexOf(crs_code)) - (b.priority + b.ranked_courses.indexOf(crs_code))

      return diff ;
    }

    result = result.sort(sort);

    //return the resultant array
    return result;

  }

  /**
   * un-assigns all TAs that are assigned to the currently viewed course
   */
  clearTa(){

    //get the nubmer of TAs assigned to the currently viewed course
    let num = this.viewed_course.assignList.length;

    //keep removing the TA at the top of the assignList until none are left
    for(let a=0; a<num; a++){
      this.removeTa(0);
    }

  }

  /**
   * Saves changes made to the course that is currently viewed in the editor
   */
   saveChanges(){
    //this.viewed_course.do_something();
  }

  /**
   * Automistiaclly assigns the candidates for a given course
   * For now, the algorithm just assigns by priority (1,2,or 3)
   * The algorithm will not touch any TAs already assigned to the course
   * 
   * @param course : 
   */
  autoAssign(course: Course){

    var applicants = this.sortApplicant(course);

    for(let a of applicants){

      //assign the TA from the sorted list to the course
      this.assignTa(a, course);
    }

  }

}//end of class

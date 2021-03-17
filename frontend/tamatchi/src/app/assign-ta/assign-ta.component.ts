import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Component, OnInit } from '@angular/core';
import { Candidate } from '../candidate';
import {Course} from '../course';
import { DataService } from '../data.service';

import {AuthService} from '../auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-assign-ta',
  templateUrl: './assign-ta.component.html',
  styleUrls: ['./assign-ta.component.css']
})
export class AssignTaComponent implements OnInit {

  //list of  all courses that are being assigned TAs
  course_list;
  //empty course. For when no selection has been made
  empty_course: Course; 

  //course that is currently being viewed
  viewed_course: Course;

  //list of TA candidates
  candidate_list: Candidate[];

  //determine which functions to hide/show
  loggedIn: boolean;

  constructor(private data: DataService, private auth : AuthService) { }

  ngOnInit(): void {

    //initialize the empty course
    this.empty_course={courseCode:"---", taHours:0, assignList:[]};
    //initialize the current course to be empty
    this.viewed_course = this.empty_course;

    //initialize and populate TA candidate data
    //once that's done, populate the course data
    this.getCandidates();

  }//end of ngOnInit

  /**
   * Checks if user is currently logged in
   * and updates this component as necessary to reflect that
   */
  checkLoggedIn(){
    this.loggedIn = this.auth.getLoggedIn();
  }//end of checkLoggedIn

  /**
   * Get relevant course data from back-end
   * In the back-end this relevant data is under "Allocations" not "Courses"
   */
  getCourses(){
    
    let temp;

    //get the list of courses from back-end
    this.data.getAllocation().subscribe(res => {

      temp = res;

      //adjsut the data to be compatible with this component
      this.course_list = temp.map( course => {
        let obj = {
          courseCode: course.course, 
          taHours: course.currHrs, 
          assignList: [], //assignList will be populated later in this fucntion.
        }

        this.loadAssignments(obj, course.assignList); //populate assignList with saved TA assignments

        return obj;
      });

      //console.log(this.course_list);

    });//end of processing course list from back-end

  }//end of getCourses

  getCandidates(){

    let temp;

    //get the list of courses from back-end
    this.data.getApplicants().subscribe(res => {

      temp = res;

      //adjsut the data to be compatible with this component
      this.candidate_list = temp.map( ta => {
        return {
          email:ta.email,
          name:ta.name,
          priority:ta.status,
          taHours:5,
          ranked_courses:this.loadRankings(ta),
        }
      });

      //console.log(this.candidate_list);

      this.getCourses();

    });//end of processing course list from back-end

  }//end of getCandidates

  /**
   * Some extra functions to adjust the back-end data for this component
   * Loads each candidates' saved course rankings
   */
  loadRankings(ta){

    let ranked_list=[];
    let rankings = ta.ranks;
    let courses = ta.course;

    for(let a=0; a<rankings.length; a++){
      ranked_list[rankings[a]-1] = courses[a];
    }

    return ranked_list;

  }//end of loadRankings

  /**
   * Loads all saved assigned TAs for the specified course
   * Assumes that "getCandidates()" has already run to completion
   * 
   * @param 
   */
  loadAssignments(crs: Course, assignList: String[]){

    if(assignList.length > 0){

      //loop through each course code in the assignList
      for(let email of assignList){

        //find and push the candidate object corresponding to each course code
        this.assignTa(
          this.candidate_list.find( e=>{return e.email == email }),
          crs
        );

      }
    }

  }//end of loadAssignments

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

      //check if the user is currently logged in
      //to determine if certain buttons and such will be visible
      this.checkLoggedIn();

      //update this component to view the course
      this.viewed_course = this.course_list[index];
    }

  }//end of courseView

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

  }//end of assignTa

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

  }//end of removeTa

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
  }//end of isApplicant

  /**
   * Takes all the applicnats that applied to the given course
   * returns a new array with them sorted by:
   *    -priority (1,2,or 3)
   *    -applicant's ranked preferences
   */
  sortApplicantPriority(course: Course){

    //filter the candidate list for applkicants that applied to the currently viewed course
    var result = this.candidate_list.filter(this.isApplicant(course));

    var crs_code = course.courseCode;

    /**
     * sort the applicants based on:
     *    -priority (1,2,or 3)
     *    -applicant's ranked preferences
     */
    function sort(a,b){

      let diff = (a.priority*3 + a.ranked_courses.indexOf(crs_code)) - (b.priority*3 + b.ranked_courses.indexOf(crs_code))

      return diff ;
    }

    result = result.sort(sort);

    //return the resultant array
    return result;

  } //end of sortApplicantPriority

  /**
   * Sorts the candidate list based on a criteria
   * @param criteria:
   *      - "priority" to sort by priority then applicant's ranked preferences
   */
  sortCandidateList(criteria){

    switch (criteria) {
      case "priority":
        this.candidate_list = this.sortApplicantPriority(this.viewed_course);
        break;
    
      default:
        break;
    }//end of switch

  } //end of sortCandidateList

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

  }//end of clearTa

  /**
   * Automistiaclly assigns the candidates for a given course
   * For now, the algorithm just assigns by priority (1,2,or 3)
   * The algorithm will not touch any TAs already assigned to the course
   * 
   * @param course : 
   */
  autoAssign(course: Course){

    var applicants = this.sortApplicantPriority(course);

    for(let a of applicants){

      //assign the TA from the sorted list to the course
      this.assignTa(a, course);
    }

  }//end of autoAssign

  /**
   * Runs the auto-assign algorithm for all courses
   * NOTES:
   *  -JUst like the auto-assign for inidividual courses. It will not touch TAs that have already been assigned
   */
  autoAssignAll(){
    for(let course of this.course_list){
      this.autoAssign(course);
    }
  }//end of autoAssignAll

  /**
   * Saves changes made to all courses
   */
   saveChanges(){

    let list=[];

    for(let course of this.course_list){
      list.push( {
        "course": course.courseCode, 
        "assignList":course.assignList.map( e =>{return e.email} ), //dont return the objects representing the TAs, just return the email-strings for each TA
      } );
    }

    this.data.updateAllocationTas(list).subscribe(res => {
      alert('Allocated TAs successfully updated for all courses.');
    });
  }//end of saveChanges

}//end of class

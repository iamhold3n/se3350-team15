import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { moveItemInArray, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Candidate } from '../candidate';
import {Course} from '../course';
import { DataService } from '../data.service';

import {AuthService} from '../auth.service';
import { templateJitUrl } from '@angular/compiler';
import { taggedTemplate } from '@angular/compiler/src/output/output_ast';

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
  //array of TA hours allocated to each course
  hrs_list: number[];


  //list of ranked TAs belonging to currently logged professors (based on courseList)
  all_unassigned: Candidate[][];
  //list of ranked TAs belonging to the current course view
  viewed_unassigned: Candidate[];
  //list of ranked TAs belonging to currently logged professors (based on courseList)
  all_assigned: Candidate[][];
  //list of ranked TAs belonging to the current course view
  viewed_assigned: Candidate[];

  //flags to indicate if TA in the editor should display detailed view
  expanded_ta: boolean[][][];

  //stores the emails of the assigned TAs as received from back-end
  //until they can be converted into proper objects
  all_assigned_temp: string[][];

  //array of flags to indicate loading applicants from back-end
  finish_loading: boolean[];

  //detects if logged in
  loggedIn: boolean;

  //admin or chair user will have "admin" level permissions on this page
  admin: boolean;
  //professor user will have "professor" level permissions on this page
  professor: boolean;

  prof_rank_first: boolean;

  constructor(private data: DataService, private auth : AuthService) { 
  }

  ngOnInit(): void {

    //initialize empty list of TAs
    this.all_unassigned = [];
    this.all_assigned = [];

    //one array for assigned
    //one array for unassigned
    this.expanded_ta = [[],[]];

    //initialize the empty course
    this.empty_course="---";
    //initialize the current course to be empty
    this.viewed_course = this.empty_course;
    //initialize the viewed TAs to match empty course view
    this.viewed_assigned=[];
    this.viewed_unassigned=[];

    this.prof_rank_first = true;

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

      //make sure the user authentication returned valid
      //if it did, then set perms
      if(claims != null){

        this.loggedIn=true;

        this.admin = claims["admin"] || claims["chair"];

        //if user is professor, get the professor's course list before retrieving TA data
        if(claims["professor"]){
          this.professor = true;
          //console.log(this.professor);
          this.getProfessor();
        }
        //otherwise, just get TA data for all courses
        else{
          this.getCourseAllocations();
        }

      }

 
    });

  }//end of checkPerm

  /**
   * If logged in user is an professor
   * Fetches the appropriate credentials
   * So that the webpage can reflect the user
   * Before fetching the TA allocation data 
   */
  getProfessor(){

    //fetch UserObject of logged in professor
    this.auth.getUserObject().then((user) =>
    {

      if(user === null){

      }
      else{
        //fetch the database object corresponding to the logged in professor
        this.data.getProfessor(user["email"]).subscribe(res => {

          //list of courses that will be available for ranking
          //reflects whichever professor is currently logged in
          this.course_list = res["course"];
  
          this.getCourseAllocations();

        });
      }

    });


  }//end of getUser

  getCourseAllocations(){

    let arr;

    this.data.getAllocation().subscribe(res => {

      arr = res;
      
      if(!this.professor){

        //initialize and popualte the course array
        this.course_list = arr.map(crs => {return crs.course});
        //and the TA hrs array
        this.hrs_list = arr.map(crs => {return crs.currHrs});
        this.finish_loading = arr.map(crs => {return false});
      }

      ////initialize the arrays holding all assigned tas
      //assigned tas will be stored as email strings for now
      //until their full objects can be retrieved from backend
      this.all_assigned_temp = arr.map(crs => {return crs.assignList});  

      this.getApplicants();

    });
  }

  /**
   * Fetch Applicant data from back-end
   * Assumes courseList has already been populated
   * Sort between assigned and unassigned applicants
   */
  getApplicants(){

    //get the list of applicants from back-end

    let finish_flag_1=false;
    let finish_flag_2=false;

    this.course_list.forEach( (crs, index) => {

      this.all_assigned[index] = [];
      this.expanded_ta[0][index] = [];
      this.expanded_ta[1][index] = [];

      this.data.getRankedApplicants(crs).subscribe( res => {

        this.processApplicants(res, index, true)

        finish_flag_1=true;
        this.finish_loading[index] = finish_flag_1 && finish_flag_2;
      });
      this.all_unassigned[index] = [];
      this.data.getUnrankedApplicants(crs).subscribe( res => {

        this.processApplicants(res, index, false) 

        finish_flag_2=true;
        this.finish_loading[index] = finish_flag_1 && finish_flag_2;
      });

    });

      //console.log(this.all_assigned);
      //console.log(this.all_unassigned);


  }//end of getApplicants

  /**
   * Sorts applicants into either the appropriate array
   * unassigned array or assigned array
   * @param res : The response object from back-end
   * @param index : index of the course that these TAs belong to
   * @param ranked : true if 'res' is returning ranked TAs
   */
  processApplicants(res, index, ranked){

    let temp;
    let arr;

    if(ranked){
      arr = res["ranked_applicants"];
    }
    else{
      arr = res["unranked_applicants"];
    }

    let getRank = function(index){
      if(ranked){return index+1}//ranked TAs get their rank from their element order in 'arr' (rank is always >= 1)
      return 0;//unranked TAs ALL have rank of 0
    }

    //convert the emails of assigned tas for thsi course into their object represnetations
    arr.forEach((ta,r) => {

      //determine if the ta has already been assigned to this course
      if(this.all_assigned_temp[index].includes(ta.email) ){
        ta.prof_rank = getRank(r); 
        this.all_assigned[index].push(ta);
        this.expanded_ta[0][index].push(false);

      }
      else{
        ta.prof_rank = getRank(r); 
        this.all_unassigned[index].push(ta);
        this.expanded_ta[1][index].push(false);

      }

      //console.log(this.expanded_ta);

    });

  }//end of processApplicants

  toggle_expand(isAssigned, crs_index, ta_index){

    let index =1;
    if(isAssigned){
      index = 0;
    }

    this.expanded_ta[index][crs_index][ta_index] = !this.expanded_ta[index][crs_index][ta_index];
  }

  //returns index of the currently viewed course
  viewedIndex(){
    return this.course_list.indexOf(this.viewed_course);
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
      this.viewed_assigned = [];
      this.viewed_unassigned = [];
    }
    else{

      //update this component to view the course
      this.viewed_course = this.course_list[index];

      //update the list of viewed tas
      this.viewed_assigned = this.all_assigned[index] ;
      this.viewed_unassigned = this.all_unassigned[index] ;
    }

  }//end of courseView

  //returns the TA hours of a specific course code string
  courseLoaded(course){
    if(course == this.empty_course){
      return true;
    }
    
    return this.finish_loading[this.course_list.indexOf(course)];
  }

  //returns the TA hours of a specific course code string
  courseHrs(course){
    if(course == this.empty_course){
      return 0;
    }
    return this.hrs_list[this.course_list.indexOf(course)];
  }

  //This method will reorder the appropriate array when items are dragged around
  drop(event: CdkDragDrop<string[]>, dest_assignList: boolean) {

    //if reordering items in the same array
    if(event.container == event.previousContainer){
      moveItemInArray(this.viewed_assigned, event.previousIndex, event.currentIndex);
    }
    //if moving items between arrays
    else{
  
      //determine which array is the source and which is the destintion
      if(dest_assignList){

        //TODO
        //Assign the TA
        transferArrayItem(this.viewed_unassigned, this.viewed_assigned, event.previousIndex, event.currentIndex);
      }
      else{

        //TODO
        //Unassign the TA
        transferArrayItem(this.viewed_assigned, this.viewed_unassigned, event.previousIndex, event.currentIndex);
  
      }

    }

  }

  /**
   * Checks if the Ta has already been assigned to a course
   * assumes this ta is coming from the un_assigned list
   */
  isAssigned(ta){

    let index;
    let result=false;

    ta["course"].forEach(crs => {

      index = this.course_list.indexOf(crs);

      if(this.all_assigned[index].find( e => {return e.email == ta.email}) !== undefined ){
        
        result = true;
      }
    });

    return result;
  }

  /**
   * Runs the TA-Matching Algorithm for a single specified course
   * only considers appllicants of each specific priority code one at a time
   * uses a flag to determine whether priority goes to TA-rankings or Professor-rankings when comparing applicants
   * Will remove existing assigned TAs first
   * @param crs 
   */
  autoAssign(crs){

    //clear existing assigned TAs first
    this.clearAssign(crs);

    let hrs = this.courseHrs(crs); //total hrs avaialble in this course
    let counter =0; //track index when traversing array of tas
    let index = this.course_list.indexOf(crs); //index corresponding the course for refernece purposes
    let temp; //temp array to hold TAs for sorting
    
    //loop for priority codes 1,2,3
    for(let p=1; p<4; p++){

      //reset temp array before sorting next set of TAs
      temp = [];

      
      //loop until all TAs (with the right priority code) 
      //have been extracted into temp array
      for(let a=0; a< this.all_unassigned[index].length; a++){
        
        //only consider the TA if they match the relevant priority code
        if( this.all_unassigned[index][a]["status"] == p ){

          //extract the Ta-ranking value
          this.all_unassigned[index][a]["ta_rank"] = this.all_unassigned[index][a]["course"].indexOf(crs)+1;

          transferArrayItem(this.all_unassigned[index], temp, a, 0);
          a--; //compensate for the array shrinking

        }

      }//end of TA extraction loop

      //sort the TAs in the temp array
      temp.sort( this.getSortTA() );

      /**
       * Assign the sorted TAs
       * Until no more hrs or TAs are left
       * Assume that each TA is assigned at minimum 5 hours
       */
      //reset counter before traversing array again
      counter = 0;
      while(hrs >= 5 && counter<temp.length){

        //console.log("\n"+counter+": "+temp[counter]["email"]);
        

        //if enough hrs are available
        //and TA is not already assigned to a different course
        if(hrs >= temp[counter]["hrs"] && !this.isAssigned(temp[counter])){

          //console.log(hrs+" >= "+temp[counter]["hrs"]);

          //deduct the appropriate amount of hrs from the course total
          hrs -= temp[counter]["hrs"];
                  
          //TODO
          //assign the TA to the course
          transferArrayItem(temp, this.all_assigned[index], counter, this.all_assigned[index].length);

          //compensate for array shrinking
          counter--;
        }

        //go to next TA in the list
        counter++;

      }//end of TA assignment loop

      //unassigned TAs go back to the unassigned array
      for(let b=0; b<temp.length; b++){

        transferArrayItem(temp, this.all_unassigned[index], 0, this.all_unassigned[index].length);
        b--;//compensate for the array shrinking

      }//end of TA rejection loop

      //sort the unassigned TA array to keep future auto-assigns consistent
      this.all_unassigned[index].sort(this.getSortTA() );

    }//end of priority code loop


    //refresh the TAs displayed in the editor
    this.courseView(this.viewedIndex());

  }//end of autoAssign

  /**
   * Callback function for "array.sort()"
   * Sorts TAs based on priority code and ranking values
   * Important part of the TA-Matching algorithm
   */
  getSortTA(){

    let flag = this.prof_rank_first;

    function sortTA(a,b){ 

      //lower weights will result in that ranking(ta or prof) having a higher priority
      let ta_weight = 2;
      let prof_weight;
      if(flag){
        prof_weight = 1
      }
      else{
        prof_weight = 3;
      }
  
      let ta_rank = [ ta_weight*a["ta_rank"], ta_weight*b["ta_rank"] ];
      let prof_rank = [ prof_weight*a["prof_rank"], prof_weight*b["prof_rank"] ];
  
      //adjust values for unranked TAs
      if(prof_rank[0]==0){
        prof_rank[0]=99999;
      }
      if(prof_rank[1]==0){
        prof_rank[1]=99999;
      }
  
      return (prof_rank[0]+ta_rank[0]) - (prof_rank[1]+ta_rank[1]) ; 
    }//end of sortTA

    return sortTA;

  }//end of getSortTA


  /**
   * Runs the TA-Matching Algorithm for every course 
   */
  autoAssignAll(){
    this.course_list.forEach(crs => {
      this.autoAssign(crs);
    });
  }//end of autoAssignAll

  /**
   * Unassigns all TAs currently assigned to a specific course
   * @param crs 
   */
  clearAssign(crs){
    let index = this.course_list.indexOf(crs);

    for( let a=0; a<this.all_assigned[index].length; a++){

      //TODO
      //Unassign TA from the course
      transferArrayItem(this.all_assigned[index], this.all_unassigned[index], 0, 0);
      a--;//compensate for the array shrinking
    }

    //sort the unassigned TA array to keep future auto-assigns consistent
    this.all_unassigned[index].sort(this.getSortTA() );

    //refresh the TAs displayed in the editor
    this.courseView(this.viewedIndex());

  }

  /**
   * Unassigns ALL TAs currently assigned to ALL courses
   */
  clearAll(){
    this.course_list.forEach(crs => {
      this.clearAssign(crs);
    });
  }

  //This method will save the changes and send the updated list to the database
  saveChanges() {

    let body=[];

    //construct a valid body for the POST request
    this.course_list.forEach( (crs,index) => {
      body[index] = {
        "course": crs,
        "assignList": this.all_assigned[index].map( ta => {return ta.email} ),
      };
    });

    this.data.updateAllocationTas(body).subscribe(res => {
      alert("Changes Saved");
    });

  }

}//end of class

import { Component, OnInit } from '@angular/core';
import { EnrollmentRecord } from '../enrollment-record';
import { DataService } from '../data.service';

@Component({
  selector: 'app-allocate-ta-hours',
  templateUrl: './allocate-ta-hours.component.html',
  styleUrls: ['./allocate-ta-hours.component.css']
})
export class AllocateTaHoursComponent implements OnInit {

  //The academic year for which hours are being allocated
  current_year : number;

  //An array. Each item relates to a single course and its enrollment data from previous and current year
  //enroll_record_list : EnrollmentRecord[]; 
  enroll_record_list;

  //An array. Each item will be the manual input for each courses' TA hours (two-way binding)
  allocated_hours : number;

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.getAllocationHrs().subscribe(res => {
      this.enroll_record_list = res;
    })

    //HARD-CODED PLACEHOLDER DATA
    //Will probably pull this data from the backend in later versions

    //current year for display purposes
    this.current_year =2021; 

    //array containing enrollment info for all courses
    //"allocated_hrs" should be 0 by default
    /*this.enroll_record_list = [
      {courseCode: "SE3310", instructor:"Person A", prevEnrol: 100, prevHrs:20, currEnrol: 120, currHrs: 0},
      {courseCode: "SE3350", instructor:"Person B", prevEnrol: 200, prevHrs:40, currEnrol: 220, currHrs: 0},
      {courseCode: "ECE4436", instructor:"Person C", prevEnrol: 300, prevHrs:60, currEnrol: 320, currHrs: 0},
      {courseCode: "MATH1200A", instructor:"Person D", prevEnrol: 400, prevHrs:80, currEnrol: 420, currHrs: 0},
      {courseCode: "CHEM1000B", instructor:"Person E", prevEnrol: 500, prevHrs:100, currEnrol: 520, currHrs: 0}
    ];*/

    //END OF HARD CODED PLACEHOLDER DATA

  }//end of ngOnInit

  /**
   * For now, This doesnt do anything
   * In later versions, should send the JSON data to the backend
   * 
   */
  saveChanges(){

  }//end of saveChanges

}//end of class

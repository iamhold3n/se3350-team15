import { Component, OnInit } from '@angular/core';
import { EnrollmentRecord } from '../enrollment-record';

@Component({
  selector: 'app-allocate-ta-hours',
  templateUrl: './allocate-ta-hours.component.html',
  styleUrls: ['./allocate-ta-hours.component.css']
})
export class AllocateTaHoursComponent implements OnInit {

  //The academic year for which hours are being allocated
  current_year : number;

  //An array. Each item relates to a single course and its enrollment data from previous and current year
  enroll_record_list : EnrollmentRecord[]; 

  //An array. Each item will be the manual input for each courses' TA hours (two-way binding)
  allocated_hours : number;

  constructor() { }

  ngOnInit(): void {

    //HARD-CODED PLACEHOLDER DATA
    //Will probably pull this data from the backend in later versions

    //current year for display purposes
    this.current_year =2021; 

    //array containing enrollment info for all courses
    //"allocated_hrs" should be 0 by default
    this.enroll_record_list = [
      {course_id: "SE3310", instructor:"Person A", enrollment_prev: 100, ta_hr_prev:20, enrollment_current: 120, allocated_hrs: 0},
      {course_id: "SE3350", instructor:"Person B", enrollment_prev: 200, ta_hr_prev:40, enrollment_current: 220, allocated_hrs: 0},
      {course_id: "ECE4436", instructor:"Person C", enrollment_prev: 300, ta_hr_prev:60, enrollment_current: 320, allocated_hrs: 0},
      {course_id: "MATH1200A", instructor:"Person D", enrollment_prev: 400, ta_hr_prev:80, enrollment_current: 420, allocated_hrs: 0},
      {course_id: "CHEM1000B", instructor:"Person E", enrollment_prev: 500, ta_hr_prev:100, enrollment_current: 520, allocated_hrs: 0}
    ];

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

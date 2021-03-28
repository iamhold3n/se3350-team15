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
    this.data.getAllocation().subscribe(res => {
      this.enroll_record_list = res;
    })

    //current year for display purposes
    this.current_year =2021; 

  }//end of ngOnInit

  /**
   * Send the JSON data to the backend
   * 
   */
  saveChanges(){
    console.log(this.enroll_record_list);
    this.data.updateAllocationHrs(this.enroll_record_list).subscribe(res => {
      alert('Allocated hours successfully updated for all courses.');
    });
  }//end of saveChanges

}//end of class

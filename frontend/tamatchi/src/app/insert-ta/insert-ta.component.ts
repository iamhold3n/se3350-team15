import { Component, OnInit } from '@angular/core';
import { moveItemInArray, CdkDragDrop} from '@angular/cdk/drag-drop';
import { Candidate } from '../candidate';
import { DataService } from '../data.service';

@Component({
  selector: 'app-insert-ta',
  templateUrl: './insert-ta.component.html',
  styleUrls: ['./insert-ta.component.css']
})
export class InsertTaComponent implements OnInit {

  //list of all courses that are available to rank (based on who's logged in)
  course_list: string[];
  //list of ranked TAs belonging to currently logged professors (based on courseList)
  all_unassigned: Candidate[][];

  email_val: string;

  name_val: string;

  status_options = [1,2,3];
  status_select = 1;

  hrs_options = [5,10];
  hrs_select = 5;

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.email_val = "";
    this.name_val = "";
  }

  insertTA(){

    let ta = {

      email: "test@uwo.ca",
      name: "Test McTesterton",
      questions: ["", "", "", "", "", "", "", ""],
      ranks: [1, 2, 3, 4],
      course:["SE1202", "ECE1210", "ECE3155", "SE1057"],
      status:1,
      hrs: 10,
    };
    ta["prof-rank"]=0;

    let body =[ta];

    this.data.batchApplicants(body).subscribe(res => {
      ta["course"].forEach(crs =>{
        this.all_unassigned[this.course_list.indexOf(crs)].push(ta);
      });
      alert("New TA Added");
    });



  }//end of insertTA

  //This method will reorder the appropriate array when items are dragged around
  drop(event: CdkDragDrop<string[]>) {

    moveItemInArray(this.viewed_assigned, event.previousIndex, event.currentIndex);
  
  }//end of drop

}

import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { moveItemInArray, CdkDragDrop} from '@angular/cdk/drag-drop';
import { Candidate } from '../candidate';
import { DataService } from '../data.service';

@Component({
  selector: 'app-insert-ta',
  templateUrl: './insert-ta.component.html',
  styleUrls: ['./insert-ta.component.css']
})
export class InsertTaComponent implements OnInit {

  //list of all courses that are available to give to this new TA
  //received from parent component
  @Input() course_list: string[];

  //list of the unassigned list that must be updated once the new TA is inserted
  //received from parent component
  @Input() all_unassigned: Candidate[][];

  //emitter to send the new unassigned list to the parent
  @Output() new_unassigned: EventEmitter<any> = new EventEmitter();

  email_val: string;

  name_val: string;

  status_options = [1,2,3];
  status_select = 1;

  hrs_options = [5,10];
  hrs_select = 5;

  ta_rankings: number[];

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.email_val = "";
    this.name_val = "";

    this.ta_rankings = this.course_list.map( crs=>{return 0} );
  }

  insertTA(){

    //remove courses which were omitted from the TA ranking
    let apply_courses= this.course_list.filter( (crs,index) =>{return this.ta_rankings[index]!=0 } );

    //check if valid inputs were given in rankings
    //all ranking numbers should be unique unless they are 0
    let unique_a = this.ta_rankings.filter( rank =>{return rank!=0} );
    let unique_s = new Set(unique_a);

    //only proceed if rnaking values are valid
    if (unique_s.size == unique_a.length){

      let ta = {

        email: this.email_val,
        name: this.name_val,
        questions: ["", "", "", "", "", "", "", ""],
        ranks: unique_a,
        course:apply_courses,
        status:this.status_select,
        hrs: this.hrs_select,
      };
      ta["prof-rank"]=0;
  
      let body =[ta];
  
      //save the inserted TA to the backend
      this.data.batchApplicants(body).subscribe(res => {

        //if TA was successfully sent to back-end, update the front end editor
        (res) => {
          //update the unassigned list
          ta["course"].forEach(crs =>{
            this.all_unassigned[this.course_list.indexOf(crs)].push(ta);
          });

          //emit the updated unassigned list to the parent
          this.new_unassigned.emit(this.all_unassigned);

          alert("New TA Added");

        }

        //if error occurred sending TA to back-end
        //dispaly error message
        (error) => {

          alert(error);

        }

      });
    }
    else{
      alert("Please make sure all ranking values (besides 0) are unique");
    }

  }//end of insertTA

  closeInsert() {
    const darkened = document.getElementById('darkened');
    const popup = document.getElementById('popup');
    darkened.style.display = 'none';
    popup.style.display = 'none';
  }

}

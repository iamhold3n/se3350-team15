import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-ta-info',
  templateUrl: './ta-info.component.html',
  styleUrls: ['./ta-info.component.css']
})
export class TaInfoComponent implements OnInit {
  questions;
  taDetails;
  relevant;

  constructor(private data: DataService) { }

  ngOnInit(): void {
  }

  getInfo(c, ta) {
    this.data.getQuestions(c).subscribe(ques => {
      this.questions = ques['questions'];

      this.data.getApplicants().subscribe(appl => {
        let arr;
        arr = appl;

        for(let i = 0; i < arr.length; i++) {
          if(arr[i].email === ta) this.taDetails = arr[i];
        }

        // only get question relevant to selected course
        this.relevant = [];
        this.questions.forEach(q => {
          for(let i = 0; i < this.taDetails.questions.length; i++) {
            if(q === this.taDetails.questions[i].question) this.relevant.push(i);
          }
        })
      })
    })
  }

  closeTaDetails() {
    const darkened = document.getElementById('darkened2');
    const popup = document.getElementById('popup2');
    darkened.style.display = 'none';
    popup.style.display = 'none';
  }

}

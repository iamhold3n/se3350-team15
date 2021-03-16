import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-course-questions',
  templateUrl: './course-questions.component.html',
  styleUrls: ['./course-questions.component.css']
})
export class CourseQuestionsComponent implements OnInit {
  public courseSelected;

  constructor(private data: DataService) { }

  ngOnInit(): void {
  }

  public courseQuestions(course) {
    // query server for existing course questions
    this.data.getQuestions(course).subscribe(res => {
      this.courseSelected = res;
      console.log(this.courseSelected);

      const darkened = document.getElementById('darkened');
      const popup = document.getElementById('popup');
      darkened.style.display = 'block';
      popup.style.display = 'block';
    })

    // dummy data for now
    /*this.courseSelected.questions = [];
    this.courseSelected.courseCode = course;
    this.courseSelected.courseName = 'Intro Course';
    this.courseSelected.questions.push('Know Javascript?');
    console.log(this.courseSelected);*/

    // popup effect

  }

  addQuestion() {

    this.courseSelected.questions.push('');


  }

  removeQuestion(i) {
    this.courseSelected.questions.splice(i, 1);
  }

  saveQuestions(q: Array<object>) {
    // send updated questions to server

   
    this.closeQuestions();


  }

  closeQuestions() {
    const darkened = document.getElementById('darkened');
    const popup = document.getElementById('popup');
    darkened.style.display = 'none';
    popup.style.display = 'none';
  }

  trackByFn(index, item) { // prevent heavy DOM manipulation when editing questions
    return index;
  }

}

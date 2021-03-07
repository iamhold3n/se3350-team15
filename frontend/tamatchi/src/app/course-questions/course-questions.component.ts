import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-questions',
  templateUrl: './course-questions.component.html',
  styleUrls: ['./course-questions.component.css']
})
export class CourseQuestionsComponent implements OnInit {
  public courseSelected = {courseCode: null, courseName: null, questions: [] };

  constructor() { }

  ngOnInit(): void {
  }

  public courseQuestions(course) {
    // query server for existing course questions

    // dummy data for now
    this.courseSelected.questions = [];
    this.courseSelected.courseCode = course;
    this.courseSelected.courseName = 'Intro Course';
    this.courseSelected.questions.push('Know Javascript?');
    console.log(this.courseSelected);

    // popup effect
    const darkened = document.getElementById('darkened');
    const popup = document.getElementById('popup');
    darkened.style.display = 'block';
    popup.style.display = 'block';
  }

  addQuestion() {
    this.courseSelected.questions.push('');
  }

  removeQuestion(i) {
    this.courseSelected.questions.splice(i, 1);
  }

  saveQuestions() {
    // send updated questions to server

    // for now, just print to console
    console.log(this.courseSelected);
    
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

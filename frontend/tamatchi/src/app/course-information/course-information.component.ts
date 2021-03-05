import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-information',
  templateUrl: './course-information.component.html',
  styleUrls: ['./course-information.component.css']
})
export class CourseInformationComponent implements OnInit {

  constructor() { }

  public courseCode: string;
  public courseName: string;
  public lecHours: number;
  public labOrTutHours: number;
  public sections: number;




  public rows: Array<{courseCode: string, courseName: string, lecHours: number,labOrTutHours: number, sections: number }> = [];

  public courseSelected = {courseCode: null, courseName: null, questions: [] };

  buttonClicked() {
    this.rows.push( {courseCode: this.courseCode, courseName: this.courseName, lecHours: this.lecHours, labOrTutHours: this.labOrTutHours, sections: this.sections} );

    

    //if you want to clear input
    this.courseCode = null;
    this.courseName = null;
    this.lecHours = null;
    this.labOrTutHours = null;
    this.sections = null;
  

  }

 


  ngOnInit(): void {
  }

  courseQuestions(course) {
    // query server for existing course questions

    // dummy data for now
    this.courseSelected.questions = [];
    this.courseSelected.courseCode = course;
    this.courseSelected.courseName = 'Intro Course';
    this.courseSelected.questions.push('Know Javascript?');

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

import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseQuestionsComponent } from '../course-questions/course-questions.component';

@Component({
  selector: 'app-course-information',
  templateUrl: './course-information.component.html',
  styleUrls: ['./course-information.component.css']
})
export class CourseInformationComponent implements OnInit {
  @ViewChild(CourseQuestionsComponent) private questions: CourseQuestionsComponent;

  constructor() { }

  public courseCode: string;
  public courseName: string;
  public lecHours: number;
  public labOrTutHours: number;
  public sections: number;




  public rows: Array<{courseCode: string, courseName: string, lecHours: number,labOrTutHours: number, sections: number }> = [];


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

  showQuestions(c) {
    this.questions.courseQuestions(c);
  }

}

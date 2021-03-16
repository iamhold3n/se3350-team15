import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseQuestionsComponent } from '../course-questions/course-questions.component';
import { DataService } from '../data.service';

@Component({
  selector: 'app-course-information',
  templateUrl: './course-information.component.html',
  styleUrls: ['./course-information.component.css']
})
export class CourseInformationComponent implements OnInit {
  @ViewChild(CourseQuestionsComponent) private questions: CourseQuestionsComponent;

  constructor(private data: DataService) { }

  public courseCode: string;
  public courseName: string;
  public lecHrs: number;
  public labOrTutHrs: number;
  public sec: number;




  //public rows: Array<{courseCode: string, courseName: string, lecHours: number,labOrTutHours: number, sections: number }> = [];
  public rows;


  addCourses() {
    this.rows.push( {
      courseCode: this.courseCode, 
      courseName: this.courseName, 
      lecHrs: this.lecHrs, 
      labOrTutHrs: this.labOrTutHrs, 
      sec: this.sec} );

    

    //if you want to clear input
    this.courseCode = null;
    this.courseName = null;
    this.lecHrs = null;
    this.labOrTutHrs = null;
    this.sec = null;
  

  }

 

  saveCourses(){

  }

 


  ngOnInit(): void {
    this.data.getCourses().subscribe(res => {
      this.rows = res;
    })
  }

  showQuestions(c) {
    this.questions.courseQuestions(c);
  }

}

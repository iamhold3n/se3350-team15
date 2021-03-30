import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-course-questions',
  templateUrl: './course-questions.component.html',
  styleUrls: ['./course-questions.component.css']
})
export class CourseQuestionsComponent implements OnInit {
  public courseList;
  public courseSelected;

  constructor(private data: DataService, private auth : AuthService) { }

  ngOnInit(): void {
    this.auth.getUserObject().then(user => {
      if (user === null) console.log('what are you doing here...');
      else {
        this.data.getProfessor(user["email"]).subscribe(res => {
          this.courseList = res["course"];
        })
      }
    })
  }

  public courseQuestions(course) {
    // query server for existing course questions
    this.data.getQuestions(course).subscribe(res => {
      this.courseSelected = res;
    })
  }

  toggleCourse(index, active) {
    // toggle which course is selected in course nav
    this.courseQuestions(active);

    for (let i = 0; i < this.courseList.length; i++) {
      let e = document.getElementById(this.courseList[i]);

      if (index === i) e.className = 'subnav active';
      else e.className = 'subnav';
    }
  }

  addQuestion() {
    this.courseSelected.questions.push('');
  }

  removeQuestion(i) {
    this.courseSelected.questions.splice(i, 1);
  }

  saveQuestions() {
    // send updated questions to server
    this.data.updateQuestions(this.courseSelected.courseCode, this.courseSelected).subscribe(
      res => alert('Questions successfully updated.'),
      err => console.log(err));
    
  }

  trackByFn(index, item) { // prevent heavy DOM manipulation when editing questions
    return index;
  }

}

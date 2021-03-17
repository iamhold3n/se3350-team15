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

      const darkened = document.getElementById('darkened');
      const popup = document.getElementById('popup');
      darkened.style.display = 'block';
      popup.style.display = 'block';
    })    
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

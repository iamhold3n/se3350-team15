import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-assign-instructor',
  templateUrl: './assign-instructor.component.html',
  styleUrls: ['./assign-instructor.component.css']
})
export class AssignInstructorComponent implements OnInit {
  public courseList;
  public instructorList;
  public selectedCourse;
  public selectedInstructor;

  public courseNav = [];
  public instructorNav = [];

  public assignedList = [];

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.grabData();
  }

  grabData() {
    this.data.getCourses().subscribe(res => {
      this.courseList = res;
      this.courseNav = [];

      for(let i = 0; i < this.courseList.length; i++) {
        this.courseNav.push(`nav-cour${i}`);
      }
    })

    this.data.getInstructors().subscribe(res => {
      this.instructorList = res;
      this.instructorNav = [];

      for(let i = 0; i < this.instructorList.length; i++) {
        this.instructorNav.push(`nav-inst${i}`);
      }
    })
  }

  selectCourse(cour, index) {
    this.toggleSelected(this.courseNav, index, false);

    this.selectedCourse = cour;

    for(let i = 0; i < this.instructorList.length; i++) {
      if(this.instructorList[i].course.includes(cour)) {
        this.selectInstructor(this.instructorList[i].email, i);
        break;
      }
      if(i === this.instructorList.length - 1) this.toggleSelected(this.instructorNav, 0, true);
    }
  }

  selectInstructor(inst, index) {
    if (this.selectCourse === undefined) alert('Please select a course first.');
    else {
      this.toggleSelected(this.instructorNav, index, false);
      this.selectedInstructor = inst;
    }
  }

  toggleSelected(arr, index, none) {
    for (let i = 0; i < arr.length; i++) {
      let e = document.getElementById(arr[i]);

      if (index === i && !none) e.className = 'active';
      else e.className = '';
    }
  }

  assignInstructor() {
    if(this.selectedCourse == undefined) alert('Please select a course first.');
    else {
      if(this.selectedInstructor == undefined) alert('Please select an instructor first.');
      else this.data.assignInstructor(this.selectedCourse, this.selectedInstructor, this.instructorList).subscribe(res => {
        alert(`${this.selectedInstructor} successfully assigned to ${this.selectedCourse}`);
        this.grabData();
      });
    }
  }

}

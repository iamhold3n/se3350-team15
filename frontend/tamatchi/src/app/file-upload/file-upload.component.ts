import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as XLSX from 'xlsx';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  uploadFile;
  uploadType = 0;

  activeFile;
  applicantsFile = ['course','name','email','status','hrs','ranks','questions'];
  coursesFile = ['courseCode','courseName','lecHrs','labOrTutHrs','sec'];
  enrolhrsFile = ['courseCode','labOrTutHrs','prevEnrol','prevHrs','currEnrol'];
  instructorsFile = ['name','email'];

  typeNav = ['applicants','courses','enrolment','instructors'];

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.toggleType(0, this.applicantsFile);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.activeFile, event.previousIndex, event.currentIndex);
  }

  toggleType(type, active) {
    this.activeFile = active;
    this.uploadType = type;

    for (let i = 0; i < this.typeNav.length; i++) {
      let e = document.getElementById(this.typeNav[i]);

      if (type === i) e.className = 'active';
      else e.className = '';
    }
  }

  addEmpty() {
    this.activeFile.push('EMPTY');
  }

  isEmpty(f) {
    if (f == 'EMPTY') return true;
    else return false;
  }

  upload() {
    if (this.uploadFile == undefined) alert('Please select a file first.');
    else {
      if (this.uploadType == 0) this.uploadApplicants();
      else if (this.uploadType == 1) this.uploadCourses();
      else if (this.uploadType == 2) this.uploadEnrolment();
      else this.uploadInstructors();
    }
  }

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];

    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_csv(sheet).split('\n');
        return initial;
      }, {});

      this.uploadFile = jsonData['Sheet1'].slice(1); // remove the column headers
    }
    reader.readAsBinaryString(file);
  }

  uploadApplicants() {
    let applicants = [];

    let courseIndex = this.applicantsFile.indexOf('course');
    let nameIndex = this.applicantsFile.indexOf('name');
    let emailIndex = this.applicantsFile.indexOf('email');
    let statusIndex = this.applicantsFile.indexOf('status');
    let hrsIndex = this.applicantsFile.indexOf('hrs');
    let ranksIndex = this.applicantsFile.indexOf('rank');
    let questionsIndex = this.applicantsFile.indexOf('questions');

    this.uploadFile.forEach(e => {
      e = e.split(',');
      if (e[nameIndex] != undefined && e[nameIndex] != "") {
        if (applicants.length == 0) {
          applicants.push(this.newApplicant(e, courseIndex, emailIndex, hrsIndex, nameIndex, questionsIndex, ranksIndex, statusIndex));
        } else {
          let sz = applicants.length - 1;

          if (e[nameIndex] === applicants[sz]['name'] && e[emailIndex] === applicants[sz]['email']) {
            // add course code and corresponding rank to existing entry
            applicants[sz].course.push(e[courseIndex]);
            applicants[sz].ranks.push(parseInt(e[ranksIndex]));

            // merge questions, keeping only unique ones
            let questions = [...applicants[sz].questions, ...this.getQuestions(e, questionsIndex)];
            let set = new Set(questions);
            applicants[sz].questions = Array.from(set);
          } else {
            applicants.push(this.newApplicant(e, courseIndex, emailIndex, hrsIndex, nameIndex, questionsIndex, ranksIndex, statusIndex));
          }
        }
      }
    })

    if (applicants.length == 0) alert('Wrong file.');
    else {
      this.data.batchApplicants(applicants).subscribe(
        res => alert('Applicants successfully added.'),
        err => alert('Something went wrong...'));
    }
  }

  newApplicant(e, courseIndex, emailIndex, hrsIndex, nameIndex, questionsIndex, ranksIndex, statusIndex) {
    let a = {
      course: [e[courseIndex]],
      email: e[emailIndex],
      hrs: parseInt(e[hrsIndex]),
      name: e[nameIndex],
      questions: this.getQuestions(e, questionsIndex),
      ranks: [parseInt(e[ranksIndex])],
      status: parseInt(e[statusIndex])
    }

    return a;
  }

  getQuestions(e, questionsIndex) {
    let q = [];

    for(let i = 1; ;i++) {
      if(e[questionsIndex] === undefined || e[questionsIndex] == "") break;
      else {
        q.push({
          question: e[questionsIndex],
          answer: e[questionsIndex + 1]
        })
        questionsIndex += 2;
      }
    }

    return q;
  }

  uploadCourses() {
    let courses = [];

    let courseIndex = this.coursesFile.indexOf('courseCode');
    let nameIndex = this.coursesFile.indexOf('courseName');
    let lecIndex = this.coursesFile.indexOf('lecHrs');
    let labIndex = this.coursesFile.indexOf('labOrTutHrs');
    let secIndex = this.coursesFile.indexOf('sec');

    this.uploadFile.forEach(e => {
      e = e.split(',');

      if (e[courseIndex] != undefined && e[courseIndex] != "") {
        courses.push({
          courseCode: e[courseIndex],
          courseName: e[nameIndex],
          labOrTutHrs: e[labIndex] | 0, // XLSX conversion sees zeroes as undefined, doing this so it doesn't fail with sample data
          lecHrs: parseInt(e[lecIndex]),
          questions: [],
          sec: parseInt(e[secIndex])
        })
      }
    })

    if (courses.length == 0) alert('Wrong file.');
    else {
      this.data.batchCourses(courses).subscribe(
        res => alert('Courses successfully added.'),
        err => alert('Something went wrong...'));
    }
  }

  uploadEnrolment() {
    let enrolment = [];

    let courseIndex = this.enrolhrsFile.indexOf('courseCode');
    let labIndex = this.enrolhrsFile.indexOf('labOrTutHrs');
    let prevEnrolIndex = this.enrolhrsFile.indexOf('prevEnrol');
    let prevHrsIndex = this.enrolhrsFile.indexOf('prevHrs');
    let currEnrolIndex = this.enrolhrsFile.indexOf('currEnrol');

    this.uploadFile.forEach(e => {
      e = e.split(',');

      if (e[courseIndex] != undefined && e[courseIndex] != "") {
        enrolment.push({
          courseCode: e[courseIndex],
          currEnrol: parseInt(e[currEnrolIndex]),
          labOrTutHrs: parseInt(e[labIndex]),
          prevEnrol: parseInt(e[prevEnrolIndex]),
          prevHrs: parseInt(e[prevHrsIndex])
        })
      }
    })

    if (enrolment.length == 0) alert('Wrong file.');
    else {
      this.data.batchEnrolment(enrolment).subscribe(
        res => alert('Enrolment information successfully added.'),
        err => alert('Something went wrong...'));
    }
  }

  uploadInstructors() {
    let instructors = [];

    let emailIndex = this.instructorsFile.indexOf('email');
    let nameIndex = this.instructorsFile.indexOf('name');

    this.uploadFile.forEach(e => {
      e = e.split(',');

      if (e[emailIndex] != undefined && e[emailIndex] != "") {
        instructors.push({
          email: e[emailIndex],
          name: e[nameIndex]
        })
      }
    })

    if (instructors.length == 0) alert('Wrong file.');
    else {
      this.data.batchInstructors(instructors).subscribe(
        res => alert('Instructors successfully added.'),
        err => alert('Something went wrong...'));
    }
  }
}

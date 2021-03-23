import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  uploadFile;
  uploadType = 0;

  constructor(private data: DataService) { }

  ngOnInit(): void {
  }

  toggleType(type) {
    this.uploadType = type;
  }

  upload() {
    if (this.uploadType == 0) this.uploadApplicants();
    else if (this.uploadType == 1) this.uploadCourses();
    else if (this.uploadType == 2) this.uploadEnrolment();
    else this.uploadInstructors();
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
        initial[name] = XLSX.utils.sheet_to_json(sheet); // XLSX.utils.sheet_to_csv(sheet); <-- consider using if field names change
        return initial;
      }, {});

      this.uploadFile = jsonData['Sheet1'];
    }
    reader.readAsBinaryString(file);
  }

  uploadApplicants() {
    let applicants = [];
    this.uploadFile.forEach(e => {
      if (e.hasOwnProperty('Applicant Name') && e.hasOwnProperty('applicant email')) {
        if (applicants.length == 0) {
          applicants.push(this.newApplicant(e));
        } else {
          let sz = applicants.length - 1;

          if (e['Applicant Name'] === applicants[sz]['name'] && e['applicant email'] === applicants[sz]['email']) {
            // add course code and corresponding rank
            applicants[sz].course.push(e['Course Code']);
            applicants[sz].ranks.push(e['Course Rank']);

            // merge questions, keeping only unique ones
            let questions = [...applicants[sz].questions, ...this.getQuestions(e)];
            let set = new Set(questions);
            applicants[sz].questions = Array.from(set);
          } else {
            applicants.push(this.newApplicant(e));
          }
        }
      }
    })

    if (applicants.length == 0) alert('Wrong file.');
    else {
      console.log(applicants);
      this.data.batchApplicants(applicants).subscribe(
        res => alert('Applicants successfully added.'),
        err => console.log(err));
    }
  }

  newApplicant(e) {
    let a = {
      course: [e['Course Code']],
      email: e['applicant email'],
      hrs: e['5or10 hrs'],
      name: e['Applicant Name'],
      questions: this.getQuestions(e),
      ranks: [e['Course Rank']],
      status: e['Applicant status ( 1- Fundable, 2-NotFundable,3-External)']
    }

    return a;
  }

  getQuestions(e) {
    let q = [];

    for(let i = 1; ;i++) {
      if(e[`Q${i}`] === undefined) break;
      else {
        q.push({
          question: e[`Q${i}`],
          answer: e[`A${i}`]
        })
      }
    }

    return q;
  }

  uploadCourses() {
    let courses = [];
    this.uploadFile.forEach(e => {
      if (e.hasOwnProperty('Course Code') && e.hasOwnProperty('Course Name')) {
        courses.push({
          courseCode: e['Course Code'],
          courseName: e['Course Name'],
          labOrTutHrs: e['Lab/Tutorial hours'] | 0, // XLSX conversion sees zeroes as undefined, doing this so it doesn't fail with sample data
          lecHrs: e['Lec hours'],
          questions: [],
          sec: e['No. of Sections']
        })
      }
    })

    if (courses.length == 0) alert('Wrong file.');
    else {
      console.log(courses);
      this.data.batchCourses(courses).subscribe(
        res => alert('Courses successfully added.'),
        err => console.log(err));
    }
  }

  uploadEnrolment() {
    let enrolment = [];

    this.uploadFile.forEach(e => {
      if (e.hasOwnProperty('Course Code') && e.hasOwnProperty('Previous Enrollments')) {
        enrolment.push({
          courseCode: e['Course Code'],
          currEnrol: e['Current Enrollemnts '], // typo in excel sheet, be sure to change if updated
          labOrTutHrs: e['Lab/tutorial Hours'],
          prevEnrol: e['Previous Enrollments'],
          prevHrs: e['Previous TA hours']
        })
      }
    })

    if (enrolment.length == 0) alert('Wrong file.');
    else {
      console.log(enrolment);
      this.data.batchEnrolment(enrolment).subscribe(
        res => alert('Enrolment information successfully added.'),
        err => console.log(err));
    }
  }

  uploadInstructors() {
    let instructors = [];

    this.uploadFile.forEach(e => {
      if (e.hasOwnProperty('Instructor Email') && e.hasOwnProperty('Instructor Name')) {
        instructors.push({
          email: e['Instructor Email'],
          name: e['Instructor Name']
        })
      }
    })

    if (instructors.length == 0) alert('Wrong file.');
    else {
      console.log(instructors);
      this.data.batchInstructors(instructors).subscribe(
        res => alert('Instructors successfully added.'),
        err => console.log(err));
    }
  }
}

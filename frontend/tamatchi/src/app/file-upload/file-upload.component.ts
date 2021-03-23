import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FileUpload } from 'src/app/models/file-upload.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;

  uploadFile;

  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {
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
      console.log(this.uploadFile);

      //this.uploadApplicants();
      //this.uploadCourses();
      //this.uploadEnrolment();
      //this.uploadInstructors();

      // TODO: 
      //    make radio buttons to choose which file the user is uploading
      //    add API to send to server
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

    console.log(applicants);
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
          labOrTutHrs: e['Lab/Tutorial hours'],
          lecHrs: e['Lec hours'],
          sec: e['No. of Sections']
        })
      }
    })

    if (courses.length == 0) alert('Wrong file.');

    console.log(courses);
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

    if (enrolment.length == 0) alert('Wrongin file.');

    console.log(enrolment);
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

    console.log(instructors);
  }

  /*selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
          percentage => {
            this.percentage = Math.round(percentage ? percentage : 0);
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }*/
}

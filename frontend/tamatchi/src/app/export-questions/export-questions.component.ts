import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-export-questions',
  templateUrl: './export-questions.component.html',
  styleUrls: ['./export-questions.component.css']
})
export class ExportQuestionsComponent implements OnInit {
  public courseList;

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.getCourses().subscribe(res => {
      this.courseList = res;
    })
  }

  exportQuestions() {
    if (this.courseList !== undefined) {
      // prepare JSON data for export
      let exportData = [];
      this.courseList.forEach(c => {
        let course = {};
        course['Course Code'] = c.courseCode;
        course['Course Name'] = c.courseName;

        c.questions.forEach((q, i) => {
          course[`Q${i+1}`] = q;
        })

        exportData.push(course);
      })

      let worksheet = XLSX.utils.json_to_sheet(exportData);
      let workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Course Questions');
      XLSX.writeFile(workbook, 'coursequestions.xlsx');
    } else {
      alert('Failed to get course questions from server.  Export cannot continue.');
    }
  }

}

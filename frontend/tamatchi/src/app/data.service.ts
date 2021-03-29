import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  url = "/api";

  constructor(private http: HttpClient) { }

  getQuestions(c) {
    return this.http.get(`${this.url}/questions/${c}`);
  }

  updateQuestions(c, questions) {
    return this.http.post(`${this.url}/questions/${c}`, questions);
  }

  getCourses() {
    return this.http.get(`${this.url}/courses/`);
  }

  getApplicants(){
    return this.http.get(`${this.url}/applicants/`);
  }

  getInstructors(){
    return this.http.get(`${this.url}/instructors/`);
  }

  /**
   * Use this to get data for:
   * -Allocating TA hours to courses
   * -Assigning TAs to courses
   * @returns 
   */
  getAllocation() {
    return this.http.get(`${this.url}/allocation/`);
  }

  updateAllocationHrs(hrs) {
    return this.http.post(`${this.url}/allocation/hrs/`, hrs)
  }

  updateAllocationTas(tas) {
    return this.http.post(`${this.url}/allocation/tas/`, tas)
  }

  addCourse(c) {
    return this.http.put(`${this.url}/courses/`, c);

  }

  // send data from processed XLSX files
  batchApplicants(a) {
    return this.http.put(`${this.url}/batch/applicants/`, a);
  }
  batchCourses(c) {
    return this.http.put(`${this.url}/batch/courses/`, c);
  }
  batchEnrolment(e) {
    return this.http.put(`${this.url}/batch/enrolhrs/`, e);
  }
  batchInstructors(i) {
    return this.http.put(`${this.url}/batch/instructors/`, i);
  }

  
}

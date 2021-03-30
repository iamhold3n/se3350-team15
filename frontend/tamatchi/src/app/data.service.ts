import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  url = "/api";

  constructor(private http: HttpClient, public cookie: CookieService) { }

  getQuestions(c) {
    return this.http.get(`${this.url}/questions/${c}`, {headers : {'authorization' : this.cookie.get("token")}});
  }

  updateQuestions(c, questions) {
    return this.http.post(`${this.url}/questions/${c}`, questions, {headers : {'authorization' : this.cookie.get("token")}});
  }

  getCourses() {
    return this.http.get(`${this.url}/courses/`, {headers : {'authorization' : this.cookie.get("token")}});
  }

  getProfessor(email) {
    return this.http.get(`${this.url}/instructors/${email}`, {headers : {'authorization' : this.cookie.get("token")}});
  }

  getApplicants(){
    return this.http.get(`${this.url}/applicants/`, {headers : {'authorization' : this.cookie.get("token")}});
  }

  getInstructors(){
    return this.http.get(`${this.url}/instructors/`, {headers : {'authorization' : this.cookie.get("token")}});
  }
  
  getRankedApplicants(course){
    return this.http.get(`${this.url}/ranking/${course}`, {headers : {'authorization' : this.cookie.get("token")}});
  }

  getUnrankedApplicants(course){
    return this.http.get(`${this.url}/unranked/${course}`, {headers : {'authorization' : this.cookie.get("token")}});
  }

  /**
   * Use this to get data for:
   * -Allocating TA hours to courses
   * -Assigning TAs to courses
   * @returns 
   */
  getAllocation() {
    return this.http.get(`${this.url}/allocation/`, {headers : {'authorization' : this.cookie.get("token")}});
  }

  updateCourseRanking(course,ranking) {
    return this.http.post(`${this.url}/ranking/${course}/`, ranking, {headers : {'authorization' : this.cookie.get("token")}})
  }

  updateAllocationHrs(hrs) {
    return this.http.post(`${this.url}/allocation/hrs/`, hrs, {headers : {'authorization' : this.cookie.get("token")}})
  }

  updateAllocationTas(tas) {
    return this.http.post(`${this.url}/allocation/tas/`, tas, {headers : {'authorization' : this.cookie.get("token")}})
  }

  addCourse(c) {
    return this.http.put(`${this.url}/courses/`, c, {headers : {'authorization' : this.cookie.get("token")}});

  }

  addEnrolment(c) {
    return this.http.put(`${this.url}/enrolhrs/`, c, {headers : {'authorization' : this.cookie.get("token")}});
  }

  // send data from processed XLSX files
  batchApplicants(a) {
    return this.http.put(`${this.url}/batch/applicants/`, a, {headers : {'authorization' : this.cookie.get("token")}});
  }
  batchCourses(c) {
    return this.http.put(`${this.url}/batch/courses/`, c, {headers : {'authorization' : this.cookie.get("token")}});
  }
  batchEnrolment(e) {
    return this.http.put(`${this.url}/batch/enrolhrs/`, e, {headers : {'authorization' : this.cookie.get("token")}});
  }
  batchInstructors(i) {
    return this.http.put(`${this.url}/batch/instructors/`, i, {headers : {'authorization' : this.cookie.get("token")}});
  }
    
  addInstructor(i){
    return this.http.put(`${this.url}/instructors/`, i, {headers : {'authorization' : this.cookie.get("token")}});

  }

  assignInstructor(cour, inst, list) {
    return this.http.post(`${this.url}/instructors/${cour}/${inst}`, list);
  }

  
}

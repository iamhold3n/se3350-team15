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

  getAllocationHrs() {
    return this.http.get(`${this.url}/allocation/`);
  }

}

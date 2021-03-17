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

  getCourses() {
    return this.http.get(`${this.url}/courses/`);
  }

  getAllocations(){
    return this.http.get(`${this.url}/allocations/`);
  }

  getApplicants(){
    return this.http.get(`${this.url}/applicants/`);
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor() { }

  public courseInstructor: string;
  public listCourses: string;
  public questions: string;

  ngOnInit(): void {
  }

}

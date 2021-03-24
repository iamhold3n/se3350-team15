import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor(private data: DataService) { }

  public profName: string;
  public profEmail: string;
  public allProfs: any;

  ngOnInit(): void {
    this.data.getInstructors().subscribe(res => {
      this.allProfs = res;
    })
  }

}

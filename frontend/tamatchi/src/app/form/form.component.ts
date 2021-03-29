import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor(private data: DataService) { }

  public email: string;
  public name: string;
  public allProfs;

  submit() {
    let instructor = {
      email: this.email,
      name: this.name,
      
    };

    this.data.addInstructor(instructor).subscribe(
      () => alert('Instructor successfully added.'),
        err => console.log(err));

      this.allProfs.push(instructor);
      //if you want to clear input
      this.email = null;
      this.name = null;
      
    }



  ngOnInit(): void {
    this.data.getInstructors().subscribe(res => {
      this.allProfs = res;
    })
  }

}

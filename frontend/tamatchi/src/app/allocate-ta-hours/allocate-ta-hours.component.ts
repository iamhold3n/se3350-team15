import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-allocate-ta-hours',
  templateUrl: './allocate-ta-hours.component.html',
  styleUrls: ['./allocate-ta-hours.component.css']
})
export class AllocateTaHoursComponent implements OnInit {

  current_year : number; //The academic year for which hours are being allocated

  constructor() { }

  ngOnInit(): void {
    this.current_year =2021; //PLACEHOLDER DATA
  }

}

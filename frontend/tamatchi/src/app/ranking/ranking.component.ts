import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  constructor() { 
  }

  ngOnInit(): void {
  }

  //static list of ta names to be ranked 
  //TODO: get list of tas from database
  talist = [
    "ta1", 
    "ta2", 
    "ta3"
  ];

  //This method will reorder the array when items are dragged around
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.talist, event.previousIndex, event.currentIndex);
  }

  //This method will save the ranking changes and send the updated list to the database
  //TODO: Save changes to rankings
  confirmRankings() {
    alert("Changes Saved *not really");
  }
}

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

  //list of ta names to be ranked
  talist = [
    "ta1", 
    "ta2", 
    "ta3"
  ];

  //This method will reorder the array when items are dragged around
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.talist, event.previousIndex, event.currentIndex);
  }
}

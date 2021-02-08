import { Component, OnInit } from '@angular/core';

class TA{
  rank: number;
  name: string;

  constructor(rank:number, name:string){
    this.rank=rank;
    this.name=name;
  }
}

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

  talist = [
    new TA(1, "ta1"), 
    new TA(2, "ta2"), 
    new TA(3, "ta3")
  ];
  
  sortTaList()
  {
    this.talist.sort((a, b) => {
      return a.rank - b.rank;
    });
  }
}

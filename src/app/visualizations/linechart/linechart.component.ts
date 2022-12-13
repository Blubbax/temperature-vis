import { DataService } from './../../service/data.service';
import { Station } from './../../model/station';
import { Component, OnInit } from '@angular/core';

declare function drawLineChart(data: Station[]): void;

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.scss']
})
export class LinechartComponent implements OnInit {


  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.stationsFiltered.subscribe(data => {
      drawLineChart(data);
    });
  }

}

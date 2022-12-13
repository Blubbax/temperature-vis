import { DataService } from './../../service/data.service';
import { Station } from './../../model/station';
import { Component, OnInit } from '@angular/core';

declare function drawBoxPlotChart(data: Station[]): void;

@Component({
  selector: 'app-boxplotchart',
  templateUrl: './boxplotchart.component.html',
  styleUrls: ['./boxplotchart.component.scss']
})
export class BoxplotchartComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.stationsVisSelection.subscribe(data => {
      // drawBoxPlotChart(data);
    });
  }

}

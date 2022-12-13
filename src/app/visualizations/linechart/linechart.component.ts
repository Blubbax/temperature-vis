import { TemperatureRecord } from './../../model/temperature-record';
import { DataService } from './../../service/data.service';
import { Component, OnInit } from '@angular/core';

declare function drawLineChart(data: TemperatureRecord[]): void;

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.scss']
})
export class LinechartComponent implements OnInit {


  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.stationsFiltered.subscribe(data => {
      drawLineChart(this.dataService.getStationsAsTemperatureList(data));
    });
  }

}

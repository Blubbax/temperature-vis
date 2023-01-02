import { Station } from './../../model/station';
import { TemperatureRecord } from './../../model/temperature-record';
import { DataService } from './../../service/data.service';
import { Component, HostListener, OnInit } from '@angular/core';

declare function drawBoxPlotChart(data: TemperatureRecord[]): void;
declare function resizeBoxPlotChart(): void;

@Component({
  selector: 'app-boxplotchart',
  templateUrl: './boxplotchart.component.html',
  styleUrls: ['./boxplotchart.component.scss']
})
export class BoxplotchartComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.stationsVisSelection.subscribe((data: Station[]) => {
      drawBoxPlotChart(this.dataService.getStationsAsTemperatureList(data));
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    resizeBoxPlotChart();
  }

}

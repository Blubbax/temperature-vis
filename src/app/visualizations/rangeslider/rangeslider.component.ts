import { DataService } from './../../service/data.service';
import { TemperatureRecord } from './../../model/temperature-record';
import { Component, OnInit } from '@angular/core';

declare function drawRangeslider(data: TemperatureRecord[]) : void;

@Component({
  selector: 'app-rangeslider',
  templateUrl: './rangeslider.component.html',
  styleUrls: ['./rangeslider.component.scss']
})
export class RangesliderComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.stations.subscribe(data => {
      // drawRangeslider(this.dataService.getStationsAsTemperatureList(data));
    })
  }

}

import { DataService } from './../../service/data.service';
import { TemperatureRecord } from './../../model/temperature-record';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

declare function drawRangeslider(data: TemperatureRecord[]) : void;

@Component({
  selector: 'app-rangeslider',
  templateUrl: './rangeslider.component.html',
  styleUrls: ['./rangeslider.component.scss']
})
export class RangesliderComponent implements OnInit {

  @Output() rangeChanged = new EventEmitter<number[]>();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.stations.subscribe(data => {
      if (data.length > 0) {
        drawRangeslider(this.dataService.getStationsAsTemperatureList(data));

        const eventConnectionPoint = document.getElementById('rangeslider');
          eventConnectionPoint?.addEventListener('onrangechange', (e: any) => {
            var range = e.detail;
            this.rangeChanged.emit(range);
          });
      }
    })

  }

}

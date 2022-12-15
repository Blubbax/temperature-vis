import { Station } from './../../model/station';
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

  private currentData: TemperatureRecord[] = [];
  private rawData: TemperatureRecord[] = [];
  public months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  private currentSelection = "Year";

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.stationsFiltered.subscribe((data: Station[]) => {
      // TODO data[0] restriction removen
      this.rawData = this.dataService.getStationsAsTemperatureList([data[0]]);
      this.currentData = this.rawData;
      this.changeSelection(this.currentSelection);
    });
  }

  changeSelection(value: string) {
    if (value == "Year") {
      this.currentData = this.rawData;
    } else {
      const monthNumber = this.convertMonthToNumber(value);
      this.currentData = this.rawData.filter(record => record.month == monthNumber);
    }
    drawLineChart(this.currentData);
  }

  convertMonthToNumber(month: string) {
    var index = -1;
    this.months.forEach((m, i) => {
      if (m == month) {
        index = i + 1;
      }
    });
    return index;
  }

}

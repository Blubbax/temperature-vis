import { Station } from './../../model/station';
import { TemperatureRecord } from './../../model/temperature-record';
import { DataService } from './../../service/data.service';
import { Component, HostListener, OnInit } from '@angular/core';

declare function drawLineChart(data: TemperatureRecord[], linReg: boolean): void;
declare function resizeLineChart(): void;

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
  public showLineChart = false;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {

    const eventConnectionPoint = document.getElementById('linechart-legend');

    eventConnectionPoint?.addEventListener('linechart-unselect', (e: any) => {
      this.dataService.removeFromSelection(e.detail);
    });

    eventConnectionPoint?.addEventListener('linechart-selectThis', (e: any) => {
      this.dataService.selectOnly(e.detail);
    });


    this.dataService.stationsVisSelection.subscribe((data: Station[]) => {
      this.rawData = this.dataService.getStationsAsTemperatureList(data);
      this.currentData = this.rawData;
      this.changeSelection(this.currentSelection);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    resizeLineChart();
  }

  changeSelection(value: string) {
    this.currentSelection = value;
    if (value == "Year") {
      this.currentData = this.rawData;
    } else {
      const monthNumber = this.convertMonthToNumber(value);
      this.currentData = this.rawData.filter(record => record.month == monthNumber);
    }
    drawLineChart(this.currentData, this.showLineChart);
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

  showLinearRegression(show: boolean) {
    this.showLineChart = show;
    drawLineChart(this.currentData, this.showLineChart);
  }

}

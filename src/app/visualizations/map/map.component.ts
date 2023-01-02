import { TemperatureRecord } from './../../model/temperature-record';
import { Station } from './../../model/station';
import { DataService } from './../../service/data.service';
import { Component, HostListener, OnInit } from '@angular/core';

declare function drawMap(data: Station[], temperatureMapping: Map<string, TemperatureRecord | undefined>): void;
declare function resizeMap(): void;
declare function drawLegend(): void;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public selectedDate: Date;
  private selectedTemperatureData: Map<string, TemperatureRecord | undefined> = new Map();
  private stationData: Station[] = [];
  public uniqueDates: Date[] = [];
  public currentSliderValue: number = 0;

  public animationActive = false;
  public animationInterval: any;

  constructor(private dataService: DataService) {
    this.selectedDate = new Date(2016, 3);
  }

  ngOnInit(): void {

    drawLegend();

    this.dataService.stationsFiltered.subscribe(
      data => {
        this.stationData = data;
        this.determineTemperatureAtDate(this.selectedDate);
        drawMap(data, this.selectedTemperatureData);

        var dates: Date[] = [];
        data.forEach(station => dates = dates.concat(station.temperatures.map(temp => temp.date)))

        var uniqueDates = Array.from(
            new Set(dates.map((dateObject) => JSON.stringify(dateObject)))
          ).map((dateString) => new Date(JSON.parse(dateString)));

        uniqueDates = uniqueDates.sort((a, b) => {
          if (a < b) return -1;
          else return 1;
        });

        this.uniqueDates = uniqueDates;
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    resizeMap();
  }

  private determineTemperatureAtDate(date: Date) {
    this.selectedTemperatureData.clear();
    this.stationData.forEach(station => {
      this.selectedTemperatureData.set(station.id, station.getTemperatureAt(date));
    });
    console.log("temperature data updated");
    console.log(this.selectedTemperatureData)
  }

  dateChange(event: any) {
    this.changeMapValues(event.target.value);
  }

  changeMapValues(index: number) {
    this.selectedDate = this.uniqueDates[index];
    this.determineTemperatureAtDate(this.selectedDate);
    drawMap(this.stationData, this.selectedTemperatureData);
  }

  startAnimation() {
    this.animationActive = !this.animationActive;
    // for (let i = 0; i < this.uniqueDates.length; i++) {
    //   setTimeout(() => {
    //     this.changeMapValues(i);
    //   }, 500);
    // }
    this.animationInterval = setInterval(() => {
      this.currentSliderValue += 1;
      this.changeMapValues(this.currentSliderValue);
    }, 200);
  }

  stopAnimation() {
    clearInterval(this.animationInterval);
    this.animationActive = !this.animationActive;
  }

}

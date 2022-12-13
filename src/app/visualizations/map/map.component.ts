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
  }

  dateChange(event: any) {
    this.selectedDate = this.uniqueDates[event.target.value];
    this.determineTemperatureAtDate(this.selectedDate);
    drawMap(this.stationData, this.selectedTemperatureData);
  }

}

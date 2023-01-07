import { TemperatureRecord } from './../../model/temperature-record';
import { Station } from './../../model/station';
import { DataService } from './../../service/data.service';
import { Component, HostListener, OnInit } from '@angular/core'

declare function drawMap(data: Station[], temperatureMapping: Map<string, TemperatureRecord | undefined>, selectedStations: Station[]): void;
declare function resizeMap(): void;
declare function drawLegend(): void;
declare function updateSelection(data: Station[]): void;

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

    const eventConnectionPoint = document.getElementById('map-visualization');

    eventConnectionPoint?.addEventListener('map-unselect', (e: any) => {
      this.dataService.removeFromSelection(e.detail);
    });

    eventConnectionPoint?.addEventListener('map-select', (e: any) => {
      this.dataService.addToSelection(e.detail);
    });

    eventConnectionPoint?.addEventListener('map-selectThis', (e: any) => {
      this.dataService.selectOnly(e.detail);
    });

    this.dataService.stationsFiltered.subscribe(data => {
        this.stationData = data;

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

        this.currentSliderValue = this.uniqueDates.length - 1;


        this.selectedDate = this.uniqueDates[this.uniqueDates.length - 1];
        this.determineTemperatureAtDate(this.selectedDate);
        drawMap(this.stationData, this.selectedTemperatureData, data);

        updateSelection(data);
      }
    );

    this.dataService.stationsVisSelection.subscribe(data => {
      updateSelection(data);
    })

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
    this.changeMapValues(event.target.value);
  }

  changeMapValues(index: number) {
    this.selectedDate = this.uniqueDates[index];
    this.determineTemperatureAtDate(this.selectedDate);
    drawMap(this.stationData, this.selectedTemperatureData, this.dataService.getSelectedStations());
  }

  startAnimation() {
    this.animationActive = !this.animationActive;
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

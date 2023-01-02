import { Component, OnInit } from '@angular/core';
import { stat } from 'fs';
import { FilterData } from 'src/app/model/filter-data';
import { Station } from 'src/app/model/station';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  private currentFilter: FilterData;
  public stations: string[] = [];
  public countries: string[] = [];
  private stationsRaw: Station[] = [];

  constructor(private dataService: DataService) {
    this.currentFilter = new FilterData();
    this.dataService.stations.subscribe(stations => {
      this.stationsRaw = stations;
      this.stations = stations.map(station => station.name);
      this.countries = Array.from(new Set(stations.map(station => station.country)));
    })
  }

  ngOnInit(): void {
  }

  applyRangeFilter(range: number[]) {
    this.currentFilter.timeSpan.yearStart = range[0];
    this.currentFilter.timeSpan.yearEnd = range[1] - 1;
    this.dataService.applyFilter(this.currentFilter);
  }

  countriesChanged(selection: string[]) {
    console.log(selection)
    this.currentFilter.countries = selection;
    this.dataService.applyFilter(this.currentFilter);
  }

  stationsChanged(selection: string[]) {
    this.currentFilter.stations = this.stationsRaw.filter(station => selection.includes(station.name));
    this.dataService.applyFilter(this.currentFilter);
  }

}

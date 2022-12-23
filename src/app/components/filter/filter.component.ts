import { Component, OnInit } from '@angular/core';
import { FilterData } from 'src/app/model/filter-data';
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

  constructor(private dataService: DataService) {
    this.currentFilter = new FilterData();
    this.dataService.stations.subscribe(stations => {
      this.stations = stations.map(station => station.name);
      this.countries = Array.from(new Set(stations.map(station => station.country)));
    })
  }

  ngOnInit(): void {
  }

  applyRangeFilter(range: number[]) {
    this.currentFilter.timeSpan.yearStart = range[0];
    this.currentFilter.timeSpan.yearEnd = range[1];
    this.dataService.applyFilter(this.currentFilter);
  }

  countriesChanged(selection: string[]) {
    console.log(selection)
  }

  stationsChanged(selection: string[]) {
    console.log(selection)
  }

}

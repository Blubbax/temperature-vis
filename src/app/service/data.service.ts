import { FilterData } from './../model/filter-data';
import { TemperatureRecord } from './../model/temperature-record';
import { Station } from './../model/station';
import { StationService } from './station.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // Raw data
  private stationsRaw: Station[] = [];
  private stationsFilteredRaw: Station[] = [];
  private stationsSelectedRaw: Station[] = [];

  // for the filter
  public stations: Observable<Station[]>;
  private stationsSubject: BehaviorSubject<any>;

  // for the visualizations
  public stationsFiltered: Observable<Station[]>;
  private stationsFilteredSubject: BehaviorSubject<any>;

  public stationsVisSelection: Observable<Station[]>;
  private stationsVisSelectionSubject: BehaviorSubject<any>;

  private currentFilter: FilterData | undefined;


  constructor(
    private stationService: StationService,
  ) {

    // Make station data accessible
    this.stationsSubject = new BehaviorSubject<Station[]>([]);
    this.stations = this.stationsSubject.asObservable();

    this.stationsFilteredSubject = new BehaviorSubject<Station[]>([]);
    this.stationsFiltered = this.stationsFilteredSubject.asObservable();

    this.stationsVisSelectionSubject = new BehaviorSubject<Station[]>([]);
    this.stationsVisSelection = this.stationsVisSelectionSubject.asObservable();

    this.stationService.stations.subscribe(stations => {
      this.stationsRaw = Array.from(stations.values());
      this.stationsFilteredRaw = Array.from(stations.values());
      this.stationsSelectedRaw = Array.from(stations.values());

      // Make station data accessible
      this.stationsSubject.next(this.stationsFilteredRaw);
      this.stationsFilteredSubject.next(this.stationsFilteredRaw);
      this.stationsVisSelectionSubject.next(this.stationsSelectedRaw);

    });
  }

  public applyFilter(filter: FilterData) {
    this.currentFilter = filter;

    this.stationsFilteredRaw = Array.from(this.stationsRaw.values());

    if (filter.countries.length > 0) {
      this.stationsFilteredRaw = this.stationsFilteredRaw.filter(record =>
        filter.countries.includes(record.country));
    }

    if (filter.stations.length > 0) {
      this.stationsFilteredRaw = this.stationsFilteredRaw.filter(record =>
        filter.stations.includes(record));
    }

    this.stationsFilteredRaw.forEach(station => {
      station.temperatures = station.temperatures.filter(record =>
        record.year >= filter.timeSpan.yearStart
        && record.year <= filter.timeSpan.yearEnd);
    });

    this.stationsFilteredSubject.next(this.stationsFilteredRaw);
    this.stationsVisSelectionSubject.next(this.stationsFilteredRaw);
  }

  public resetFilter() {
    this.currentFilter = undefined;
    this.stationsFilteredRaw = Array.from(this.stationsRaw.values());
    this.stationsFilteredSubject.next(this.stationsFilteredRaw);
    this.stationsVisSelectionSubject.next(this.stationsFilteredRaw);
  }


  public setSelection(stations: Station[]) {
    this.stationsSelectedRaw = stations;
    this.stationsVisSelectionSubject.next(this.stationsSelectedRaw);
  }

  public resetSelection(stations: Station[]) {
    this.stationsSelectedRaw = Array.from(this.stationsFilteredRaw.values());
    this.stationsVisSelectionSubject.next(this.stationsSelectedRaw);
  }

  public selectOnly(station: Station) {
    this.stationsSelectedRaw = [];
    this.addToSelection(station);
  }

  public addToSelection(station: Station) {
    this.stationsSelectedRaw.push(station);
    this.stationsVisSelectionSubject.next(this.stationsSelectedRaw);
  }

  public removeFromSelection(station: Station) {
    this.stationsSelectedRaw = this.stationsSelectedRaw.filter(current => current.id != station.id);
    this.stationsVisSelectionSubject.next(this.stationsSelectedRaw);
  }

  public getStationsAsTemperatureList(stations: Station[]): TemperatureRecord[] {
    var result: TemperatureRecord[] = [];
    stations.forEach((stat) => {result = result.concat(stat.temperatures)});
    return result;
  }

  public getSelectedStations() {
    return this.stationsSelectedRaw;
  }


}

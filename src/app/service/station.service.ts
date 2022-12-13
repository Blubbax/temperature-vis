import { TemperatureRecord } from './../model/temperature-record';
import { TemperatureService } from './temperature.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Station } from './../model/station';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CountryCodeService } from './country-code.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  private stationsRaw: Map<string, Station> = new Map<string, Station>(); // stationId ==> Station
  private stationsSubject: BehaviorSubject<Map<string, Station>>;
  public stations: Observable<Map<string, Station>>;


  constructor(
    private httpClient: HttpClient,
    private countryCodeService: CountryCodeService,
    private temperatureService: TemperatureService
  ) {
    const headers = new HttpHeaders({
      Accept: 'text/csv',
    });

    this.stationsSubject = new BehaviorSubject<Map<string, Station>>(new Map());
    this.stations = this.stationsSubject.asObservable();

    this.httpClient.get<any>('assets/data/stations-europe.csv', { headers, responseType: 'text' as any })
      .subscribe(result => {
        var dataObjects = result.split('\n');

        this.temperatureService.temperatures.subscribe(temperatures => {

          // filter attributes (fisrt row are headers)
          dataObjects.splice(0, 1);

          dataObjects.forEach((stationString: string) => {
            const stationData = stationString.split(',');

            // 0 ==> Station (id)
            // 1 ==> Latitude
            // 2 ==> Longitude
            // 3 ==> Elevation
            // 4 ==> CountryCode
            // 5 ==> Name
            // 6 ==> YearFirst
            // 7 ==> YearLast

            const station = new Station(
              stationData[0].replace("\"", "").replace("\"", ""),
              parseFloat(stationData[1]),
              parseFloat(stationData[2]),
              parseFloat(stationData[3]),
              this.countryCodeService.getCountryName(stationData[4]),
              stationData[5],
              temperatures.filter(record => record.stationId == stationData[0].replace("\"", "").replace("\"", ""))
            )

            this.stationsRaw.set(station.id, station);
            station.temperatures.forEach(temperature => temperature.station = station);

          });

          this.stationsSubject.next(this.stationsRaw);
        });
      });
  }

}

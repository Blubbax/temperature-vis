import { BehaviorSubject, Observable } from 'rxjs';
import { TemperatureRecord } from './../model/temperature-record';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StationService } from './station.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {

  private temperatureRecords: TemperatureRecord[] = [];

  private temperaturesSubject: BehaviorSubject<TemperatureRecord[]>;
  public temperatures: Observable<TemperatureRecord[]>;


  constructor(
    private httpClient: HttpClient
  ) {

    this.temperaturesSubject = new BehaviorSubject<TemperatureRecord[]>([]);
    this.temperatures = this.temperaturesSubject.asObservable();

    const headers = new HttpHeaders({
      Accept: 'text/csv',
    });

    this.httpClient.get<any>('assets/data/temperature-monthly-europe.csv', { headers, responseType: 'text' as any })
      .subscribe(result => {
        var dataObjects = result.split('\n');

        // filter attributes (fisrt row are headers)
        dataObjects.splice(0, 1);

        dataObjects.forEach((temperatureString: string) => {
          const temperatureData = temperatureString.split(',');

          // 0 ==> Station (id)
          // 1 ==> Year
          // 2 ==> Month
          // 3 ==> Temperature
          // 4 ==> Observations

          const temperatureRecord = new TemperatureRecord(
            temperatureData[0].replace("\"", "").replace("\"", ""),
            parseInt(temperatureData[1]),
            parseInt(temperatureData[2]),
            parseFloat(temperatureData[3]),
            parseInt(temperatureData[4])
          );

          this.temperatureRecords.push(temperatureRecord);


        });

        this.temperaturesSubject.next(this.temperatureRecords);
      });
  }

  public getTemperatures() {
    return this.temperatureRecords;
  }

}

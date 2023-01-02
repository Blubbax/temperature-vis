import { TemperatureRecord } from './temperature-record';


export class Station {
  public id: string;
  public latitude: number;
  public longitude: number;
  public elevation: number;
  public country: string;
  public name: string;
  public temperatures: TemperatureRecord[]

  constructor(
    id: string,
    latitude: number,
    longitude: number,
    elevation: number,
    country: string,
    name: string,
    temperatures: TemperatureRecord[]
  ) {
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.elevation = elevation;
    this.country = country;
    this.name = name;
    this.temperatures = temperatures;
  }

  getTemperatureAt(date: Date): TemperatureRecord | undefined {
    var result = this.temperatures.filter(record =>
      record.month == date.getMonth() + 1
      && record.year == date.getFullYear());

    if (result.length > 0) {
      return result[0];
    } else {
      return undefined;
    }
  }



}

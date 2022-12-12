export class TemperatureRecord {
    public stationId: string;
    public year: number;
    public month: number;
    public date: Date;
    public temperature: number;
    public observations: number;

    constructor (
      stationId: string,
      year: number,
      month: number,
      temperature: number,
      observations: number
    )
    {
      this.stationId = stationId;
      this.year = year;
      this.month = month;
      this.date = new Date(year, month, 1);
      this.temperature = temperature;
      this.observations = observations;
    }
}

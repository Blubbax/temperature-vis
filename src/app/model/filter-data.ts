import { Station } from './station';

export class FilterData {
  public countries: string[];
  public stations: Station[];
  public timeSpan: {yearStart: number, yearEnd: number};

  constructor() {
    this.countries = [];  // no selected means all
    this.stations = [];   // no selected means all
    this.timeSpan = {
      yearStart: Number.MIN_VALUE,
      yearEnd: Number.MAX_VALUE
    };

  }
}

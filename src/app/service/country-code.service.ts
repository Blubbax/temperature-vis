import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryCodeService {

  private countryCodes = new Map<string, string>(); // code ("IT") ==> name ("Italy")

  constructor(private httpClient: HttpClient) {

    const headers = new HttpHeaders({
      Accept: 'text/csv',
    });

    this.httpClient.get<any>('assets/data/country-codes-europe.csv', { headers, responseType: 'text' as any })
      .subscribe(result => {
        var dataObjects = result.split('\n');

        // filter attributes (fisrt row are headers)
        dataObjects.splice(0, 1);
        dataObjects.splice(dataObjects.length-1, 1);

        dataObjects.forEach((countrycodeString: string) => {
          const countryCodeData = countrycodeString.split(',');
          this.countryCodes.set(countryCodeData[0], countryCodeData[1].replace("\"", "").replace("\"", ""));
        });
      });
  }


  public getCountryName(countryCode: string): string {
    const countryName = this.countryCodes.get(countryCode);
    if (countryName !== undefined) {
      return countryName;
    } else {
      return countryCode;
    }
  }

}

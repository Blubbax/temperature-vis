import { TemperatureRecord } from './../../model/temperature-record';
import { DataService } from './../../service/data.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  data: any[] = [];
  @Input() attributes: string[] = [];
  @Input() selectedAttributes: string[] = [];

  selectedObjects: [] = [];

  private currentSortAttribute: string = '';

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.stationsVisSelection.subscribe(result => {
      // this.data = this.dataService.getStationsAsTemperatureList(result);
      this.data = result;
    });
  }

  getAttributeOfObj(obj: any, attribute: string): any {
    return obj[attribute];
  }

  selectObj(obj: any) {

  }

  sort(attribute: string) {
    if (this.currentSortAttribute == attribute) {
      this.data.reverse();
    } else {
      this.data.sort((objA, objB) => {
        if (objA[attribute] < objB[attribute]) {
          return -1;
        } else if (objA[attribute] > objB[attribute]) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    this.currentSortAttribute = attribute;
  }

  attributeRemoved(attr: string) {
    var newList: string[] = [];
    var deleted = false;
    this.selectedAttributes.forEach(element => {
      if (element == attr && deleted === false) {
        deleted = true;
      } else {
        newList.push(element);
      }
    });
    this.selectedAttributes = newList;
  }

}

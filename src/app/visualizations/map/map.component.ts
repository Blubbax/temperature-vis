import { Station } from './../../model/station';
import { DataService } from './../../service/data.service';
import { Component, HostListener, OnInit } from '@angular/core';

declare function drawMap(data: Station[]): void;
declare function resizeMap(): void;
declare function drawLegend(): void;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {

    drawLegend();

    this.dataService.stationsFiltered.subscribe(
      data => {
        console.log(data);
        drawMap(data);
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    resizeMap();
  }

}

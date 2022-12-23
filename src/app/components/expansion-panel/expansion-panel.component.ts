import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit {

  public visibility = false;
  @Input() title: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  toggleVisibility() {
    this.visibility = !this.visibility;
  }

}

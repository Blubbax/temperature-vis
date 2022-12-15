import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-attribute-pill',
  templateUrl: './attribute-pill.component.html',
  styleUrls: ['./attribute-pill.component.scss']
})
export class AttributePillComponent implements OnInit {

  @Input() name: String = '';
  @Output() deleteEvent = new EventEmitter<String>();

  constructor() { }

  ngOnInit(): void {
  }

  onDelete() {
    this.deleteEvent.emit(this.name);
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-attribute-selector',
  templateUrl: './attribute-selector.component.html',
  styleUrls: ['./attribute-selector.component.scss']
})
export class AttributeSelectorComponent implements OnInit {

  @Input() attributes: string[] = [];
  // @Output() attributeAdded = new EventEmitter<string>();
  @Output() attributeRemoved = new EventEmitter<string>();

  @Input() selectedAttributes: string[] = [];

  public selectedAttribute: string = "";

  constructor() {
  }

  ngOnInit(): void {
    if (this.selectedAttributes.length === 0) {
      this.selectedAttributes = this.attributes;
    }
  }

  removeAttribute(attr: string) {
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
    this.attributeRemoved.emit(attr);
  }

  selectAttribute() {
    if (this.selectedAttribute !== "") {
      this.selectedAttributes.push(this.selectedAttribute)
      // this.attributeAdded.emit(this.selectedAttribute);
    }
  }

  changeSelection(attr: string) {
    this.selectedAttribute = attr;
  }

}

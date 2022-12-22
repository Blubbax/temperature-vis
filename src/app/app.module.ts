import { AttributeSelectorComponent } from './visualizations/helper/attribute-selector/attribute-selector.component';
import { AttributePillComponent } from './visualizations/helper/attribute-pill/attribute-pill.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './visualizations/map/map.component';
import { LinechartComponent } from './visualizations/linechart/linechart.component';
import { BoxplotchartComponent } from './visualizations/boxplotchart/boxplotchart.component';
import { TableComponent } from './visualizations/table/table.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FilterComponent } from './components/filter/filter.component';
import { VisualizationsComponent } from './components/visualizations/visualizations.component';
import { RangesliderComponent } from './visualizations/rangeslider/rangeslider.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LinechartComponent,
    BoxplotchartComponent,
    TableComponent,
    HeaderComponent,
    FooterComponent,
    FilterComponent,
    VisualizationsComponent,
    AttributePillComponent,
    AttributeSelectorComponent,
    RangesliderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

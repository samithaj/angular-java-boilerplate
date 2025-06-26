import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';

import { StatisticsRoutingModule } from './statistics-routing-module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    PlotlyModule
  ],
  exports: [
    PlotlyModule
  ]
})
export class StatisticsModule { }

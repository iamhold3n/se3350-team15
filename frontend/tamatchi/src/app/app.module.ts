import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllocateTaHoursComponent } from './allocate-ta-hours/allocate-ta-hours.component';

@NgModule({
  declarations: [
    AppComponent,
    AllocateTaHoursComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllocateTaHoursComponent } from './allocate-ta-hours/allocate-ta-hours.component';
import { AssignTaComponent } from './assign-ta/assign-ta.component';

@NgModule({
  declarations: [
    AppComponent,
    AllocateTaHoursComponent,
    AssignTaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

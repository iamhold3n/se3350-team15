import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseInformationComponent } from './course-information/course-information.component';
import { FormComponent } from './form/form.component';

import { AllocateTaHoursComponent } from './allocate-ta-hours/allocate-ta-hours.component';
import { AssignTaComponent } from './assign-ta/assign-ta.component';
import { RankingComponent } from './ranking/ranking.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LoginComponent } from './login/login.component';
import { CourseQuestionsComponent } from './course-questions/course-questions.component';

import { CallbackPipe } from './callback.pipe'; //allows for filtering of *ngFor using a specified callback function
import { AdminComponent } from './admin/admin.component';
import { HttpClientModule } from '@angular/common/http';

import { SubmitSpreadsheetComponent } from './submit-spreadsheet/submit-spreadsheet.component';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { UploadListComponent } from './upload-list/upload-list.component';
import { UploadDetailsComponent } from './upload-details/upload-details.component';


@NgModule({
  declarations: [
    AppComponent,
    CourseInformationComponent,
    FormComponent,
    AllocateTaHoursComponent,
    AssignTaComponent,
    RankingComponent,
    LoginComponent,
    CourseQuestionsComponent,
    CallbackPipe,
    AdminComponent,
    SubmitSpreadsheetComponent,
    UploadFormComponent,
    UploadListComponent,
    UploadDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebase),
    HttpClientModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [AngularFireModule],
  bootstrap: [AppComponent]
})
export class AppModule { }

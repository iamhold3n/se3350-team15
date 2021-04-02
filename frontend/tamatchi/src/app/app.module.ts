import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
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
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AssignInstructorComponent } from './assign-instructor/assign-instructor.component';
import { ExportQuestionsComponent } from './export-questions/export-questions.component';
import { InsertTaComponent } from './insert-ta/insert-ta.component';
import { TaInfoComponent } from './ta-info/ta-info.component';


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
    FileUploadComponent,
    AssignInstructorComponent,
    ExportQuestionsComponent,
    InsertTaComponent,
    TaInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    HttpClientModule
  ],
  providers: [AngularFireModule],
  bootstrap: [AppComponent]
})
export class AppModule { }

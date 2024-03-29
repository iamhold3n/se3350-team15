import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AllocateTaHoursComponent } from './allocate-ta-hours/allocate-ta-hours.component';
import { AssignTaComponent } from './assign-ta/assign-ta.component';
import { CourseInformationComponent } from './course-information/course-information.component';
import { FormComponent } from './form/form.component';
import { LoginComponent } from './login/login.component';
import { RankingComponent } from './ranking/ranking.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { CourseQuestionsComponent } from './course-questions/course-questions.component';
import { AssignInstructorComponent } from './assign-instructor/assign-instructor.component';
import { ExportQuestionsComponent } from './export-questions/export-questions.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: 'login', component:LoginComponent},
  {path: 'course-information', component: CourseInformationComponent},
  {path: 'course-questions', component: CourseQuestionsComponent},
  {path: 'form', component: FormComponent},
  {path: 'allocate-ta-hours', component:AllocateTaHoursComponent},
  {path: 'assign-ta', component:AssignTaComponent},
  {path: 'ranking', component:RankingComponent},
  {path: 'admin', component:AdminComponent},
  {path: 'file-upload', component:FileUploadComponent},
  {path: 'assign-instructor', component:AssignInstructorComponent},
  {path: 'export-questions', component:ExportQuestionsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseInformationComponent } from './course-information/course-information.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  {path: 'course-information', component: CourseInformationComponent},
  {path: 'form', component: FormComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

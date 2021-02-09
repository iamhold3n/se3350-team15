import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllocateTaHoursComponent } from './allocate-ta-hours/allocate-ta-hours.component';
import { AssignTaComponent } from './assign-ta/assign-ta.component';
import { CourseInformationComponent } from './course-information/course-information.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  {path: 'course-information', component: CourseInformationComponent},
  {path: 'form', component: FormComponent},
  {path: 'allocate-ta-hours', component:AllocateTaHoursComponent},
  {path: 'assign-ta', component:AssignTaComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

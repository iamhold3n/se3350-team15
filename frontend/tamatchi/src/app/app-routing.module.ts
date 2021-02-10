import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllocateTaHoursComponent } from './allocate-ta-hours/allocate-ta-hours.component';
import { AssignTaComponent } from './assign-ta/assign-ta.component';
import { CourseInformationComponent } from './course-information/course-information.component';
import { FormComponent } from './form/form.component';
import { RankingComponent } from './ranking/ranking.component';

const routes: Routes = [
  {path: 'course-information', component: CourseInformationComponent},
  {path: 'form', component: FormComponent},
  {path: 'allocate-ta-hours', component:AllocateTaHoursComponent},
  {path: 'assign-ta', component:AssignTaComponent},
  {path: 'ranking', component:RankingComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

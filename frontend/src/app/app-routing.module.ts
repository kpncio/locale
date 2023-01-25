import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { InformationComponent } from './components/information/information.component';
import { UnknownComponent } from './components/unknown/unknown.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'information', component: InformationComponent},
  { path: '**', component: UnknownComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

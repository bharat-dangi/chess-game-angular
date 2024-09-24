import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { Iframe1Component } from './iframe1/iframe1.component';
import { Iframe2Component } from './iframe2/iframe2.component';

const routes: Routes = [
  { path: '', redirectTo: '/mainpage', pathMatch: 'full' }, // Redirect to mainpage by default
  { path: 'mainpage', component: MainPageComponent }, // Host the main page with iframes
  { path: 'iframe1', component: Iframe1Component }, // Route for iframe 1
  { path: 'iframe2', component: Iframe2Component }, // Route for iframe 2
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

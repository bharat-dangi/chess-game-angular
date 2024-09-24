import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { Iframe1Component } from './iframe1/iframe1.component';
import { Iframe2Component } from './iframe2/iframe2.component';
import { OnlineGameComponent } from './online-game/online-game.component';

const routes: Routes = [
  { path: '', redirectTo: '/mainpage', pathMatch: 'full' },
  { path: 'mainpage', component: MainPageComponent },
  { path: 'iframe1', component: Iframe1Component },
  { path: 'iframe2', component: Iframe2Component },
  { path: 'online-game', component: OnlineGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

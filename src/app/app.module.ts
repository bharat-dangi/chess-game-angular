import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { Iframe1Component } from './iframe1/iframe1.component';
import { Iframe2Component } from './iframe2/iframe2.component';

// Import the NgxChessBoardModule
import { NgxChessBoardModule } from 'ngx-chess-board';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    Iframe1Component,
    Iframe2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChessBoardModule.forRoot(), // Ensure correct import
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

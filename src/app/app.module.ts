import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat'; // Firebase compatibility module
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AppComponent } from './app.component';
import { OnlineGameComponent } from './online-game/online-game.component';
import { MainPageComponent } from './main-page/main-page.component';
import { Iframe1Component } from './iframe1/iframe1.component';
import { Iframe2Component } from './iframe2/iframe2.component';
import { AppRoutingModule } from './app-routing.module';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environment/environment';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    Iframe1Component,
    Iframe2Component,
    OnlineGameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireDatabaseModule,
    NgxChessBoardModule.forRoot(),
    FormsModule,
    AngularFireModule.initializeApp({
      // Initialize Firebase here in the imports array
      apiKey: environment.firebaseApiKey,
      authDomain: environment.firebaseAuthDomain,
      projectId: environment.firebaseProjectId,
      storageBucket: environment.firebaseBucket,
      messagingSenderId: environment.firebaseMessageId,
      appId: environment.firebaseAppId,
      databaseURL: environment?.databaseURL,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MeetingComponent } from './meeting/meeting.component';
import { HomeComponent } from './home/home.component';
import { JoinMeetComponent } from './join-meet/join-meet.component';
import { WhiteboardComponent } from './join-meet/whiteboard/whiteboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerComponent } from './color-picker/color-picker.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    MeetingComponent,
    HomeComponent,
    JoinMeetComponent,
    WhiteboardComponent,
  
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    NgbModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ColorPickerComponent,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

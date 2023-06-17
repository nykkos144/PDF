import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageModule } from './modules/home-page.module';
import { ToolPageModule } from './modules/tool-page.module';
import { ReviewPageModule } from './modules/review-page.module';
import { EditPageModule } from './modules/edit-page.module';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomePageModule,
    ToolPageModule,
    ReviewPageModule,
    EditPageModule,

    NgxElectronModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

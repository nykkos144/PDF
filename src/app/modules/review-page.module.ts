import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewPageComponent } from '../components/review-page/review-page.component';
import { TopbarModule } from '../shared/modules/topbar.module';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    ReviewPageComponent
  ],
  imports: [
    CommonModule,
    TopbarModule,
    AppRoutingModule
  ],
  bootstrap: [ReviewPageComponent]
})
export class ReviewPageModule { }

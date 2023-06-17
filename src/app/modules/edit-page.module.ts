import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPageComponent } from '../components/edit-page/edit-page/edit-page.component';
import { TopbarModule } from '../shared/modules/topbar.module';



@NgModule({
  declarations: [
    EditPageComponent
  ],
  imports: [
    CommonModule,
    TopbarModule
  ],
  bootstrap: [EditPageComponent]
})
export class EditPageModule { }
